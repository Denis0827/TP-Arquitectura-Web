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
            return Ok(dates);
        }

        [HttpGet("{idDate}")]
        public async Task<ActionResult<ConfirmDate>> GetDateById(int idDate)
        {
            var date = await _dateManager.GetDateById(idDate);
            if (date == null)
                return NotFound("Fecha no encontrada");
            return Ok(date);
        }

        [HttpDelete("{idDate}")]
        public async Task<IActionResult> DeleteDate(int idDate)
        {
            var success = await _dateManager.DeleteDate(idDate);
            if (!success)
                return NotFound("Fecha no encontrada");
            return Ok("Fecha eliminada exitosamente");
        }

        [HttpPost("{idDate}/confirm/{idPlayer}")]
        public async Task<IActionResult> ConfirmPlayer(int idDate, int idPlayer)
        {
            var (success, message) = await _dateManager.ConfirmPlayer(idDate, idPlayer);
            if (!success)
                return BadRequest(message);
            return Ok(message);
        }

        [HttpGet("{idDate}/players")]
        public async Task<ActionResult<List<int>>> GetConfirmedPlayers(int idDate)
        {
            var players = await _dateManager.GetConfirmedPlayers(idDate);
            return Ok(players);
        }
    }
} 