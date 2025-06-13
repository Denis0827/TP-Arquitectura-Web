using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;
using TPfulbo.Repositories.Interfaces;

namespace TPfulbo.Managers
{
    public class CategoryManager
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryManager(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await _categoryRepository.GetAllCategories();
        }

        public async Task<Category> GetCategoryById(int idCategory)
        {
            return await _categoryRepository.GetCategoryById(idCategory);
        }

        public async Task<(bool success, string message, Category category)> CreateCategory(int anio, string genero)
        {
            if (anio < 2000 || anio > DateTime.Now.Year)
            {
                return (false, "El año debe estar entre 2000 y el año actual", null);
            }

            if (string.IsNullOrWhiteSpace(genero) || (genero != "Masculino" && genero != "Femenino"))
            {
                return (false, "El género debe ser 'Masculino' o 'Femenino'", null);
            }

            var category = await _categoryRepository.CreateCategory(anio, genero);
            return (true, "Categoría creada exitosamente", category);
        }

        public async Task<(bool success, string message)> DeleteCategory(int idCategory)
        {
            var category = await _categoryRepository.GetCategoryById(idCategory);
            if (category == null)
            {
                return (false, "Categoría no encontrada");
            }

            var success = await _categoryRepository.DeleteCategory(idCategory);
            if (!success)
            {
                return (false, "Error al eliminar la categoría");
            }

            return (true, "Categoría eliminada exitosamente");
        }
    }
} 