using System;
using System.IO;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IImagenService
    {
        Task<string> SubirImagenAsync(Stream archivoStream, string nombreArchivo);
    }
}
