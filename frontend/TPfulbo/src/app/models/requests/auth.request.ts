export interface LoginRequest {
    Mail: string;
    Contraseña: string;
}

export interface RegisterRequest {
    Nombre: string;
    Apellido: string;
    FechaNacimiento: string;
    Mail: string;
    Telefono: string;
    Contraseña: string;
    DNI: string;
    Edad: number;
}