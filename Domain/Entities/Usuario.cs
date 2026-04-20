using Domain.Enums;

namespace Domain.Entities
{

    public class Usuario
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public string? PasswordHash { get; set; }
        public RolUsuario Rol { get; set; }
        public bool IsEmailConfirmed { get; set; } = false;
        public string? ConfirmationToken { get; set; }
        public DateTime? TokenExpiration { get; set; }

    }
}
