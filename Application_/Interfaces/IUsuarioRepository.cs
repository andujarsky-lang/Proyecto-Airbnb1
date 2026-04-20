using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IUsuarioRepository
    {
        // Busca un usuario en la base de datos usando su correo
        Task<Usuario?> ObtenerPorCorreoAsync(string correo);

        // Busca un usuario usando su ID numérico
        Task<Usuario?> ObtenerPorIdAsync(int id);

        // Agrega un usuario nuevo a la memoria
        Task AgregarAsync(Usuario usuario);

        // Guarda los cambios reales en la base de datos
        Task GuardarCambiosAsync();
    }
}
