using System;
using System.Threading.Tasks;


namespace Application.Interfaces
{
    public interface IEmailService
    {
        Task EnviarCorreoAsync(string destinatario, string asunto, string cuerpo);
    }
}
