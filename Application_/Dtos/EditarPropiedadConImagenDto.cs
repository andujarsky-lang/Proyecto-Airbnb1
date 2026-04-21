using Microsoft.AspNetCore.Http;

namespace Application.Dtos
{
    // Este DTO solo se usa en el Controller para recibir el form-data
    public class EditarPropiedadConImagenDto
    {
        public string Nombre { get; set; } = null!;
        public string Ubicacion { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        public IFormFile? NuevaImagen { get; set; }
    }
}
