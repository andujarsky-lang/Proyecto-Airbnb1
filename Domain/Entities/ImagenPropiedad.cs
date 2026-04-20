using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class ImagenPropiedad
    {
        public int Id { get; set; } 
        public string Url { get; set; } = null!;
        public int PropiedadId { get; set; }
        public Propiedad Propiedad { get; set; } = null!;
    }
}
