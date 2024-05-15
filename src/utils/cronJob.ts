import fs from 'node:fs/promises';
import path from 'node:path';

export async function cronJob(rutaArchivo: string): Promise<void> {
  try {
    const rutaCarpeta = path.dirname(rutaArchivo);
    const archivos = await fs.readdir(rutaCarpeta);
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 1);

    await Promise.all(archivos.map(async (archivo) => {
      const rutaCompleta = path.join(rutaCarpeta, archivo);
      const stats = await fs.stat(rutaCompleta);
      if (stats.isFile()) {
        const fechaCreacion = stats.birthtime;
        if (fechaCreacion < fechaLimite) {
          await fs.unlink(rutaCompleta);
          console.log(`Archivo eliminado: ${rutaCompleta}`);
        }
      }
    }));
  } catch (error) {
    console.error(`Error al eliminar el archivo ${rutaArchivo}: ${error}`);
  }
}