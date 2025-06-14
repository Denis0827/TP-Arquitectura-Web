using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Interfaces
{
    public interface IMatchRepository
    {
        Task<IEnumerable<Match>> GetAllMatches();
        Task<Match> GetMatchById(int idMatch);
        Task<Match> GetMatchByDate(int idDate);
        Task<IEnumerable<Match>> GetMatchesByPlayer(int idPlayer);
        Task<Match> CreateMatch(int idCoach, int idField, int idDate, int idCategory);
        Task<bool> DeleteMatch(int idMatch);
    }
} 