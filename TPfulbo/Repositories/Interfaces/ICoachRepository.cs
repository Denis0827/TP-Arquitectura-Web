using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface ICoachRepository
    {
        Task<IEnumerable<Coach>> GetAllCoaches();
        Task<Coach> GetCoachById(int idCoach);
        Task<Coach> GetCoachByUserId(int idUser);
        Task<Coach> CreateCoach(int idUser, string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña);
        Task<bool> DeleteCoach(int idCoach);
        Task<bool> DeleteCoachByUserId(int idUser);
        Task<Coach> GetCoachByEmail(string email);
    }
} 