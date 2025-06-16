using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;
using System.Text;

namespace TPfulbo.Managers
{
    public class MatchConfirmedManager
    {
        private readonly IMatchConfirmedRepository _matchConfirmedRepository;
        private readonly IMatchTentativeRepository _matchTentativeRepository;
        private readonly MatchConfirmedValidator _matchConfirmedValidator;
        private readonly TeamManager _teamManager;

        public MatchConfirmedManager(
            IMatchConfirmedRepository matchConfirmedRepository,
            IMatchTentativeRepository matchTentativeRepository,
            MatchConfirmedValidator matchConfirmedValidator,
            TeamManager teamManager)
        {
            _matchConfirmedRepository = matchConfirmedRepository;
            _matchTentativeRepository = matchTentativeRepository;
            _matchConfirmedValidator = matchConfirmedValidator;
            _teamManager = teamManager;
        }

        public async Task<(bool success, string message, MatchConfirmed match)> CreateMatchConfirmed(int idCoach, int idMatchTentative, List<int> idPlayersTeamA, List<int> idPlayersTeamB)
        {
            // Obtener el partido tentativo para extraer los datos necesarios
            var matchTentative = await _matchTentativeRepository.GetMatchTentativeById(idMatchTentative);
            if (matchTentative == null)
            {
                return (false, "No existe el partido tentativo especificado", null);
            }

            // Obtener los jugadores confirmados del partido tentativo
            var confirmedPlayers = await _matchTentativeRepository.GetConfirmedPlayers(idMatchTentative);
            if (confirmedPlayers == null || !confirmedPlayers.Any())
            {
                return (false, "No hay jugadores confirmados en el partido tentativo", null);
            }

            // Verificar que la unión de los jugadores de ambos equipos coincida exactamente con los jugadores confirmados
            var allTeamPlayers = idPlayersTeamA.Concat(idPlayersTeamB).ToList();
            var missingPlayers = confirmedPlayers.Except(allTeamPlayers).ToList();
            var extraPlayers = allTeamPlayers.Except(confirmedPlayers).ToList();

            if (missingPlayers.Any() || extraPlayers.Any())
            {
                var errorMessage = new StringBuilder();
                if (missingPlayers.Any())
                {
                    errorMessage.Append("Los siguientes jugadores confirmados no están en ningún equipo: " + string.Join(", ", missingPlayers));
                }
                if (extraPlayers.Any())
                {
                    if (errorMessage.Length > 0) errorMessage.Append(" ");
                    errorMessage.Append("Los siguientes jugadores están en los equipos pero no están confirmados: " + string.Join(", ", extraPlayers));
                }
                return (false, errorMessage.ToString(), null);
            }

            // Verificar que los equipos son diferentes
            if (idPlayersTeamA.Intersect(idPlayersTeamB).Any())
            {
                return (false, "Los equipos no pueden tener jugadores en común", null);
            }

            // Crear los equipos
            var teamA = await _teamManager.CreateTeam(idPlayersTeamA);
            if (teamA == null)
            {
                return (false, "Error al crear el equipo A", null);
            }

            var teamB = await _teamManager.CreateTeam(idPlayersTeamB);
            if (teamB == null)
            {
                return (false, "Error al crear el equipo B", null);
            }

            // Validar los datos usando los IDs de los equipos creados
            var (isValid, validationMessage) = await _matchConfirmedValidator.ValidateCreateMatchConfirmedData(
                idCoach,
                idMatchTentative,
                teamA.IdTeam,
                teamB.IdTeam
            );

            if (!isValid)
            {
                return (false, validationMessage, null);
            }

            // Crear el partido confirmado
            var match = await _matchConfirmedRepository.CreateMatchConfirmed(
                matchTentative.IdCoach,
                matchTentative.IdField,
                matchTentative.Fecha,
                matchTentative.IdCategory,
                teamA.IdTeam,
                teamB.IdTeam
            );

            // Eliminar el partido tentativo
            var deleted = await _matchTentativeRepository.DeleteMatchTentative(idMatchTentative);
            if (!deleted)
            {
                return (false, "Error al eliminar el partido tentativo", null);
            }

            return (true, "Partido confirmado creado exitosamente", match as MatchConfirmed);
        }

        public async Task<(bool success, string message, MatchConfirmed match)> GetMatchConfirmedById(int idMatch)
        {
            var match = await _matchConfirmedRepository.GetMatchConfirmedById(idMatch);
            if (match == null)
            {
                return (false, "No existe el partido confirmado especificado", null);
            }

            return (true, "Partido confirmado encontrado", match as MatchConfirmed);
        }

        public async Task<(bool success, string message, IEnumerable<MatchConfirmed> matches)> GetAllMatchConfirmed()
        {
            var matches = await _matchConfirmedRepository.GetAllMatchConfirmed();
            return (true, "Partidos confirmados obtenidos exitosamente", matches.Cast<MatchConfirmed>());
        }

        public async Task<(bool success, string message)> DeleteMatchConfirmed(int idMatch)
        {
            var matchConfirmed = await _matchConfirmedRepository.GetMatchConfirmedById(idMatch);
            if (matchConfirmed == null)
                return (false, "Partido confirmado no encontrado");

            var matchConfirmedObj = (MatchConfirmed)matchConfirmed;
            var teamA = await _teamManager.DeleteTeam(matchConfirmedObj.IdTeamA);
            if (!teamA)
                return (false, "Error al eliminar el equipo A");

            var teamB = await _teamManager.DeleteTeam(matchConfirmedObj.IdTeamB);
            if (!teamB)
                return (false, "Error al eliminar el equipo B");

            var result = await _matchConfirmedRepository.DeleteMatchConfirmed(idMatch);
            if (!result)
                return (false, "Error al eliminar el partido confirmado");

            return (true, "Partido confirmado eliminado exitosamente");
        }

        public async Task<(bool success, string message, IEnumerable<MatchConfirmed> matches)> GetMatchConfirmedByCategory(int idCategory)
        {
            var matches = await _matchConfirmedRepository.GetMatchConfirmedByCategory(idCategory);
            return (true, "Partidos confirmados por categoría obtenidos exitosamente", matches.Cast<MatchConfirmed>());
        }

        public async Task<(bool success, string message, IEnumerable<MatchConfirmed> matches)> GetMatchConfirmedByCoach(int idCoach)
        {
            var matches = await _matchConfirmedRepository.GetMatchConfirmedByCoach(idCoach);
            return (true, "Partidos confirmados por entrenador obtenidos exitosamente", matches.Cast<MatchConfirmed>());
        }

        public async Task<(bool success, string message, IEnumerable<MatchConfirmed> matches)> GetMatchConfirmedByPlayer(int idPlayer)
        {
            var matches = await _matchConfirmedRepository.GetMatchConfirmedByPlayer(idPlayer);
            return (true, "Partidos confirmados por jugador obtenidos exitosamente", matches.Cast<MatchConfirmed>());
        }

        public async Task<(bool success, string message, MatchConfirmed match)> GetMatchConfirmedByFecha(DateTime fecha)
        {
            var match = await _matchConfirmedRepository.GetMatchConfirmedByFecha(fecha);
            if (match == null)
            {
                return (false, "No existe un partido confirmado para la fecha especificada", null);
            }

            return (true, "Partido confirmado encontrado", match as MatchConfirmed);
        }
    }
} 