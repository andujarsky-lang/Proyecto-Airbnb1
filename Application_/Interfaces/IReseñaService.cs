using Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IReseñaService
    {
        Task<bool> CrearReseña(ReseñaDto dto, int userId);
    }
}
