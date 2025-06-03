using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;

namespace TPfulbo.Managers
{
    public class ConfirmDateManager
    {
        private readonly IConfirmDateRepository _dateRepository;
        private readonly ConfirmDateValidator _dateValidator;

        public ConfirmDateManager(IConfirmDateRepository dateRepository, ConfirmDateValidator dateValidator)
        {
            _dateRepository = dateRepository;
            _dateValidator = dateValidator;
        }

        public async Task<IEnumerable<ConfirmDate>> GetAllDates()
        {
            return await _dateRepository.GetAllDates();
        }

        public async Task<ConfirmDate> GetDateById(int idDate)
        {
            return await _dateRepository.GetDateById(idDate);
        }

        public async Task<ConfirmDate> GetDateByFecha(DateTime fecha)
        {
            return await _dateRepository.GetDateByFecha(fecha);
        }

        public async Task<bool> DeleteDate(int idDate)
        {
            return await _dateRepository.DeleteDate(idDate);
        }

        public async Task<(bool success, string message)> ConfirmPlayer(int idDate, int idPlayer)
        {
            // Validar todos los datos
            var (isValid, message) = await _dateValidator.ValidateConfirmPlayerData(idDate, idPlayer);
            if (!isValid)
                return (false, message);

            var result = await _dateRepository.ConfirmPlayer(idDate, idPlayer);
            return (result, result ? "Jugador confirmado exitosamente" : "Error al confirmar jugador");
        }

        public async Task<List<int>> GetConfirmedPlayers(int idDate)
        {
            return await _dateRepository.GetConfirmedPlayers(idDate);
        }
    }
} 