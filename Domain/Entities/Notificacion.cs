using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Notificacion
    {
        public int Id { get; set; }
        public string? Mensaje { get; set; }
        public DateTime FechaCreacion { get; set; }
        public bool? Leida { get; set; }
        public int UsuarioId { get; set; }
    }
}
