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
    public class CoachRepository : ICoachRepository
    {
        private readonly string _jsonFilePath = "coaches.json";
        private List<Coach> _coaches;

        public CoachRepository()
        {
            LoadCoaches();
        }

        private void LoadCoaches()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _coaches = JsonSerializer.Deserialize<List<Coach>>(jsonString) ?? new List<Coach>();
            }
            else
            {
                _coaches = new List<Coach>();
                SaveCoaches();
            }
        }

        private void SaveCoaches()
        {
            var jsonString = JsonSerializer.Serialize(_coaches, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Coach>> GetAllCoaches()
        {
            return await Task.FromResult(_coaches);
        }

        public async Task<Coach> GetCoachById(int id)
        {
            return await Task.FromResult(_coaches.FirstOrDefault(c => c.IdCoach == id));
        }

        public async Task<Coach> GetCoachByUserId(int userId)
        {
            return await Task.FromResult(_coaches.FirstOrDefault(c => c.IdUser == userId));
        }

        public async Task<Coach> GetCoachByEmail(string email)
        {
            return await Task.FromResult(_coaches.FirstOrDefault(c => c.Mail.Equals(email, StringComparison.OrdinalIgnoreCase)));
        }

        public async Task<Coach> CreateCoach(int idUser, string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña)
        {
            // Verificar si ya existe un coach con ese idUser
            if (_coaches.Any(c => c.IdUser == idUser))
                throw new InvalidOperationException($"Ya existe un coach para el usuario {idUser}");

            int newId = _coaches.Count > 0 ? _coaches.Max(c => c.IdCoach) + 1 : 1;
            var newCoach = new Coach(newId, nombre, apellido, fechaNacimiento, mail, telefono, contraseña)
            {
                IdCoach = newId
            };

            _coaches.Add(newCoach);
            SaveCoaches();
            return await Task.FromResult(newCoach);
        }

        public async Task<bool> DeleteCoach(int id)
        {
            var coach = _coaches.FirstOrDefault(c => c.IdCoach == id);
            if (coach != null)
            {
                _coaches.Remove(coach);
                SaveCoaches();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<bool> DeleteCoachByUserId(int userId)
        {
            var coach = _coaches.FirstOrDefault(c => c.IdUser == userId);
            if (coach != null)
            {
                _coaches.Remove(coach);
                SaveCoaches();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }
    }
} 