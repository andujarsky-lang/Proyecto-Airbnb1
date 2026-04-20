using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task EnviarCorreoAsync(string destinatario, string asunto, string cuerpo)
        {
            // 1. Extraemos nuestras credenciales de Google del appsettings
            var emailSettings = _config.GetSection("EmailSettings");
            var smtpServer = emailSettings["SmtpServer"]!;
            var smtpPort = int.Parse(emailSettings["SmtpPort"]!); // Puerto 587
            var senderName = emailSettings["SenderName"]!;
            var senderEmail = emailSettings["SenderEmail"]!;
            var appPassword = emailSettings["AppPassword"]!;

            try
            {
               var mensaje = new MailMessage
                {
                    From = new MailAddress(senderEmail, senderName),
                    Subject = asunto,
                    Body = cuerpo,
                    IsBodyHtml = true
                };

                mensaje.To.Add(destinatario);

                using var smtpClient = new SmtpClient(smtpServer, smtpPort);

                smtpClient.UseDefaultCredentials = false;

                smtpClient.Credentials = new NetworkCredential(senderEmail, appPassword);
                smtpClient.EnableSsl = true;

                // 4. Despachamos el correo
                await smtpClient.SendMailAsync(mensaje);
                Console.WriteLine($"\n[SMTP] ¡Correo enviado con éxito a {destinatario}!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"\n[ERROR SMTP] Falló el envío del correo: {ex.Message}");
            }
        }
    }
}