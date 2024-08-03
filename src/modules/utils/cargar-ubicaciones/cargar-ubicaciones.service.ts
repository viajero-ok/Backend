import { BadRequestException, Injectable } from '@nestjs/common';
import * as Excel from 'exceljs';
import { startCase, toLower } from 'lodash';
import { DataSource } from 'typeorm';

@Injectable()
export class CargarUbicacionesService {
	constructor(private dataSource: DataSource) {}
	private noActualizadas: any[] = [];
	async processExcel(fileBuffer: Buffer): Promise<Buffer> {
		if (!fileBuffer || fileBuffer.length === 0) {
			throw new BadRequestException(
				'El archivo proporcionado está vacío o no es válido',
			);
		}

		try {
			const workbook = new Excel.Workbook();
			await workbook.xlsx.load(fileBuffer);

			const worksheet = workbook.getWorksheet(1);
			if (!worksheet) {
				throw new BadRequestException(
					'No se pudo encontrar la hoja de cálculo en el archivo Excel',
				);
			}

			worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
				if (rowNumber === 1) return; // Skip header row
				//if (rowNumber > 11) return false; // Stop reading after row 10

				// Process 'Nombre' column
				if (row.getCell('A').value) {
					row.getCell('A').value = this.formatName(
						row.getCell('A').value as string,
					);
				}

				// Process 'Gobierno Local' column
				if (row.getCell('F').value) {
					console.log(row.getCell('F').value);
					row.getCell('F').value = this.formatName(
						row.getCell('F').value as string,
					);
					console.log(row.getCell('F').value);
				}

				// Process 'Departamento' column
				if (row.getCell('G').value) {
					row.getCell('G').value = this.formatName(
						row.getCell('G').value as string,
					);
				}

				// Process 'Provincia' column
				if (row.getCell('H').value) {
					row.getCell('H').value = this.formatName(
						row.getCell('H').value as string,
					);
				}
			});

			return (await workbook.xlsx.writeBuffer()) as Buffer;
		} catch (error) {
			throw new BadRequestException(
				`Error al procesar el archivo Excel: ${error.message}`,
			);
		}
	}

	private formatName(input: string): string {
		return startCase(toLower(input));
	}

	async cargarDatosDesdeExcel(fileBuffer: Buffer): Promise<Buffer> {
		if (!fileBuffer || fileBuffer.length === 0) {
			throw new BadRequestException(
				'El archivo proporcionado está vacío o no es válido',
			);
		}

		try {
			this.noActualizadas = [];
			const workbook = new Excel.Workbook();
			await workbook.xlsx.load(fileBuffer);

			const worksheet = workbook.getWorksheet(1);
			if (!worksheet) {
				throw new BadRequestException(
					'No se pudo encontrar la hoja de cálculo en el archivo Excel',
				);
			}

			const ubicaciones = [];

			worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
				if (rowNumber === 1) return; // Ignorar la fila de encabezados

				const fila = {
					localidad: row.getCell('A').value,
					latitud: row.getCell('D').value,
					longitud: row.getCell('E').value,
					departamento: row.getCell('G').value,
					provincia: row.getCell('H').value,
				};

				ubicaciones.push(fila);
			});
			console.log(ubicaciones);
			await this.cargarDatosEnBD(ubicaciones);
			if (this.noActualizadas.length > 0) {
				return (await this.guardarNoActualizadasEnExcel()) as Buffer;
			}
		} catch (error) {
			throw new BadRequestException(
				`Error al procesar el archivo Excel: ${error.message}`,
			);
		}
	}

	private async cargarDatosEnBD(datos: any[]): Promise<void> {
		for (const fila of datos) {
			try {
				const actualizado = await this.actualizarUbicacion({
					localidad: fila.localidad,
					latitud: fila.latitud,
					longitud: fila.longitud,
					departamento: fila.departamento,
					provincia: fila.provincia,
				});
				if (!actualizado) {
					this.noActualizadas.push(fila);
				}
			} catch (error) {
				console.error(
					`Error procesando fila: ${JSON.stringify(fila)}`,
					error,
				);
			}
		}
	}

	private async actualizarUbicacion(datos: {
		localidad: string;
		latitud: number;
		longitud: number;
		departamento: string;
		provincia: string;
	}): Promise<boolean> {
		const queryRunner = this.dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction();

		try {
			const result = await queryRunner.query(
				`UPDATE LOCALIDADES l
				JOIN DEPARTAMENTOS d ON l.ID_DEPARTAMENTO= d.ID_DEPARTAMENTO
				JOIN PROVINCIAS p ON d.ID_PROVINCIA = p.ID_PROVINCIA
				SET 
				l.TX_LATITUD = ?,
				l.TX_LONGITUD = ?
				WHERE 
				l.TX_LOCALIDAD = ? AND
				d.TX_DEPARTAMENTO = ? AND
				p.TX_PROVINCIA = ?`,
				[
					datos.latitud,
					datos.longitud,
					datos.localidad,
					datos.departamento,
					datos.provincia,
				],
			);

			if (result.affectedRows === 0) {
				console.log(
					`No se encontró coincidencia para: ${datos.localidad}, ${datos.departamento}, ${datos.provincia}`,
				);
			} else {
				console.log(
					`Actualizada ubicación para: ${datos.localidad}, ${datos.departamento}, ${datos.provincia}`,
				);
			}

			await queryRunner.commitTransaction();
			return result.affectedRows > 0;
		} catch (err) {
			await queryRunner.rollbackTransaction();
			throw new Error(`Error al actualizar ubicación: ${err.message}`);
		} finally {
			await queryRunner.release();
		}
	}

	private async guardarNoActualizadasEnExcel(): Promise<Buffer> {
		const workbook = new Excel.Workbook();
		const worksheet = workbook.addWorksheet('No Actualizadas');

		worksheet.columns = [
			{ header: 'Localidad', key: 'localidad' },
			{ header: 'Latitud', key: 'latitud' },
			{ header: 'Longitud', key: 'longitud' },
			{ header: 'Departamento', key: 'departamento' },
			{ header: 'Provincia', key: 'provincia' },
		];

		this.noActualizadas.forEach((fila) => {
			worksheet.addRow(fila);
		});

		return (await workbook.xlsx.writeBuffer()) as Buffer;
	}
}
