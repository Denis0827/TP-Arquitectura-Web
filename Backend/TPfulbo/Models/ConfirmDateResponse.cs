using System;
using System.Collections.Generic;

namespace TPfulbo.Models
{
    public class ConfirmDateResponse
    {
        public int IdDate { get; set; }
        public DateTime Fecha { get; set; }
        public List<int> IdPlayers { get; set; }
        public int IdField { get; set; }
        public int IdCategory { get; set; }


        public ConfirmDateResponse(ConfirmDate date)
        {
            IdDate = date.IdDate;
            Fecha = date.Fecha;
            IdPlayers = date.IdPlayers;
            IdField = date.IdField;
            IdCategory = date.IdCategory;
        }

        public ConfirmDateResponse(ConfirmDate date, Field field, Category category)
        {
            IdDate = date.IdDate;
            Fecha = date.Fecha;
            IdPlayers = date.IdPlayers;
            IdField = date.IdField;
            IdCategory = date.IdCategory;

        }
    }
} 