namespace Application.Dtos
{
    public class RegistroResultDto
    {
        public bool Exito { get; set; }
        public string? MensajeError { get; set; }
        public bool NotificacionEnviada { get; set; }
        public string? MensajeNotificacion { get; set; }
    }
}
