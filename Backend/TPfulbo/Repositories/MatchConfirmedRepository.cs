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
    public class MatchConfirmedRepository : IMatchConfirmedRepository
    {
        private readonly string _jsonFilePath;
        private List<MatchConfirmed> _matches;

        public MatchConfirmedRepository()
        {
            _jsonFilePath = Path.Combine("Data", "matchesConfirmed.json");
            LoadMatches();
        }

        private void LoadMatches()
        {
            if (File.Exists(_jsonFilePath))
            {
                string jsonString = File.ReadAllText(_jsonFilePath);
                _matches = JsonSerializer.Deserialize<List<MatchConfirmed>>(jsonString)?.Cast<MatchConfirmed>().ToList() ?? new List<MatchConfirmed>();
            }
            else
            {
                _matches = new List<MatchConfirmed>();
                SaveMatches();
            }
        }

        private void SaveMatches()
        {
            string jsonString = JsonSerializer.Serialize(_matches, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<MatchConfirmed>> GetAllMatchConfirmed()
        {
            return await Task.FromResult(_matches);
        }

        public async Task<MatchConfirmed> GetMatchConfirmedById(int idMatch)
        {
            return await Task.FromResult(_matches.FirstOrDefault(m => m.IdMatch == idMatch));
        }

        public async Task<IEnumerable<MatchConfirmed>> GetMatchConfirmedByCategory(int idCategory)
        {
            return await Task.FromResult(_matches.Where(m => m.IdCategory == idCategory));
        }

        public async Task<IEnumerable<MatchConfirmed>> GetMatchConfirmedByCoach(int idCoach)
        {
            return await Task.FromResult(_matches.Where(m => m.IdCoach == idCoach));
        }

        public async Task<IEnumerable<MatchConfirmed>> GetMatchConfirmedByPlayer(int idPlayer)
        {
            var teamRepository = new TeamRepository();
            var teams = await teamRepository.GetTeamsByPlayer(idPlayer);
            var teamIds = teams.Select(t => t.IdTeam).ToList();
            return await Task.FromResult(_matches.Where(m => teamIds.Contains(m.IdTeamA) || teamIds.Contains(m.IdTeamB)));
        }

        public async Task<MatchConfirmed> GetMatchConfirmedByFecha(DateTime fecha)
        {
            return await Task.FromResult(_matches.FirstOrDefault(m => m.Fecha.Date == fecha.Date));
        }

        public async Task<MatchConfirmed> CreateMatchConfirmed(int idCoach, int idField, DateTime fecha, int idCategory, int idTeamA, int idTeamB)
        {
            var match = new MatchConfirmed(fecha, idCoach, idField, idCategory, idTeamA, idTeamB)
            {
                IdMatch = _matches.Count > 0 ? _matches.Max(m => m.IdMatch) + 1 : 1
            };

            _matches.Add(match);
            SaveMatches();
            return await Task.FromResult(match);
        }

        public async Task<bool> DeleteMatchConfirmed(int idMatch)
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