using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using System.IO;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Repositories
{
    public class FieldRepository : IFieldRepository
    {
        private readonly string _jsonFilePath;
        private List<Field> _fields;

        public FieldRepository()
        {
            _jsonFilePath = Path.Combine("..", "..", "Data", "fields.json");
            LoadFields();
        }

        private void LoadFields()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _fields = JsonSerializer.Deserialize<List<Field>>(jsonString) ?? new List<Field>();
            }
            else
            {
                _fields = new List<Field>();
                SaveFields();
            }
        }

        private void SaveFields()
        {
            var jsonString = JsonSerializer.Serialize(_fields, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Field>> GetAllFields()
        {
            return await Task.FromResult(_fields);
        }

        public async Task<Field> GetFieldById(int idField)
        {
            return await Task.FromResult(_fields.FirstOrDefault(f => f.IdField == idField));
        }

        public async Task<Field> CreateField(string calle, int altura, int capacidad, string botines, bool tieneEstacionamiento)
        {
            int newId = _fields.Count > 0 ? _fields.Max(f => f.IdField) + 1 : 1;
            var newField = new Field(calle, altura, capacidad, botines, tieneEstacionamiento)
            {
                IdField = newId
            };

            _fields.Add(newField);
            SaveFields();
            return await Task.FromResult(newField);
        }

        public async Task<bool> DeleteField(int idField)
        {
            var field = _fields.FirstOrDefault(f => f.IdField == idField);
            if (field != null)
            {
                _fields.Remove(field);
                SaveFields();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }

        public async Task<IEnumerable<Field>> GetFieldsByBotines(string botines)
        {
            return await Task.FromResult(_fields.Where(f => f.Botines.Equals(botines, StringComparison.OrdinalIgnoreCase)));
        }

        public async Task<IEnumerable<Field>> GetFieldsByEstacionamiento(bool tieneEstacionamiento)
        {
            return await Task.FromResult(_fields.Where(f => f.TieneEstacionamiento == tieneEstacionamiento));
        }
    }
} 