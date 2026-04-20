using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class FiltroBusquedaDto
    {
        public string? Ubicacion { get; set; }
        public int? CapacidadMinima { get; set; }
        public decimal? PrecioMaximo { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int Pagina { get; set; } = 1; // Por defecto página 1
        public int TamañoPagina { get; set; } = 10; // Por defecto 10 resultados
    }
}
