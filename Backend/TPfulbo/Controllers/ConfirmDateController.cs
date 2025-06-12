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
    public class ConfirmDateController : ControllerBase
    {
        private readonly ConfirmDateManager _dateManager;

        public ConfirmDateController(ConfirmDateManager dateManager)
        {
            _dateManager = dateManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConfirmDate>>> GetAllDates()
        {
            var dates = await _dateManager.GetAllDates();
            return Ok(ApiResponse<object>.CreateSuccess(dates, "Fechas obtenidas exitosamente"));
        }

        [HttpGet("{idDate}")]
        public async Task<ActionResult<ConfirmDate>> GetDateById(int idDate)
        {
            var date = await _dateManager.GetDateById(idDate);
            if (date == null)
                return NotFound(ApiResponse<object>.CreateError("Fecha no encontrada"));
            return Ok(ApiResponse<object>.CreateSuccess(date, "Fecha encontrada exitosamente"));
        }

        [HttpDelete("{idDate}")]
        public async Task<IActionResult> DeleteDate(int idDate)
        {
            var success = await _dateManager.DeleteDate(idDate);
            if (!success)
                return NotFound(ApiResponse<object>.CreateError("Fecha no encontrada"));
            return Ok(ApiResponse<object>.CreateSuccess(new { idDate }, "Fecha eliminada exitosamente"));
        }

        [HttpPost("{idDate}/confirm/{idPlayer}")]
        public async Task<IActionResult> ConfirmPlayer(int idDate, int idPlayer)
        {
            var (success, message) = await _dateManager.ConfirmPlayer(idDate, idPlayer);
            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));
            return Ok(ApiResponse<object>.CreateSuccess(new { idDate, idPlayer }, message));
        }

        [HttpGet("{idDate}/players")]
        public async Task<ActionResult<List<int>>> GetConfirmedPlayers(int idDate)
        {
            var idPlayers = await _dateManager.GetConfirmedPlayers(idDate);
            return Ok(ApiResponse<object>.CreateSuccess(idPlayers, "Players confirmados obtenidos exitosamente"));
        }

        [HttpDelete("{idDate}/confirm/{idPlayer}")]
        public async Task<IActionResult> CancelPlayerConfirmation(int idDate, int idPlayer)
        {
            var (success, message) = await _dateManager.CancelPlayerConfirmation(idDate, idPlayer);
            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));
            return Ok(ApiResponse<object>.CreateSuccess(new { idDate, idPlayer }, message));
        }

        [HttpPost("coaches/{idCoach}/createDate")]
        public async Task<IActionResult> CreateDate(int idCoach, [FromBody] CreateDateRequest request)
        {
            var (success, message, date) = await _dateManager.CreateDate(idCoach, request.Fecha);
            if (!success)
                return BadRequest(ApiResponse<object>.CreateError(message));

            return Ok(ApiResponse<ConfirmDate>.CreateSuccess(date, message));
        }
    }
} 