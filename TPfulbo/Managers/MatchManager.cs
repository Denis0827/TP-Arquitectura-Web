using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;

namespace TPfulbo.Managers
{
    public class MatchManager
    {
        private readonly IMatchRepository _matchRepository;
        private readonly TeamManager _teamManager;
        private readonly MatchValidator _matchValidator;

        public MatchManager(
            IMatchRepository matchRepository,
            TeamManager teamManager,
            MatchValidator matchValidator)
        {
            _matchRepository = matchRepository;
            _teamManager = teamManager;
            _matchValidator = matchValidator;
        }

        public async Task<IEnumerable<Match>> GetAllMatches()
        {
            return await _matchRepository.GetAllMatches();
        }

        public async Task<Match> GetMatchById(int idMatch)
        {
            return await _matchRepository.GetMatchById(idMatch);
        }

        public async Task<IEnumerable<Match>> GetMatchesByCategory(int idCategory)
        {
            return await _matchRepository.GetMatchesByCategory(idCategory);
        }

        public async Task<(bool success, string message, Match match)> CreateMatch(int idCoach, int idField, int idDate, int idCategory, List<int> idPlayersTeamA, List<int> idPlayersTeamB)
        {
            // Validar todos los datos
            var (isValid, message) = await _matchValidator.ValidateMatchData(idField, idDate, idCategory, idPlayersTeamA, idPlayersTeamB);
            if (!isValid)
                return (false, message, null);

            // Crear equipos
            var teamA = await _teamManager.CreateTeam(idPlayersTeamA);
            if (teamA == null)
                return (false, "Error al crear el equipo A", null);

            var teamB = await _teamManager.CreateTeam(idPlayersTeamB);
            if (teamB == null)
                return (false, "Error al crear el equipo B", null);

            // Crear partido
            var match = await _matchRepository.CreateMatch(idCoach, idField, idDate, idCategory, teamA.IdTeam, teamB.IdTeam);
            return (true, "Partido creado exitosamente", match);
        }

        public async Task<(bool success, string message)> DeleteMatch(int idMatch)
        {
            var match = await _matchRepository.GetMatchById(idMatch);
            if (match == null)
                return (false, "Partido no encontrado");

            // Eliminar los equipos asociados
            var resultTeamA = await _teamManager.DeleteTeam(match.IdTeamA);
            if (!resultTeamA)
                return (false, "Error al eliminar el equipo A");

            var resultTeamB = await _teamManager.DeleteTeam(match.IdTeamB);
            if (!resultTeamB)
                return (false, "Error al eliminar el equipo B");

            // Eliminar el partido
            var matchDeleted = await _matchRepository.DeleteMatch(idMatch);
            if (!matchDeleted)
                return (false, "Error al eliminar el partido");

            return (true, "Partido y equipos eliminados exitosamente");
        }
    }
} 