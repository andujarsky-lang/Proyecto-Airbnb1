using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class PropiedadConEstrellasDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Ubicacion { get; set; } = string.Empty;
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        public double PromedioCalificacion { get; set; }
    }
}
