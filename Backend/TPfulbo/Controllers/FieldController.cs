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
    public class FieldController : ControllerBase
    {
        private readonly FieldManager _fieldManager;

        public FieldController(FieldManager fieldManager)
        {
            _fieldManager = fieldManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Field>>> GetAllFields()
        {
            var fields = await _fieldManager.GetAllFields();
            return Ok(ApiResponse<object>.CreateSuccess(fields, "Campos obtenidos exitosamente"));
        }

        [HttpGet("{idField}")]
        public async Task<ActionResult<Field>> GetFieldById(int idField)
        {
            var field = await _fieldManager.GetFieldById(idField);
            if (field == null)
                return NotFound(ApiResponse<object>.CreateError("Campo no encontrado"));
            return Ok(ApiResponse<object>.CreateSuccess(field, "Campo encontrado exitosamente"));
        }

        [HttpGet("botines/{botines}")]
        public async Task<ActionResult<IEnumerable<Field>>> GetFieldsByBotines(string botines)
        {
            var fields = await _fieldManager.GetFieldsByBotines(botines);
            return Ok(ApiResponse<object>.CreateSuccess(fields, "Campos filtrados por botines obtenidos exitosamente"));
        }

        [HttpGet("estacionamiento/{tieneEstacionamiento}")]
        public async Task<ActionResult<IEnumerable<Field>>> GetFieldsByEstacionamiento(bool tieneEstacionamiento)
        {
            var fields = await _fieldManager.GetFieldsByEstacionamiento(tieneEstacionamiento);
            return Ok(ApiResponse<object>.CreateSuccess(fields, "Campos filtrados por estacionamiento obtenidos exitosamente"));
        }

        [HttpPost]
        public async Task<IActionResult> CreateField([FromBody] CreateFieldRequest request)
        {
            var (success, message, field) = await _fieldManager.CreateField(
                request.Calle,
                request.Altura,
                request.Capacidad,
                request.Botines,
                request.TieneEstacionamiento
            );

            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));

            return Ok(ApiResponse<object>.CreateSuccess(new { idField = field.IdField }, message));
        }

        [HttpDelete("{idField}")]
        public async Task<IActionResult> DeleteField(int idField)
        {
            var (success, message) = await _fieldManager.DeleteField(idField);
            if (!success)
                return NotFound(ApiResponse<object>.CreateError(message));
            return Ok(ApiResponse<object>.CreateSuccess(new { idField }, message));
        }
    }
} 