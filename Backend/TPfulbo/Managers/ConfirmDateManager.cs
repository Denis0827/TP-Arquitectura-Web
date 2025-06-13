using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Validators;
using System.Linq;

namespace TPfulbo.Managers
{
    public class ConfirmDateManager
    {
        private readonly IConfirmDateRepository _dateRepository;
        private readonly ICoachRepository _coachRepository;
        private readonly IFieldRepository _fieldRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly ConfirmDateValidator _dateValidator;

        public ConfirmDateManager(
            IConfirmDateRepository dateRepository,
            ICoachRepository coachRepository,
            IFieldRepository fieldRepository,
            ICategoryRepository categoryRepository,
            ConfirmDateValidator dateValidator)
        {
            _dateRepository = dateRepository;
            _coachRepository = coachRepository;
            _fieldRepository = fieldRepository;
            _categoryRepository = categoryRepository;
            _dateValidator = dateValidator;
        }

        public async Task<IEnumerable<ConfirmDateResponse>> GetAllDates()
        {
            var dates = await Task.Run(() => _dateRepository.GetAllDates());
            return dates.Select(date => new ConfirmDateResponse(date));
        }

        public async Task<ConfirmDateResponse> GetDateById(int idDate)
        {
            var date = await Task.Run(() => _dateRepository.GetDateById(idDate));
            if (date == null)
            {
                throw new Exception("Fecha no encontrada");
            }
            return new ConfirmDateResponse(date);
        }

        public async Task<ConfirmDateResponse> GetDateByFecha(DateTime fecha)
        {
            var date = await Task.Run(() => _dateRepository.GetDateByFecha(fecha));
            if (date == null)
            {
                throw new Exception("Fecha no encontrada");
            }
            return new ConfirmDateResponse(date);
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

        public async Task<(bool success, string message, ConfirmDateResponse date)> CreateDate(int idCoach, DateTime fecha, int idField, int idCategory)
        {
            // Validar que el coach existe
            var coach = await _coachRepository.GetCoachById(idCoach);
            if (coach == null)
            {
                return (false, "No tienes permiso para realizar esta función", null);
            }

            // Validar que el campo existe
            var field = await _fieldRepository.GetFieldById(idField);
            if (field == null)
            {
                return (false, "El campo seleccionado no existe", null);
            }

            // Validar que la categoría existe
            var category = await _categoryRepository.GetCategoryById(idCategory);
            if (category == null)
            {
                return (false, "La categoría seleccionada no existe", null);
            }

            // Check if date already exists
            var existingDate = await _dateRepository.GetDateByFecha(fecha);
            if (existingDate != null)
                return (false, "Ya existe una fecha para este día y hora", null);

            var newDate = await _dateRepository.CreateDate(fecha, idField, idCategory);
            return (true, "Fecha creada exitosamente", new ConfirmDateResponse(newDate, field, category));
        }
    }
} 