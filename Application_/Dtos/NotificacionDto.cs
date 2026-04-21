namespace Application.Dtos
{
    public class NotificacionDto
    {
        public int Id { get; set; }
        public string Mensaje { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public bool Leida { get; set; }
        public int UsuarioId { get; set; }
    }
}