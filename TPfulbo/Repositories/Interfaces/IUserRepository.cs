using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User> GetUserById(int id);
        Task<User> CreateUser(string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña);
        Task<bool> DeleteUser(int id);
        Task<User> GetUserByEmail(string email);
    }
} 