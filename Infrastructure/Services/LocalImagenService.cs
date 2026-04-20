using Application.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class LocalImagenService : IImagenService
    {
        public LocalImagenService()
        {
        }

        public async Task<string> SubirImagenAsync(Stream archivoStream, string nombreArchivo)
        {
            // 1. Buscamos la carpeta raíz del proyecto API automáticamente
            string rutaRaiz = Directory.GetCurrentDirectory();
            string carpetaUploads = Path.Combine(rutaRaiz, "wwwroot", "uploads");

            // Si la carpeta no existe, la creamos
            if (!Directory.Exists(carpetaUploads))
            {
                Directory.CreateDirectory(carpetaUploads);
            }

            // 2. Generamos un nombre único (ej. a1b2c3d4_casa.jpg)
            string nombreUnico = $"{Guid.NewGuid()}_{Path.GetFileName(nombreArchivo)}";
            string rutaCompleta = Path.Combine(carpetaUploads, nombreUnico);

            // 3. Escribimos el archivo en el disco duro
            using (var fileStream = new FileStream(rutaCompleta, FileMode.Create))
            {
                await archivoStream.CopyToAsync(fileStream);
            }

            // 4. Retornamos la ruta relativa para guardarla en SQL Server
            return $"/uploads/{nombreUnico}";
        }
    }
}