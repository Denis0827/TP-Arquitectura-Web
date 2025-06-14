using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TPfulbo.Models;

namespace TPfulbo.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetUserById(int idUser);
        Task<User> GetUserByEmail(string email);
        Task<IEnumerable<User>> GetAllUsers();
    }
} 