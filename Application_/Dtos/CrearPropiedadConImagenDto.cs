using Microsoft.AspNetCore.Http;

namespace Application.Dtos
{
    // Este DTO solo se usa en el Controller para recibir el form-data
    // No viola Onion porque es solo para binding HTTP, no para lógica de negocio
    public class CrearPropiedadConImagenDto
    {
        public string Nombre { get; set; } = null!;
        public string Ubicacion { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        public IFormFile? ImagenPrincipal { get; set; }
    }
}
