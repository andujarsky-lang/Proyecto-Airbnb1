using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class CrearPropiedadDto
    {
        public string Nombre { get; set; } = null!;
        public string Ubicacion { get; set; } = null!;
        public string Descripcion { get; set; } = null!;
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        public int HostId { get; set; }
        public IFormFile? ImagenPrincipal { get; set; }
    }
}
