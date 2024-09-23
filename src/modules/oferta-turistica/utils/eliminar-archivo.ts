import * as fs from 'fs/promises';

export async function eliminarArchivo(ruta: string) {
	try {
		await fs.unlink(ruta);
	} catch (error) {
		console.error(`Error al eliminar el archivo ${ruta}:`, error);
	}
}
