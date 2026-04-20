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
        // 1. Contrato para registrar: Recibe el paquete de datos y responde si funcionó (true/false)
        Task<bool> Registrar(UsuarioDto usuarioDto);

        // 2. Contrato para login: Recibe dos textos y nos devuelve un mensaje de éxito o un Token
        Task<string> Login(string correo, string password);

        Task<bool> ConfirmarEmailAsync(string correo, string token);
    }
}
