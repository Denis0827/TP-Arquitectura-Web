using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using TPfulbo.Managers;

namespace TPfulbo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssistanceController : ControllerBase
    {
        private readonly AssistanceManager _assistanceManager;

        public AssistanceController(AssistanceManager assistanceManager)
        {
            _assistanceManager = assistanceManager;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssistance([FromBody] dynamic request)
        {
            var (success, message) = await _assistanceManager.CreateAssistance(
                (int)request.idPlayer,
                (int)request.idMatch
            );

            if (!success)
            {
                return BadRequest(message);
            }

            return Ok(message);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAssistances()
        {
            var assistances = await _assistanceManager.GetAllAssistances();
            return Ok(assistances);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssistanceById(int id)
        {
            var assistance = await _assistanceManager.GetAssistanceById(id);
            if (assistance == null)
            {
                return NotFound("Asistencia no encontrada");
            }
            return Ok(assistance);
        }

        [HttpGet("player/{idPlayer}")]
        public async Task<IActionResult> GetAssistancesByPlayerId(int idPlayer)
        {
            var assistances = await _assistanceManager.GetAssistancesByPlayerId(idPlayer);
            return Ok(assistances);
        }

        [HttpGet("match/{idMatch}")]
        public async Task<IActionResult> GetAssistancesByMatchId(int idMatch)
        {
            var assistances = await _assistanceManager.GetAssistancesByMatchId(idMatch);
            return Ok(assistances);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssistance(int id)
        {
            var success = await _assistanceManager.DeleteAssistance(id);
            if (!success)
            {
                return NotFound("Asistencia no encontrada");
            }
            return Ok("Asistencia eliminada exitosamente");
        }
    }
} 