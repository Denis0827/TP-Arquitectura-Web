using System;
using System.Threading.Tasks;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Validators
{
    public class CreateMatchTentativeValidator
    {
        private readonly ICoachRepository _coachRepository;
        private readonly IFieldRepository _fieldRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMatchTentativeRepository _matchTentativeRepository;

        public CreateMatchTentativeValidator(
            ICoachRepository coachRepository,
            IFieldRepository fieldRepository,
            ICategoryRepository categoryRepository,
            IMatchTentativeRepository matchTentativeRepository)
        {
            _coachRepository = coachRepository;
            _fieldRepository = fieldRepository;
            _categoryRepository = categoryRepository;
            _matchTentativeRepository = matchTentativeRepository;
        }

        public async Task<(bool isValid, string message)> ValidateCreateMatchTentativeData(int idCoach, DateTime fecha, int idField, int idCategory)
        {
            // Validar que el coach existe
            var coach = await _coachRepository.GetCoachById(idCoach);
            if (coach == null)
            {
                return (false, "No tienes permiso para realizar esta función");
            }

            // Validar que el campo existe
            var field = await _fieldRepository.GetFieldById(idField);
            if (field == null)
            {
                return (false, "El campo seleccionado no existe");
            }

            // Validar que la categoría existe
            var category = await _categoryRepository.GetCategoryById(idCategory);
            if (category == null)
            {
                return (false, "La categoría seleccionada no existe");
            }

            // Check if date already exists
            var existingDate = await _matchTentativeRepository.GetMatchTentativeByFecha(fecha);
            if (existingDate != null)
                return (false, "Ya existe una fecha para este día y hora");

            return (true, "Datos válidos");
        }
    }
} 