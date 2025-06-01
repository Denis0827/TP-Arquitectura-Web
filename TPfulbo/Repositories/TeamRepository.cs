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
    public class TeamRepository : ITeamRepository
    {
        private readonly string _jsonFilePath = "Data/teams.json";
        private List<Team> _teams;

        public TeamRepository()
        {
            _teams = new List<Team>();
            LoadTeams();
        }

        private void LoadTeams()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _teams = JsonSerializer.Deserialize<List<Team>>(jsonString) ?? new List<Team>();
            }
            else
            {
                _teams = new List<Team>();
                SaveTeams();
            }
        }

        private void SaveTeams()
        {
            var jsonString = JsonSerializer.Serialize(_teams, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Team>> GetAllTeams()
        {
            return await Task.FromResult(_teams);
        }

        public async Task<Team> GetTeamById(int idTeam)
        {
            return await Task.FromResult(_teams.FirstOrDefault(t => t.IdTeam == idTeam));
        }

        public async Task<IEnumerable<Team>> GetTeamsByPlayer(int idPlayer)
        {
            return await Task.FromResult(_teams.Where(t => t.IdPlayers.Contains(idPlayer)));
        }

        public async Task<Team> CreateTeam(List<int> idPlayers)
        {
            int newId = _teams.Count > 0 ? _teams.Max(t => t.IdTeam) + 1 : 1;
            var newTeam = new Team(idPlayers)
            {
                IdTeam = newId
            };

            _teams.Add(newTeam);
            SaveTeams();
            return await Task.FromResult(newTeam);
        }

        public async Task<bool> DeleteTeam(int idTeam)
        {
            var team = _teams.FirstOrDefault(t => t.IdTeam == idTeam);
            if (team != null)
            {
                _teams.Remove(team);
                SaveTeams();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }
    }
} 