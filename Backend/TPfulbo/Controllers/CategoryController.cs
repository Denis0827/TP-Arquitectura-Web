using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Managers;
using TPfulbo.Models;
using TPfulbo.Controllers.Requests;

namespace TPfulbo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryManager _categoryManager;

        public CategoryController(CategoryManager categoryManager)
        {
            _categoryManager = categoryManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories()
        {
            var categories = await _categoryManager.GetAllCategories();
            return Ok(ApiResponse<object>.CreateSuccess(categories, "Categorías obtenidas exitosamente"));
        }

        [HttpGet("{idCategory}")]
        public async Task<ActionResult<Category>> GetCategoryById(int idCategory)
        {
            var category = await _categoryManager.GetCategoryById(idCategory);
            if (category == null)
                return NotFound(ApiResponse<object>.CreateError("Categoría no encontrada"));
            return Ok(ApiResponse<object>.CreateSuccess(category, "Categoría encontrada exitosamente"));
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest request)
        {
            var (success, message, category) = await _categoryManager.CreateCategory(request.Anio, request.Genero);
            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));
            return Ok(ApiResponse<object>.CreateSuccess(category, message));
        }

        [HttpDelete("{idCategory}")]
        public async Task<IActionResult> DeleteCategory(int idCategory)
        {
            var (success, message) = await _categoryManager.DeleteCategory(idCategory);
            if (!success)
                return NotFound(ApiResponse<object>.CreateError(message));
            return Ok(ApiResponse<object>.CreateSuccess(new { idCategory }, message));
        }
    }
} 