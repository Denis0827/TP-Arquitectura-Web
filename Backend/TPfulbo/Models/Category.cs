using System;

namespace TPfulbo.Models
{
    public class Category
    {
        private int _idCategory;
        private int _anio;
        private string _genero;

        public int IdCategory 
        { 
            get { return _idCategory; }
            set { _idCategory = value; }
        }
        public int Anio 
        { 
            get { return _anio; }
            set { _anio = value; }
        }
        public string Genero 
        { 
            get { return _genero; }
            set { _genero = value; }
        }

        public Category(int anio, string genero)
        {
            _anio = anio;
            _genero = genero;
        }
    }
} 