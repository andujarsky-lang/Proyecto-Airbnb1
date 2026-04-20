using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Propiedad
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public string? Ubicacion { get; set; }
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        public int HostId { get; set; }
        public DateTime FechaRegistro { get; set; }
        public ICollection<Reseña> Reseñas { get; set; } = new List<Reseña>();
        public ICollection<Reserva> Reservas { get; set; } = new List<Reserva>();
        public DateTime UltimaActividad { get; set; } = DateTime.UtcNow;
        public string? ImagenPrincipalUrl { get; set; }

        [Timestamp]
        public byte[]? RowVersion { get; set; }
        public List<ImagenPropiedad> Imagenes { get; set; } = new List<ImagenPropiedad>();
    }
}
