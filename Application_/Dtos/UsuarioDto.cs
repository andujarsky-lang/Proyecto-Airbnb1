using Domain.Entities;
using Domain.Enums;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos
{
    public class UsuarioDto
    {
        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 50 caracteres.")]
        public string? Nombre { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        public string? Correo { get; set; }

        [Required(ErrorMessage = "La contraseña es obligatoria.")]
        [StringLength(20, MinimumLength = 8, ErrorMessage = "La contraseña debe estar entre 8 y 20 caracteres y debe contener al menos una mayúscula, una minúscula y un número..")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "El rol de usuario es obligatorio.")]
        public RolUsuario Rol { get; set; }
    }
}
