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
        private readonly string _jsonFilePath;
        private List<Coach> _coaches;

        public CoachRepository()
        {
            _jsonFilePath = Path.Combine("Data", "coaches.json");
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
            return await Task.FromResult(_coaches.FirstOrDefault(c => c.IdUser == id));
        }

        public async Task<Coach> GetCoachByEmail(string email)
        {
            return await Task.FromResult(_coaches.FirstOrDefault(c => c.Mail.Equals(email, StringComparison.OrdinalIgnoreCase)));
        }

        public async Task<Coach> CreateCoach(string nombre, string apellido, string fechaNacimiento, string mail, string telefono, string contraseña, string licencia, DateTime fechaIngreso, int aniosExperiencia)
        {
            int newId = _coaches.Count > 0 ? _coaches.Max(c => c.IdUser) + 1 : 1;
            var newCoach = new Coach(nombre, apellido, fechaNacimiento, mail, telefono, contraseña, licencia, fechaIngreso, aniosExperiencia)
            {
                IdUser = newId
            };

            _coaches.Add(newCoach);
            SaveCoaches();
            return await Task.FromResult(newCoach);
        }

        public async Task<bool> DeleteCoach(int id)
        {
            var coach = _coaches.FirstOrDefault(c => c.IdUser== id);
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