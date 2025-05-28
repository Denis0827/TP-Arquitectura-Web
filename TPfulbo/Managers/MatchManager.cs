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
        private readonly ITeamRepository _teamRepository;
        private readonly AssistanceManager _assistanceManager;
        private readonly IPlayerRepository _playerRepository;
        private readonly MatchValidator _matchValidator;

        public MatchManager(
            IMatchRepository matchRepository,
            ITeamRepository teamRepository,
            AssistanceManager assistanceManager,
            IPlayerRepository playerRepository)
        {
            _matchRepository = matchRepository;
            _teamRepository = teamRepository;
            _assistanceManager = assistanceManager;
            _playerRepository = playerRepository;
            _matchValidator = new MatchValidator(teamRepository);
        }

        public async Task<(bool success, string message, Match match)> CreateMatch(int idCancha, int idCategory, DateTime fecha, TimeSpan hora, int idTeamA, int idTeamB)
        {
            // Validar antes de crear el partido
            var (isValid, validationMessage) = await _matchValidator.ValidateMatchCreation(idTeamA, idTeamB, fecha, hora);
            if (!isValid)
            {
                return (false, validationMessage, null);
            }

            // Crear el partido
            var match = await _matchRepository.CreateMatch(idCancha, idCategory, fecha, hora, idTeamA, idTeamB);

            // Obtener ambos equipos
            var teamA = await _teamRepository.GetTeamById(idTeamA);
            var teamB = await _teamRepository.GetTeamById(idTeamB);

            // Unir los IDs de jugadores de ambos equipos
            var allPlayerIds = new List<int>();
            if (teamA.IdPlayers != null) allPlayerIds.AddRange(teamA.IdPlayers);
            if (teamB.IdPlayers != null) allPlayerIds.AddRange(teamB.IdPlayers);

            // Crear una asistencia por cada jugador usando el AssistanceManager
            var assistanceIds = new List<int>();
            foreach (var idPlayer in allPlayerIds.Distinct())
            {
                var (success, message) = await _assistanceManager.CreateAssistance(idPlayer, match.Id);
                
                // Obtener la asistencia recién creada para obtener su ID
                var assistances = await _assistanceManager.GetAssistancesByPlayerId(idPlayer);
                var lastAssistance = assistances.LastOrDefault(a => a.IdMatch == match.Id);
                if (lastAssistance != null)
                {
                    assistanceIds.Add(lastAssistance.Id);
                }
            }
            match.IdAssistance = assistanceIds;

            return (true, "Partido y asistencias creados exitosamente", match);
        }

        public async Task<IEnumerable<Match>> GetAllMatches()
        {
            return await _matchRepository.GetAllMatches();
        }

        public async Task<Match> GetMatchById(int id)
        {
            return await _matchRepository.GetMatchById(id);
        }

        public async Task<bool> DeleteMatch(int id)
        {
            var match = await _matchRepository.GetMatchById(id);
            if (match == null)
                return false;

            // Eliminar todas las asistencias asociadas a este partido
            if (match.IdAssistance != null)
            {
                foreach (var idAssistance in match.IdAssistance)
                {
                    await _assistanceManager.DeleteAssistance(idAssistance);
                }
            }

            // Eliminar el partido
            return await _matchRepository.DeleteMatch(id);
        }

        public async Task<IEnumerable<Match>> GetMatchesByTeamId(int idTeam)
        {
            return await _matchRepository.GetMatchesByTeamId(idTeam);
        }

        public async Task<IEnumerable<Match>> GetMatchesByFecha(DateTime fecha)
        {
            return await _matchRepository.GetMatchesByFecha(fecha);
        }

        public async Task<IEnumerable<Match>> GetMatchesByCanchaId(int idCancha)
        {
            return await _matchRepository.GetMatchesByCanchaId(idCancha);
        }

        public async Task<IEnumerable<Match>> GetMatchesByCategory(int idCategory)
        {
            return await _matchRepository.GetMatchesByCategory(idCategory);
        }
    }
} 