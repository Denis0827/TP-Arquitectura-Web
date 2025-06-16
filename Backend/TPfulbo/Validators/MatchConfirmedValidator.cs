using System;
using System.Threading.Tasks;
using System.Linq;
using System.Text;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class MatchConfirmedValidator
    {
        private readonly ICoachRepository _coachRepository;
        private readonly IFieldRepository _fieldRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ITeamRepository _teamRepository;
        private readonly IMatchTentativeRepository _matchTentativeRepository;

        public MatchConfirmedValidator(
            ICoachRepository coachRepository,
            IFieldRepository fieldRepository,
            ICategoryRepository categoryRepository,
            ITeamRepository teamRepository,
            IMatchTentativeRepository matchTentativeRepository)
        {
            _coachRepository = coachRepository;
            _fieldRepository = fieldRepository;
            _categoryRepository = categoryRepository;
            _teamRepository = teamRepository;
            _matchTentativeRepository = matchTentativeRepository;
        }

        public async Task<(bool isValid, string message)> ValidateCreateMatchConfirmedData(int idCoach, int idMatchTentative, int idTeamA, int idTeamB)
        {
            // Validar que existe la fecha tentativa
            var matchTentative = await _matchTentativeRepository.GetMatchTentativeById(idMatchTentative);
            if (matchTentative == null)
            {
                return (false, "No existe un partido tentativo para este partido");
            }

            // Validar que el coach coincide con el del partido tentativo
            if (matchTentative.IdCoach != idCoach)
            {
                return (false, "El entrenador no coincide con el del partido tentativo");
            }

            // Validar que el equipo A existe
            var teamA = await _teamRepository.GetTeamById(idTeamA);
            if (teamA == null)
            {
                return (false, "El equipo A seleccionado no existe");
            }

            // Validar que el equipo B existe
            var teamB = await _teamRepository.GetTeamById(idTeamB);
            if (teamB == null)
            {
                return (false, "El equipo B seleccionado no existe");
            }

            // Validar que los equipos son diferentes
            if (idTeamA == idTeamB)
            {
                return (false, "Los equipos no pueden ser iguales");
            }

            // Obtener los jugadores confirmados del partido tentativo
            var confirmedPlayers = await _matchTentativeRepository.GetConfirmedPlayers(idMatchTentative);
            if (confirmedPlayers == null || !confirmedPlayers.Any())
            {
                return (false, "No hay jugadores confirmados en el partido tentativo");
            }

            // Verificar que todos los jugadores confirmados pertenezcan a alguno de los equipos
            var teamAPlayers = teamA.IdPlayers;
            var teamBPlayers = teamB.IdPlayers;
            var allTeamPlayers = teamAPlayers.Concat(teamBPlayers).ToList();

            var missingPlayers = confirmedPlayers.Except(allTeamPlayers).ToList();
            if (missingPlayers.Any())
            {
                var message = new StringBuilder("Los siguientes jugadores confirmados no pertenecen a ninguno de los equipos: ");
                message.Append(string.Join(", ", missingPlayers));
                return (false, message.ToString());
            }

            return (true, "Datos válidos");
        }
    }
} 