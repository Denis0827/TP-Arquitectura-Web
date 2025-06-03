using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllCategories();
        Task<Category> GetCategoryById(int idCategory);
        Task<Category> CreateCategory(int anio, string genero);
        Task<bool> DeleteCategory(int idCategory);
    }
} 