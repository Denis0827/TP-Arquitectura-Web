using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IConfirmDateRepository
    {
        Task<IEnumerable<ConfirmDate>> GetAllDates();
        Task<ConfirmDate> GetDateById(int idDate);
        Task<ConfirmDate> GetDateByFecha(DateTime fecha);
        Task<ConfirmDate> CreateDate(DateTime fecha);
        Task<bool> DeleteDate(int idDate);
        Task<bool> ConfirmPlayer(int idDate, int idPlayer);
        Task<List<int>> GetConfirmedPlayers(int idDate);
    }
} 