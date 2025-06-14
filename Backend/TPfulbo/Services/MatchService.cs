using System;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using System.Linq;
using System.Collections.Generic;

namespace TPfulbo.Services
{
    public class MatchService
    {
        private readonly IUserRepository _userRepository;
        private readonly IFieldRepository _fieldRepository;
        private readonly IConfirmDateRepository _confirmDateRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMatchRepository _matchRepository;

        public MatchService(
            IUserRepository userRepository,
            IFieldRepository fieldRepository,
            IConfirmDateRepository confirmDateRepository,
            ICategoryRepository categoryRepository,
            IMatchRepository matchRepository)
        {
            _userRepository = userRepository;
            _fieldRepository = fieldRepository;
            _confirmDateRepository = confirmDateRepository;
            _categoryRepository = categoryRepository;
            _matchRepository = matchRepository;
        }

        public async Task<Match> CreateMatch(int idCoach, int idField, int idDate, int idCategory, List<int> idPlayersTeamA, List<int> idPlayersTeamB)
        {
            // Validar que el coach existe
            var coach = await _userRepository.GetUserById(idCoach);
            if (coach == null)
            {
                throw new Exception("El coach no existe");
            }

            // Validar que el campo existe
            var field = await _fieldRepository.GetFieldById(idField);
            if (field == null)
            {
                throw new Exception("El campo no existe");
            }

            // Validar que la fecha existe
            var date = await _confirmDateRepository.GetDateById(idDate);
            if (date == null)
            {
                throw new Exception("La fecha no existe");
            }

            // Validar que la categoría existe
            var category = await _categoryRepository.GetCategoryById(idCategory);
            if (category == null)
            {
                throw new Exception("La categoría no existe");
            }

            // Validar que el coach no tiene otro partido en la misma fecha
            var existingMatch = await _matchRepository.GetMatchByDate(idDate);
            if (existingMatch != null)
            {
                throw new Exception("Ya existe un partido para esta fecha");
            }

            // Validar que todos los jugadores están confirmados para la fecha
            var confirmedPlayers = await _confirmDateRepository.GetConfirmedPlayers(idDate);
            var allPlayers = idPlayersTeamA.Concat(idPlayersTeamB).ToList();
            var notConfirmedPlayers = allPlayers.Where(id => !confirmedPlayers.Contains(id)).ToList();
            if (notConfirmedPlayers.Any())
            {
                throw new Exception($"Los siguientes jugadores no están confirmados para esta fecha: {string.Join(", ", notConfirmedPlayers)}");
            }

            return await _matchRepository.CreateMatch(idCoach, idField, idDate, idCategory, idPlayersTeamA, idPlayersTeamB);
        }
    }
} 