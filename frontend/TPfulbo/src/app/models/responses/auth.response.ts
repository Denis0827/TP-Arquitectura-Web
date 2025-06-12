export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
      userType: 'Player' | 'Coach';
      userId: number;
    };
  }

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
      idUser: number;
    };
}