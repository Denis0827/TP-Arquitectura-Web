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
        Task<Coach> CreateCoach(string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña, string licencia, DateTime fechaIngreso, int aniosExperiencia);
        Task<bool> DeleteCoach(int idCoach);
        Task<Coach> GetCoachByEmail(string email);
    }
} 