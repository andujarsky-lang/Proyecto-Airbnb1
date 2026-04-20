using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Reserva
    {
        public int Id { get; set; }
        public int PropiedadId { get; set; }
        public int GuestId { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public EstadoReserva Estado { get; set; } = EstadoReserva.Pendiente; public DateTime FechaReserva { get; set; }
        public decimal PrecioTotal { get; set; }

    }
}
