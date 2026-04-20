using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class ReservaResponseDto
    {
        public int Id { get; set; }
        public int PropiedadId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public decimal PrecioTotal { get; set; }
        public string? Estado { get; set; }
        public DateTime FechaReserva { get; set; }
    }
}
