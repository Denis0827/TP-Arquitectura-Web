using System;
using System.Threading.Tasks;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class ConfirmDateValidator
    {
        private readonly IConfirmDateRepository _confirmDateRepository;
        private readonly IPlayerRepository _playerRepository;

        public ConfirmDateValidator(
            IConfirmDateRepository confirmDateRepository,
            IPlayerRepository playerRepository)
        {
            _confirmDateRepository = confirmDateRepository;
            _playerRepository = playerRepository;
        }

        public async Task<(bool isValid, string message)> ValidateConfirmPlayerData(int idDate, int idPlayer)
        {
            // Validar que la fecha existe
            var date = await _confirmDateRepository.GetDateById(idDate);
            if (date == null)
                return (false, "La fecha no existe");

            // Validar que el jugador existe
            var player = await _playerRepository.GetPlayerById(idPlayer);
            if (player == null)
                return (false, "El jugador no existe");

            // Validar que el jugador no está ya confirmado
            if (date.IdPlayers.Contains(idPlayer))
                return (false, "El jugador ya está confirmado para esta fecha");

            return (true, string.Empty);
        }
    }
} 