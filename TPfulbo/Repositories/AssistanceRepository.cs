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
    public class AssistanceRepository : IAssistanceRepository
    {
        private readonly string _jsonFilePath = "assistances.json";
        private List<Assistance> _assistances;

        public AssistanceRepository()
        {
            LoadAssistances();
        }

        private void LoadAssistances()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _assistances = JsonSerializer.Deserialize<List<Assistance>>(jsonString) ?? new List<Assistance>();
            }
            else
            {
                _assistances = new List<Assistance>();
                SaveAssistances();
            }
        }

        private void SaveAssistances()
        {
            var jsonString = JsonSerializer.Serialize(_assistances, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Assistance>> GetAllAssistances()
        {
            return await Task.FromResult(_assistances);
        }

        public async Task<Assistance> GetAssistanceById(int id)
        {
            return await Task.FromResult(_assistances.FirstOrDefault(a => a.Id == id));
        }

        public async Task<Assistance> CreateAssistance(int idPlayer, int idMatch)
        {
            var newAssistance = new Assistance(idPlayer, idMatch)
            {
                Id = _assistances.Count > 0 ? _assistances.Max(a => a.Id) + 1 : 1
            };

            _assistances.Add(newAssistance);
            SaveAssistances();
            return await Task.FromResult(newAssistance);
        }

        public async Task<bool> DeleteAssistance(int id)
        {
            var assistance = _assistances.FirstOrDefault(a => a.Id == id);
            if (assistance != null)
            {
                _assistances.Remove(assistance);
                SaveAssistances();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<IEnumerable<Assistance>> GetAssistancesByPlayerId(int idPlayer)
        {
            return await Task.FromResult(_assistances.Where(a => a.IdPlayer == idPlayer));
        }

        public async Task<IEnumerable<Assistance>> GetAssistancesByMatchId(int idMatch)
        {
            return await Task.FromResult(_assistances.Where(a => a.IdMatch == idMatch));
        }
    }
} 