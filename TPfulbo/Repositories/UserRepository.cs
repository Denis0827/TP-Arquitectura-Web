using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _jsonFilePath = "users.json";
        private List<User> _users;

        public UserRepository()
        {
            LoadUsers();
        }

        private void LoadUsers()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _users = JsonSerializer.Deserialize<List<User>>(jsonString) ?? new List<User>();
            }
            else
            {
                _users = new List<User>();
                SaveUsers();
            }
        }

        private void SaveUsers()
        {
            var jsonString = JsonSerializer.Serialize(_users, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await Task.FromResult(_users);
        }

        public async Task<User> GetUserById(int id)
        {
            return await Task.FromResult(_users.FirstOrDefault(u => u.IdUser == id));
        }

        public async Task<User> CreateUser(string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
        {
            var newUser = new User(nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
            {
                IdUser = _users.Count > 0 ? _users.Max(u => u.IdUser) + 1 : 1
            };

            _users.Add(newUser);
            SaveUsers();
            return await Task.FromResult(newUser);
        }

        public async Task<bool> DeleteUser(int id)
        {
            var user = _users.FirstOrDefault(u => u.IdUser == id);
            if (user != null)
            {
                _users.Remove(user);
                SaveUsers();
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