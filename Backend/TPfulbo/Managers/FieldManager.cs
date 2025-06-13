using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Managers
{
    public class FieldManager
    {
        private readonly IFieldRepository _fieldRepository;

        public FieldManager(IFieldRepository fieldRepository)
        {
            _fieldRepository = fieldRepository;
        }

        public async Task<IEnumerable<Field>> GetAllFields()
        {
            return await _fieldRepository.GetAllFields();
        }

        public async Task<Field> GetFieldById(int idField)
        {
            return await _fieldRepository.GetFieldById(idField);
        }

        public async Task<IEnumerable<Field>> GetFieldsByBotines(string botines)
        {
            return await _fieldRepository.GetFieldsByBotines(botines);
        }

        public async Task<IEnumerable<Field>> GetFieldsByEstacionamiento(bool tieneEstacionamiento)
        {
            return await _fieldRepository.GetFieldsByEstacionamiento(tieneEstacionamiento);
        }

        public async Task<(bool success, string message, Field field)> CreateField(string calle, int altura, int capacidad, string botines, bool tieneEstacionamiento)
        {
            // Validaciones básicas
            if (string.IsNullOrWhiteSpace(calle))
                return (false, "La calle no puede estar vacía", null);
            
            if (altura <= 0)
                return (false, "La altura debe ser mayor a 0", null);
            
            if (capacidad <= 0)
                return (false, "La capacidad debe ser mayor a 0", null);
            
            if (string.IsNullOrWhiteSpace(botines))
                return (false, "El tipo de botines no puede estar vacío", null);

            var field = await _fieldRepository.CreateField(calle, altura, capacidad, botines, tieneEstacionamiento);
            return (true, "Campo creado exitosamente", field);
        }

        public async Task<(bool success, string message)> DeleteField(int idField)
        {
            var field = await _fieldRepository.GetFieldById(idField);
            if (field == null)
                return (false, "Campo no encontrado");

            var success = await _fieldRepository.DeleteField(idField);
            return (success, success ? "Campo eliminado exitosamente" : "Error al eliminar el campo");
        }
    }
} 