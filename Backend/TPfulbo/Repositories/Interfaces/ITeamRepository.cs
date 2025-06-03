using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface ITeamRepository
    {
        Task<IEnumerable<Team>> GetAllTeams();
        Task<Team> GetTeamById(int idTeam);
        Task<IEnumerable<Team>> GetTeamsByPlayer(int idPlayer);
        Task<Team> CreateTeam(List<int> idPlayers);
        Task<bool> DeleteTeam(int idTeam);
    }
} 