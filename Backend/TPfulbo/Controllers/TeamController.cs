using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Managers;
using TPfulbo.Models;

namespace TPfulbo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamController : ControllerBase
    {
        private readonly TeamManager _teamManager;

        public TeamController(TeamManager teamManager)
        {
            _teamManager = teamManager;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetAllTeams()
        {
            var teams = await _teamManager.GetAllTeams();
            return Ok(ApiResponse<object>.CreateSuccess(teams, "Equipos obtenidos exitosamente"));
        }

        [HttpGet("{idTeam}")]
        public async Task<ActionResult<Team>> GetTeamById(int idTeam)
        {
            var team = await _teamManager.GetTeamById(idTeam);
            if (team == null)
                return NotFound(ApiResponse<object>.CreateError("Equipo no encontrado"));
            return Ok(ApiResponse<object>.CreateSuccess(team, "Equipo encontrado exitosamente"));
        }

        [HttpGet("players/{idPlayer}")]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeamsByPlayer(int idPlayer)
        {
            var teams = await _teamManager.GetTeamsByPlayer(idPlayer);
            return Ok(ApiResponse<object>.CreateSuccess(teams, "Equipos del player obtenidos exitosamente"));
        }
    }
} 