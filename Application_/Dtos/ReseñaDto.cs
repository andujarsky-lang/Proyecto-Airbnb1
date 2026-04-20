using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class ReseñaDto
    {
        [Required]
        public int ReservaId { get; set; }

        [Range(1, 5, ErrorMessage = "La calificación debe estar entre 1 y 5 estrellas.")]
        public int Calificacion { get; set; }

        [Required(ErrorMessage = "El comentario no puede estar vacío.")]
        [StringLength(500, ErrorMessage = "El comentario es muy largo.")]
        public string Comentario { get; set; } = string.Empty;
    }
}
