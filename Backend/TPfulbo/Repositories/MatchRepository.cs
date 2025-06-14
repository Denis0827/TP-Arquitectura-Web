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
        private readonly string _jsonFilePath;
        private List<Match> _matches;

        public MatchRepository()
        {
            _jsonFilePath = Path.Combine("..", "..", "Data", "matches.json");
            LoadMatches();
        }

        private void LoadMatches()
        {
            if (File.Exists(_jsonFilePath))
            {
                string jsonString = File.ReadAllText(_jsonFilePath);
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
            string jsonString = JsonSerializer.Serialize(_matches, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Match>> GetAllMatches()
        {
            return await Task.FromResult(_matches);
        }

        public async Task<Match> GetMatchById(int idMatch)
        {
            return await Task.FromResult(_matches.FirstOrDefault(m => m.IdMatch == idMatch));
        }

        public async Task<IEnumerable<Match>> GetMatchesByCategory(int idCategory)
        {
            return await Task.FromResult(_matches.Where(m => m.IdCategory == idCategory));
        }

        public async Task<IEnumerable<Match>> GetMatchesByCoach(int idCoach)
        {
            return await Task.FromResult(_matches.Where(m => m.IdCoach == idCoach));
        }

        public async Task<IEnumerable<Match>> GetMatchesByPlayer(int idPlayer)
        {
            var matches = new List<Match>();
            foreach (var match in _matches)
            {
                matches.Add(match);
            }
            return matches;
        }

        public async Task<Match> GetMatchByDate(int idDate)
        {
            return await Task.FromResult(_matches.FirstOrDefault(m => m.IdDate == idDate));
        }

        public async Task<Match> CreateMatch(int idCoach, int idField, int idDate, int idCategory, List<int> idPlayersTeamA, List<int> idPlayersTeamB)
        {
            var match = new Match(idCoach, idField, idDate, idCategory, idPlayersTeamA, idPlayersTeamB)
            {
                IdMatch = _matches.Count > 0 ? _matches.Max(m => m.IdMatch) + 1 : 1
            };

            _matches.Add(match);
            SaveMatches();
            return await Task.FromResult(match);
        }

        public async Task<bool> DeleteMatch(int idMatch)
        {
            var match = _matches.FirstOrDefault(m => m.IdMatch == idMatch);
            if (match == null)
                return await Task.FromResult(false);

            _matches.Remove(match);
            SaveMatches();
            return await Task.FromResult(true);
        }
    }
}