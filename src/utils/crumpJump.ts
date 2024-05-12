import fs from 'node:fs/promises';
import path from 'node:path';

export async function crumpJump(rutaCarpeta: string): Promise<void> {
  try {
    const archivos = await fs.readdir(rutaCarpeta);
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 1);

    await Promise.all(archivos.map(async (archivo) => {
      const rutaArchivo = path.join(rutaCarpeta, archivo);
      const stats = await fs.stat(rutaArchivo);
      if (stats.isFile()) {
        const fechaCreacion = stats.birthtime;
        if (fechaCreacion < fechaLimite) {
          await fs.unlink(rutaArchivo);
          console.log(`Archivo eliminado: ${rutaArchivo}`);
        }
      }
    }));
  } catch (error) {
    console.error(`Error al eliminar archivos antiguos de la carpeta ${rutaCarpeta}: ${error}`);
  }
}