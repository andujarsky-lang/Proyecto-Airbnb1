namespace Application.Dtos
{
    public class LoginResultDto
    {
        public bool Exito { get; set; }
        public string? Token { get; set; }
        public string? MensajeError { get; set; }
    }
}
