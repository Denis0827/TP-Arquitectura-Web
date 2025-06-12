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
        private readonly ICoachRepository _coachRepository;
        private readonly ConfirmDateValidator _dateValidator;

        public ConfirmDateManager(
            IConfirmDateRepository dateRepository,
            ICoachRepository coachRepository,
            ConfirmDateValidator dateValidator)
        {
            _dateRepository = dateRepository;
            _coachRepository = coachRepository;
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

        public async Task<(bool success, string message)> CancelPlayerConfirmation(int idDate, int idPlayer)
        {
            // Validar que el jugador esté confirmado
            var confirmedPlayers = await _dateRepository.GetConfirmedPlayers(idDate);
            if (!confirmedPlayers.Contains(idPlayer))
                return (false, "El jugador no está confirmado para esta fecha");

            var result = await _dateRepository.CancelPlayerConfirmation(idDate, idPlayer);
            return (result, result ? "Confirmación cancelada exitosamente" : "Error al cancelar la confirmación");
        }

        public async Task<(bool success, string message, ConfirmDate date)> CreateDate(int idCoach, DateTime fecha)
        {
            // Validar que el coach existe
            var coach = await _coachRepository.GetCoachById(idCoach);
            if (coach == null)
            {
                return (false, "No tienes permiso para realizar esta función", null);
            }

            // Check if date already exists
            var existingDate = await _dateRepository.GetDateByFecha(fecha);
            if (existingDate != null)
                return (false, "Ya existe una fecha para este día y hora", null);

            var newDate = await _dateRepository.CreateDate(fecha);
            return (true, "Fecha creada exitosamente", newDate);
        }
    }
} 