using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class PropiedadDto
    {
        [Required(ErrorMessage = "El nombre de la propiedad es obligatorio.")]
        [StringLength(100, MinimumLength = 5, ErrorMessage = "El nombre debe tener entre 5 y 100 caracteres.")]
        public string Nombre { get; set; } = string.Empty;

        [Required(ErrorMessage = "Debes incluir una descripción.")]
        [StringLength(500, MinimumLength = 20, ErrorMessage = "La descripción debe ser detallada (mínimo 20 caracteres).")]
        public string Descripcion { get; set; } = string.Empty;
        public string? Ubicacion { get; set; }

        [Required(ErrorMessage = "El precio por noche es obligatorio.")]
        [Range(10.0, 10000.0, ErrorMessage = "El precio por noche debe ser entre $10 y $10,000.")]
        public decimal PrecioPorNoche { get; set; }
        public int Capacidad { get; set; }
        public int HostId { get; set; }
        public DateTime FechaRegistro { get; set; }
    }
}
