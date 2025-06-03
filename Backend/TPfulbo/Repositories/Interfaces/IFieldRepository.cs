using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IFieldRepository
    {
        Task<IEnumerable<Field>> GetAllFields();
        Task<Field> GetFieldById(int idField);
        Task<Field> CreateField(string calle, int altura, int capacidad, string botines, bool tieneEstacionamiento);
        Task<bool> DeleteField(int idField);
        Task<IEnumerable<Field>> GetFieldsByBotines(string botines);
        Task<IEnumerable<Field>> GetFieldsByEstacionamiento(bool tieneEstacionamiento);
    }
} 