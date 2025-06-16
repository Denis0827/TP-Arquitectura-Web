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
    public class MatchTentativeRepository : IMatchTentativeRepository
    {
        private readonly string _jsonFilePath;
        private List<MatchTentative> _matchTentatives;

        public MatchTentativeRepository()
        {
            _jsonFilePath = Path.Combine("..", "..", "Data", "matchesTentative.json");
            LoadMatchTentatives();
        }

        private void LoadMatchTentatives()
        {
            if (File.Exists(_jsonFilePath))
            {
                string jsonString = File.ReadAllText(_jsonFilePath);
                _matchTentatives = JsonSerializer.Deserialize<List<MatchTentative>>(jsonString) ?? new List<MatchTentative>();
            }
            else
            {
                _matchTentatives = new List<MatchTentative>();
                SaveMatchTentatives();
            }
        }

        private void SaveMatchTentatives()
        {
            string jsonString = JsonSerializer.Serialize(_matchTentatives, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<MatchTentative>> GetAllMatchTentative()
        {
            return await Task.FromResult(_matchTentatives);
        }

        public async Task<MatchTentative> GetMatchTentativeById(int idMatch)
        {
            return await Task.FromResult(_matchTentatives.FirstOrDefault(m => m.IdMatch == idMatch));
        }

        public async Task<MatchTentative> GetMatchTentativeByFecha(DateTime fecha)
        {
            return await Task.FromResult(_matchTentatives.FirstOrDefault(m => m.Fecha.Date == fecha.Date));
        }

        public async Task<MatchTentative> CreateMatchTentative(int idCoach, int idField, DateTime fecha, int idCategory)
        {
            var matchTentative = new MatchTentative(fecha, idCoach, idField, idCategory)
            {
                IdMatch = _matchTentatives.Count > 0 ? _matchTentatives.Max(m => m.IdMatch) + 1 : 1
            };

            _matchTentatives.Add(matchTentative);
            SaveMatchTentatives();
            return await Task.FromResult(matchTentative);
        }

        public async Task<bool> DeleteMatchTentative(int idMatch)
        {
            var matchTentative = _matchTentatives.FirstOrDefault(m => m.IdMatch == idMatch);
            if (matchTentative == null)
                return await Task.FromResult(false);

            _matchTentatives.Remove(matchTentative);
            SaveMatchTentatives();
            return await Task.FromResult(true);
        }

        public async Task<bool> ConfirmPlayer(int idMatch, int idPlayer)
        {
            var matchTentative = _matchTentatives.FirstOrDefault(m => m.IdMatch == idMatch);
            if (matchTentative == null)
                return await Task.FromResult(false);

            if (!matchTentative.IdPlayers.Contains(idPlayer))
            {
                matchTentative.IdPlayers.Add(idPlayer);
                SaveMatchTentatives();
            }

            return await Task.FromResult(true);
        }

        public async Task<List<int>> GetConfirmedPlayers(int idMatch)
        {
            var matchTentative = _matchTentatives.FirstOrDefault(m => m.IdMatch == idMatch);
            return await Task.FromResult(matchTentative?.IdPlayers ?? new List<int>());
        }

        public async Task<bool> CancelPlayerConfirmation(int idMatch, int idPlayer)
        {
            var matchTentative = _matchTentatives.FirstOrDefault(m => m.IdMatch == idMatch);
            if (matchTentative == null)
                return await Task.FromResult(false);

            if (matchTentative.IdPlayers.Contains(idPlayer))
            {
                matchTentative.IdPlayers.Remove(idPlayer);
                SaveMatchTentatives();
                return await Task.FromResult(true);
            }

            return await Task.FromResult(false);
        }
    }
}