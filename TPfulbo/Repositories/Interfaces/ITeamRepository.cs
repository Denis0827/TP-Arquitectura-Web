using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface ITeamRepository
    {
        Task<IEnumerable<Team>> GetAllTeams();
        Task<Team> GetTeamById(int id);
        Task<Team> CreateTeam(string nombre, List<int> idPlayers);
        Task<bool> DeleteTeam(int id);
        Task<IEnumerable<Team>> GetTeamsByPlayerId(int playerId);
    }
} 