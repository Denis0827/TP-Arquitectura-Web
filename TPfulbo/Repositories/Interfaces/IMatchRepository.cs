using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IMatchRepository
    {
        Task<IEnumerable<Match>> GetAllMatches();
        Task<Match> GetMatchById(int id);
        Task<Match> CreateMatch(int idCancha, int idCategory, DateTime fecha, TimeSpan hora, int idTeamA, int idTeamB);
        Task<bool> DeleteMatch(int id);
        Task<IEnumerable<Match>> GetMatchesByTeamId(int idTeam);
        Task<IEnumerable<Match>> GetMatchesByFecha(DateTime fecha);
        Task<IEnumerable<Match>> GetMatchesByCanchaId(int idCancha);
        Task<IEnumerable<Match>> GetMatchesByCategory(int idCategory);
    }
} 