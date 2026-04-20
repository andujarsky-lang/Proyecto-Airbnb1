using Application.Interfaces;
using Microsoft.AspNetCore.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class LocalImagenService : IImagenService
    {
        private readonly IWebHostEnvironment _env;

        // Inyectamos el entorno para saber dónde está la carpeta del proyecto
        public LocalImagenService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public async Task<string> SubirImagenAsync(Stream archivoStream, string nombreArchivo)
        {
            // 1. Apuntamos a la carpeta "wwwroot/uploads"
            string carpetaUploads = Path.Combine(_env.WebRootPath, "uploads");

            // Si la carpeta no existe, la creamos mágicamente
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