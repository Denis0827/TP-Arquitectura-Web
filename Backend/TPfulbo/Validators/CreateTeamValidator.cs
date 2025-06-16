using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class CreateTeamValidator
    {
        private readonly IPlayerRepository _playerRepository;

        public CreateTeamValidator(IPlayerRepository playerRepository)
        {
            _playerRepository = playerRepository;
        }

        public async Task<(bool isValid, string message)> ValidateCreateTeamData(List<int> idPlayers)
        {
            if (idPlayers == null || !idPlayers.Any())
            {
                return (false, "La lista de jugadores no puede estar vacía");
            }

            // Verificar que no haya jugadores duplicados
            if (idPlayers.Count != idPlayers.Distinct().Count())
            {
                return (false, "No puede haber jugadores duplicados en el equipo");
            }

            // Verificar que todos los jugadores existan
            foreach (var idPlayer in idPlayers)
            {
                var player = await _playerRepository.GetPlayerById(idPlayer);
                if (player == null)
                {
                    return (false, $"El jugador con ID {idPlayer} no existe");
                }
            }

            return (true, "Datos válidos");
        }
    }
} 