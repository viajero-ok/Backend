import * as fs from 'fs/promises';

export async function eliminarArchivos(rutas: string[]) {
	for (const ruta of rutas) {
		try {
			await fs.unlink(ruta);
		} catch (error) {
			console.error(`Error al eliminar el archivo ${ruta}:`, error);
		}
	}
}
