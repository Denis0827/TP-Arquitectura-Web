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
    public class MatchRepository : IMatchRepository
    {
        private readonly string _jsonFilePath = "matches.json";
        private List<Match> _matches;

        public MatchRepository()
        {
            LoadMatches();
        }

        private void LoadMatches()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _matches = JsonSerializer.Deserialize<List<Match>>(jsonString) ?? new List<Match>();
            }
            else
            {
                _matches = new List<Match>();
                SaveMatches();
            }
        }

        private void SaveMatches()
        {
            var jsonString = JsonSerializer.Serialize(_matches, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Match>> GetAllMatches()
        {
            return await Task.FromResult(_matches);
        }

        public async Task<Match> GetMatchById(int id)
        {
            return await Task.FromResult(_matches.FirstOrDefault(m => m.Id == id));
        }

        public async Task<Match> CreateMatch(int idCancha, int idCategory, DateTime fecha, TimeSpan hora, int idTeamA, int idTeamB)
        {
            int newId = _matches.Count > 0 ? _matches.Max(m => m.Id) + 1 : 1;
            var newMatch = new Match(idCancha, idCategory, fecha, hora, idTeamA, idTeamB)
            {
                Id = newId
            };

            _matches.Add(newMatch);
            SaveMatches();
            return await Task.FromResult(newMatch);
        }

        public async Task<bool> DeleteMatch(int id)
        {
            var match = _matches.FirstOrDefault(m => m.Id == id);
            if (match != null)
            {
                _matches.Remove(match);
                SaveMatches();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<IEnumerable<Match>> GetMatchesByTeamId(int idTeam)
        {
            return await Task.FromResult(_matches.Where(m => m.IdTeamA == idTeam || m.IdTeamB == idTeam));
        }

        public async Task<IEnumerable<Match>> GetMatchesByFecha(DateTime fecha)
        {
            return await Task.FromResult(_matches.Where(m => m.Fecha.Date == fecha.Date));
        }

        public async Task<IEnumerable<Match>> GetMatchesByCanchaId(int idCancha)
        {
            return await Task.FromResult(_matches.Where(m => m.IdCancha == idCancha));
        }

        public async Task<IEnumerable<Match>> GetMatchesByCategory(int idCategory)
        {
            return await Task.FromResult(_matches.Where(m => m.IdCategory == idCategory));
        }
    }
} 