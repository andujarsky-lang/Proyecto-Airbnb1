using Domain.Entities;
using System;

namespace Application.Interfaces
{
    public interface ITokenService
    {
        string GenerarToken(Usuario usuario);
    }
}
