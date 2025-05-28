using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;

namespace TPfulbo.Managers
{
    public class AssistanceManager
    {
        private readonly IAssistanceRepository _assistanceRepository;
        private readonly IPlayerRepository _playerRepository;
        private readonly IMatchRepository _matchRepository;
        private readonly AssistanceValidator _validator;

        public AssistanceManager(IAssistanceRepository assistanceRepository, IPlayerRepository playerRepository, IMatchRepository matchRepository)
        {
            _assistanceRepository = assistanceRepository;
            _playerRepository = playerRepository;
            _matchRepository = matchRepository;
            _validator = new AssistanceValidator(playerRepository, assistanceRepository, matchRepository);
        }

        public async Task<(bool isValid, string message)> ValidateAssistance(int idPlayer, int idMatch)
        {
            // Obtener asistencias existentes para validación
            var existingAssistances = await _assistanceRepository.GetAssistancesByPlayerId(idPlayer);

            // Validar datos de asistencia
            return await _validator.ValidateAssistance(idPlayer, idMatch);
        }

        public async Task<(bool success, string message)> CreateAssistance(int idPlayer, int idMatch)
        {

            // Si la validación es exitosa, creamos la asistencia
            var assistance = await _assistanceRepository.CreateAssistance(idPlayer, idMatch);
            return (true, "Asistencia registrada exitosamente");
        }

        public async Task<IEnumerable<Assistance>> GetAllAssistances()
        {
            return await _assistanceRepository.GetAllAssistances();
        }

        public async Task<Assistance> GetAssistanceById(int id)
        {
            return await _assistanceRepository.GetAssistanceById(id);
        }

        public async Task<bool> DeleteAssistance(int id)
        {
            return await _assistanceRepository.DeleteAssistance(id);
        }

        public async Task<IEnumerable<Assistance>> GetAssistancesByPlayerId(int idPlayer)
        {
            return await _assistanceRepository.GetAssistancesByPlayerId(idPlayer);
        }

        public async Task<IEnumerable<Assistance>> GetAssistancesByMatchId(int idMatch)
        {
            return await _assistanceRepository.GetAssistancesByMatchId(idMatch);
        }
    }
} 