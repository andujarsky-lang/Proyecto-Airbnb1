using Application.Dtos;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUsuarioService
    {
        // 1. Contrato para registrar: Recibe el paquete de datos y responde con resultado detallado
        Task<RegistroResultDto> Registrar(UsuarioDto usuarioDto);

        // 2. Contrato para login: retorna un objeto con Exito, Token y MensajeError (ya no un string crudo)
        Task<LoginResultDto> Login(string correo, string password);

        Task<bool> ConfirmarEmailAsync(string correo, string token);
    }
}
