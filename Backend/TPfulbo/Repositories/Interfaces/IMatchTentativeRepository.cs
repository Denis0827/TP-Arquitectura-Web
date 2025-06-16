using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IMatchTentativeRepository
    {
        Task<IEnumerable<MatchTentative>> GetAllMatchTentative();
        Task<MatchTentative> GetMatchTentativeById(int idMatch);
        Task<MatchTentative> GetMatchTentativeByFecha(DateTime fecha);
        Task<MatchTentative> CreateMatchTentative(int idCoach, int idField, DateTime fecha, int idCategory);
        Task<bool> DeleteMatchTentative(int idMatch);
        Task<bool> ConfirmPlayer(int idMatch, int idPlayer);
        Task<List<int>> GetConfirmedPlayers(int idMatch);
        Task<bool> CancelPlayerConfirmation(int idMatch, int idPlayer);
    }
}