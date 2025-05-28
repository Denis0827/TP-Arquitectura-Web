using System;
using System.Collections.Generic;
using System.Linq;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class AssistanceValidator
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IAssistanceRepository _assistanceRepository;
        private readonly IMatchRepository _matchRepository;

        public AssistanceValidator(IPlayerRepository playerRepository, IAssistanceRepository assistanceRepository, IMatchRepository matchRepository)
        {
            _playerRepository = playerRepository;
            _assistanceRepository = assistanceRepository;
            _matchRepository = matchRepository;
        }

        public async Task<(bool isValid, string message)> ValidateAssistance(int idPlayer, int idMatch)
        {
            // Verificar si el jugador existe
            var player = await _playerRepository.GetPlayerById(idPlayer);
            if (player == null)
                return (false, "El jugador no existe");

            // Obtener el partido para la fecha
            var match = await _matchRepository.GetMatchById(idMatch);
            if (match == null)
                return (false, "El partido no existe");

            // Verificar si el jugador ya tiene una asistencia para la misma fecha en otro partido
            var assistances = await _assistanceRepository.GetAssistancesByPlayerId(idPlayer);
            foreach (var assistance in assistances)
            {
                var otherMatch = await _matchRepository.GetMatchById(assistance.IdMatch);
                if (otherMatch != null && otherMatch.Fecha.Date == match.Fecha.Date && assistance.IdMatch != idMatch)
                {
                    return (false, "El jugador ya tiene una asistencia registrada para esa fecha en otro partido");
                }
            }

            return (true, "Asistencia válida");
        }
    }
} 