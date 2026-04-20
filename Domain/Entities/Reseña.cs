using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Reseña
    {
        public int Id { get; set; }
        public int Calificacion { get; set; }
        public string? Comentario { get; set; }
        public int PropiedadId { get; set; }
        public int GuestId { get; set; }
        public int ReservaId { get; set; }
    }
}
