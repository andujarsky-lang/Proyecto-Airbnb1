using Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Telegram.Bot;
using Telegram.Bot.Types;

namespace Infrastructure.Services
{
    public class TelegramNotificationService : IEmailService
    {
        private readonly TelegramBotClient _botClient;
        private readonly long _chatId;

        // Constructor que recibe directamente el token y chatId (usado en Program.cs)
        public TelegramNotificationService(string botToken, long chatId)
        {
            if (string.IsNullOrEmpty(botToken))
                throw new ArgumentException("Bot token cannot be null or empty", nameof(botToken));

            _botClient = new TelegramBotClient(botToken);
            _chatId = chatId;
        }

        public async Task EnviarCorreoAsync(string destinatario, string asunto, string cuerpoHtml)
        {
            try
            {
                // Convertimos el HTML a texto plano para Telegram
                var mensaje = $"📧 <b>{asunto}</b>\n\n{ConvertirHtmlATexto(cuerpoHtml)}";

                await _botClient.SendMessage(
                    chatId: _chatId,
                    text: mensaje,
                    parseMode: Telegram.Bot.Types.Enums.ParseMode.Html
                );

                Console.WriteLine($"[TELEGRAM] Mensaje enviado exitosamente a chat {_chatId}");
            }
            catch (Exception ex)
            {
                // Loguear el error con detalles completos
                Console.WriteLine($"[ERROR TELEGRAM] Tipo: {ex.GetType().Name}");
                Console.WriteLine($"[ERROR TELEGRAM] Mensaje: {ex.Message}");
                Console.WriteLine($"[ERROR TELEGRAM] StackTrace: {ex.StackTrace}");
                
                // Re-lanzar la excepción para que el servicio la maneje
                throw new InvalidOperationException($"Error al enviar mensaje de Telegram: {ex.Message}", ex);
            }
        }

        private string ConvertirHtmlATexto(string html)
        {
            // Telegram HTML solo soporta: <b>, <i>, <u>, <s>, <a>, <code>, <pre>
            // Convertimos y limpiamos todo lo demás
            
            var texto = html
                // Convertir encabezados a bold
                .Replace("<h1 style='color: #ff385c;'>", "<b>")
                .Replace("<h1>", "<b>")
                .Replace("</h1>", "</b>\n\n")
                .Replace("<h2>", "<b>")
                .Replace("</h2>", "</b>\n\n")
                
                // Remover divs completamente (no soportados)
                .Replace("<div style='font-family: Arial; border: 1px solid #ddd; padding: 20px;'>", "")
                .Replace("<div>", "")
                .Replace("</div>", "\n")
                
                // Convertir párrafos a saltos de línea
                .Replace("<p>", "")
                .Replace("</p>", "\n\n")
                
                // Saltos de línea
                .Replace("<br>", "\n")
                .Replace("<br/>", "\n")
                .Replace("<br />", "\n")
                
                // Remover atributos de estilo no soportados
                .Replace("style='color: #ff385c;'", "")
                .Replace("style=\"color: #ff385c;\"", "")
                .Replace("style='font-family: Arial; border: 1px solid #ddd; padding: 20px;'", "")
                
                .Trim();

            // Limpiar saltos de línea múltiples
            while (texto.Contains("\n\n\n"))
            {
                texto = texto.Replace("\n\n\n", "\n\n");
            }

            return texto;
        }
    }
}
