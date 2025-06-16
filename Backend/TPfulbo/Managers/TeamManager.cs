using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;

namespace TPfulbo.Managers
{
    public class TeamManager
    {
        private readonly ITeamRepository _teamRepository;
        private readonly CreateTeamValidator _createTeamValidator;

        public TeamManager(ITeamRepository teamRepository, CreateTeamValidator createTeamValidator)
        {
            _teamRepository = teamRepository;
            _createTeamValidator = createTeamValidator;
        }

        public async Task<IEnumerable<Team>> GetAllTeams()
        {
            return await _teamRepository.GetAllTeams();
        }

        public async Task<Team> GetTeamById(int idTeam)
        {
            return await _teamRepository.GetTeamById(idTeam);
        }

        public async Task<IEnumerable<Team>> GetTeamsByPlayer(int idPlayer)
        {
            var teams = await _teamRepository.GetAllTeams();
            return teams.Where(t => t.IdPlayers.Contains(idPlayer));
        }

        public async Task<Team> CreateTeam(List<int> idPlayers)
        {
            // Validar los datos antes de crear el equipo
            var (isValid, message) = await _createTeamValidator.ValidateCreateTeamData(idPlayers);
            if (!isValid)
            {
                return null;
            }

            return await _teamRepository.CreateTeam(idPlayers);
        }

        public async Task<bool> DeleteTeam(int idTeam)
        {
            return await _teamRepository.DeleteTeam(idTeam);
        }
    }
} 