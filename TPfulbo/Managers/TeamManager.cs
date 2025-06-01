using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Managers
{
    public class TeamManager
    {
        private readonly ITeamRepository _teamRepository;

        public TeamManager(ITeamRepository teamRepository)
        {
            _teamRepository = teamRepository;
        }

        public async Task<Team> CreateTeam(List<int> playerIds)
        {
            return await _teamRepository.CreateTeam(playerIds);
        }

        public async Task<Team> GetTeamById(int idTeam)
        {
            return await _teamRepository.GetTeamById(idTeam);
        }

        public async Task<IEnumerable<Team>> GetAllTeams()
        {
            return await _teamRepository.GetAllTeams();
        }

        public async Task<bool> DeleteTeam(int idTeam)
        {
            return await _teamRepository.DeleteTeam(idTeam);
        }
    }
} 