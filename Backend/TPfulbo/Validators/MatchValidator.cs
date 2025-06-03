using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class MatchValidator
    {
        private readonly IFieldRepository _fieldRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IPlayerRepository _playerRepository;
        private readonly IConfirmDateRepository _confirmDateRepository;

        public MatchValidator(
            IFieldRepository fieldRepository,
            ICategoryRepository categoryRepository,
            IPlayerRepository playerRepository,
            IConfirmDateRepository confirmDateRepository)
        {
            _fieldRepository = fieldRepository;
            _categoryRepository = categoryRepository;
            _playerRepository = playerRepository;
            _confirmDateRepository = confirmDateRepository;
        }

        public async Task<(bool isValid, string message)> ValidateMatchData(int idField, int idDate, int idCategory, List<int> idPlayersTeamA, List<int> idPlayersTeamB)
        {
            // Validar que el campo existe
            var field = await _fieldRepository.GetFieldById(idField);
            if (field == null)
                return (false, "El campo seleccionado no existe");

            // Validar que la categoría existe
            var category = await _categoryRepository.GetCategoryById(idCategory);
            if (category == null)
                return (false, "La categoría seleccionada no existe");

            // Validar que la fecha existe
            var confirmDate = await _confirmDateRepository.GetDateById(idDate);
            if (confirmDate == null)
                return (false, "La fecha seleccionada no existe");

            // Validar que todos los jugadores existen
            var allPlayers = idPlayersTeamA.Concat(idPlayersTeamB).ToList();
            foreach (var idPlayer in allPlayers)
            {
                var player = await _playerRepository.GetPlayerById(idPlayer);
                if (player == null)
                    return (false, $"El jugador con ID {idPlayer} no existe");
            }

            // Validar que los jugadores están confirmados para esa fecha
            var notConfirmedPlayers = allPlayers.Where(id => !confirmDate.IdPlayers.Contains(id)).ToList();
            if (notConfirmedPlayers.Any())
            {
                return (false, $"Los siguientes jugadores no están confirmados para esta fecha: {string.Join(", ", notConfirmedPlayers)}");
            }

            return (true, string.Empty);
        }
    }
} 