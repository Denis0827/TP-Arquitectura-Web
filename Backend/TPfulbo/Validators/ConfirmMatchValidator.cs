using System;
using System.Threading.Tasks;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class ConfirmMatchValidator
    {
        private readonly IMatchTentativeRepository _matchTentativeRepository;
        private readonly IPlayerRepository _playerRepository;

        public ConfirmMatchValidator(
            IMatchTentativeRepository matchTentativeRepository,
            IPlayerRepository playerRepository)
        {
            _matchTentativeRepository = matchTentativeRepository;
            _playerRepository = playerRepository;
        }

        public async Task<(bool isValid, string message)> ValidateConfirmPlayerData(int idMatch, int idPlayer)
        {
            // Validar que la fecha existe
            var matchTentative = await _matchTentativeRepository.GetMatchTentativeById(idMatch);
            if (matchTentative == null)
                return (false, "El partido no existe");

            // Validar que el jugador existe
            var player = await _playerRepository.GetPlayerById(idPlayer);
            if (player == null)
                return (false, "El jugador no existe");

            // Validar que el jugador no está ya confirmado
            if (matchTentative.IdPlayers.Contains(idPlayer))
                return (false, "El jugador ya está confirmado para este partido");

            return (true, string.Empty);
        }
    }
} 