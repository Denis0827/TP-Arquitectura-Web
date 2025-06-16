using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;
using System.Linq;

namespace TPfulbo.Managers
{
    public class MatchTentativeManager
    {
        private readonly IMatchTentativeRepository _matchTentativeRepository;
        private readonly ICoachRepository _coachRepository;
        private readonly IFieldRepository _fieldRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ConfirmMatchValidator _matchValidator;
        private readonly CreateMatchTentativeValidator _createMatchTentativeValidator;

        public MatchTentativeManager(
            IMatchTentativeRepository matchTentativeRepository,
            ICoachRepository coachRepository,
            IFieldRepository fieldRepository,
            ICategoryRepository categoryRepository,
            ConfirmMatchValidator matchValidator,
            CreateMatchTentativeValidator createMatchTentativeValidator)
        {
            _matchTentativeRepository = matchTentativeRepository;
            _coachRepository = coachRepository;
            _fieldRepository = fieldRepository;
            _categoryRepository = categoryRepository;
            _matchValidator = matchValidator;
            _createMatchTentativeValidator = createMatchTentativeValidator;
        }

        public async Task<IEnumerable<MatchTentative>> GetAllMatchTentatives()
        {
            return await _matchTentativeRepository.GetAllMatchTentative();
        }

        public async Task<MatchTentative> GetMatchTentativeById(int idMatch)
        {
            return await _matchTentativeRepository.GetMatchTentativeById(idMatch);
        }

        public async Task<MatchTentative> GetMatchTentativeByFecha(DateTime fecha)
        {
            return await _matchTentativeRepository.GetMatchTentativeByFecha(fecha);
        }

        public async Task<(bool success, string message, MatchTentative matchTentative)> CreateMatchTentative(
            int idCoach,
            DateTime fecha,
            int idField,
            int idCategory)
        {
            var (isValid, message) = await _createMatchTentativeValidator.ValidateCreateMatchTentativeData(idCoach, fecha, idField, idCategory);
            if (!isValid)
                return (false, message, null);

            var matchTentative = await _matchTentativeRepository.CreateMatchTentative(idCoach, idField, fecha, idCategory);
            return (true, "Partido tentativo creado exitosamente", matchTentative);
        }

        public async Task<(bool success, string message)> DeleteMatchTentative(int idMatch)
        {
            var matchTentative = await _matchTentativeRepository.GetMatchTentativeById(idMatch);
            if (matchTentative == null)
                return (false, "Partido Tentativo no encontrado");

            var success = await _matchTentativeRepository.DeleteMatchTentative(idMatch);
            return (success, success ? "Partido Tentativo eliminado exitosamente" : "Error al eliminar el partido tentativo");
        }

        public async Task<(bool success, string message)> ConfirmPlayer(int idMatch, int idPlayer)
        {
            // Validar todos los datos
            var (isValid, message) = await _matchValidator.ValidateConfirmPlayerData(idMatch, idPlayer);
            if (!isValid)
                return (false, message);

            var result = await _matchTentativeRepository.ConfirmPlayer(idMatch, idPlayer);
            return (result, result ? "Jugador confirmado exitosamente" : "Error al confirmar jugador");
        }

        public async Task<List<int>> GetConfirmedPlayers(int idMatch)
        {
            return await _matchTentativeRepository.GetConfirmedPlayers(idMatch);
        }

        public async Task<(bool success, string message)> CancelPlayerConfirmation(int idMatch, int idPlayer)
        {
            // Validar que el partido existe
            var matchTentative = await _matchTentativeRepository.GetMatchTentativeById(idMatch);
            if (matchTentative == null)
                return (false, "El partido no existe");

            // Validar que el jugador está confirmado
            var confirmedPlayers = await _matchTentativeRepository.GetConfirmedPlayers(idMatch);
            if (!confirmedPlayers.Contains(idPlayer))
                return (false, "El jugador no está confirmado para este partido");

            var result = await _matchTentativeRepository.CancelPlayerConfirmation(idMatch, idPlayer);
            return (result, result ? "Confirmación cancelada exitosamente" : "Error al cancelar la confirmación");
        }
    }
} 