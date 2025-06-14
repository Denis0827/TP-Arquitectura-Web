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
        private readonly MatchValidator _matchValidator;
        private readonly ICoachRepository _coachRepository;

        public MatchManager(
            IMatchRepository matchRepository,
            MatchValidator matchValidator,
            ICoachRepository coachRepository)
        {
            _matchRepository = matchRepository;
            _matchValidator = matchValidator;
            _coachRepository = coachRepository;
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

        public async Task<IEnumerable<Match>> GetMatchesByCoach(int idCoach)
        {
            return await _matchRepository.GetMatchesByCoach(idCoach);
        }

        public async Task<IEnumerable<Match>> GetMatchesByPlayer(int idPlayer)
        {
            return await _matchRepository.GetMatchesByPlayer(idPlayer);
        }

        public async Task<(bool success, string message, Match match)> CreateMatch(
            int idCoach, 
            int idField, 
            int idDate, 
            int idCategory,
            List<int> idPlayersTeamA,
            List<int> idPlayersTeamB)
        {
            // Validar que el coach existe
            var coach = await _coachRepository.GetCoachById(idCoach);
            if (coach == null)
            {
                return (false, "No tienes permiso para realizar esta función. A", null);
            }

            // Validar todos los datos
            var (isValid, message) = await _matchValidator.ValidateMatchData(
                idField, 
                idDate, 
                idCategory,
                idPlayersTeamA,
                idPlayersTeamB);
            if (!isValid)
                return (false, message, null);

            // Crear partido
            var match = await _matchRepository.CreateMatch(idCoach, idField, idDate, idCategory, idPlayersTeamA, idPlayersTeamB);
            return (true, "Partido creado exitosamente", match);
        }

        public async Task<(bool success, string message)> DeleteMatch(int idMatch)
        {
            var match = await _matchRepository.GetMatchById(idMatch);
            if (match == null)
                return (false, "Partido no encontrado");

            // Eliminar el partido
            var matchDeleted = await _matchRepository.DeleteMatch(idMatch);
            if (!matchDeleted)
                return (false, "Error al eliminar el partido");

            return (true, "Partido eliminado exitosamente");
        }
    }
} 