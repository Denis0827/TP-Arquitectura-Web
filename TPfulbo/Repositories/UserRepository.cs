using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly List<User> _users;

        public UserRepository()
        {
            // Mock data para pruebas
            _users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Nombre = "Juan",
                    Apellido = "Pérez",
                    FechaNacimiento = new DateTime(1990, 5, 15),
                    Mail = "juan.perez@email.com",
                    Telefono = "11-1234-5678",
                    Contraseña = "Password123"
                },
                new User
                {
                    Id = 2,
                    Nombre = "María",
                    Apellido = "González",
                    FechaNacimiento = new DateTime(1988, 8, 23),
                    Mail = "maria.gonzalez@email.com",
                    Telefono = "11-2345-6789",
                    Contraseña = "Password456"
                },
                new User
                {
                    Id = 3,
                    Nombre = "Carlos",
                    Apellido = "Rodríguez",
                    FechaNacimiento = new DateTime(1995, 3, 10),
                    Mail = "carlos.rodriguez@email.com",
                    Telefono = "11-3456-7890",
                    Contraseña = "Password789"
                }
            };
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await Task.FromResult(_users);
        }

        public async Task<User> GetUserById(int id)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => u.Id == id));
        }

        public async Task<User> CreateUser(User user)
        {
            user.Id = _users.Max(u => u.Id) + 1;
            _users.Add(user);
            return await Task.FromResult(user);
        }

        public async Task<User> UpdateUser(User user)
        {
            var existingUser = _users.FirstOrDefault(u => u.Id == user.Id);
            if (existingUser != null)
            {
                existingUser.Nombre = user.Nombre;
                existingUser.Apellido = user.Apellido;
                existingUser.FechaNacimiento = user.FechaNacimiento;
                existingUser.Mail = user.Mail;
                existingUser.Telefono = user.Telefono;
                existingUser.Contraseña = user.Contraseña;
            }
            return await Task.FromResult(existingUser);
        }

        public async Task<bool> DeleteUser(int id)
        {
            var user = _users.FirstOrDefault(u => u.Id == id);
            if (user != null)
            {
                _users.Remove(user);
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => u.Mail.Equals(email, StringComparison.OrdinalIgnoreCase)));
        }
    }
} 