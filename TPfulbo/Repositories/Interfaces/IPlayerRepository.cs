using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IPlayerRepository
    {
        Task<IEnumerable<Player>> GetAllPlayers();
        Task<Player> GetPlayerById(int idPlayer);
        Task<Player> GetPlayerByUserId(int idUser);
        Task<Player> CreatePlayer(int idUser, string nombre, string apellido, DateTime fechaNacimiento, string mail, string telefono, string contraseña);
        Task<bool> DeletePlayer(int idPlayer);
        Task<bool> DeletePlayerByUserId(int idUser);
        Task<Player> GetPlayerByEmail(string email);
    }
} 