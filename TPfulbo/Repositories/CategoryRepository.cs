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
    public class CategoryRepository : ICategoryRepository
    {
        private readonly string _jsonFilePath;
        private List<Category> _categories;

        public CategoryRepository()
        {
            _jsonFilePath = Path.Combine("Data", "categories.json");
            LoadCategories();
        }

        private void LoadCategories()
        {
            if (File.Exists(_jsonFilePath))
            {
                var jsonString = File.ReadAllText(_jsonFilePath);
                _categories = JsonSerializer.Deserialize<List<Category>>(jsonString) ?? new List<Category>();
            }
            else
            {
                _categories = new List<Category>();
                SaveCategories();
            }
        }

        private void SaveCategories()
        {
            var jsonString = JsonSerializer.Serialize(_categories, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_jsonFilePath, jsonString);
        }

        public async Task<IEnumerable<Category>> GetAllCategories()
        {
            return await Task.FromResult(_categories);
        }

        public async Task<Category> GetCategoryById(int idCategory)
        {
            return await Task.FromResult(_categories.FirstOrDefault(c => c.IdCategory == idCategory));
        }

        public async Task<Category> CreateCategory(int anio, string genero)
        {
            int newId = _categories.Count > 0 ? _categories.Max(c => c.IdCategory) + 1 : 1;
            var newCategory = new Category(anio, genero)
            {
                IdCategory = newId
            };

            _categories.Add(newCategory);
            SaveCategories();
            return await Task.FromResult(newCategory);
        }

        public async Task<bool> DeleteCategory(int idCategory)
        {
            var category = _categories.FirstOrDefault(c => c.IdCategory == idCategory);
            if (category != null)
            {
                _categories.Remove(category);
                SaveCategories();
                return await Task.FromResult(true);
            }
            return await Task.FromResult(false);
        }
    }
} 