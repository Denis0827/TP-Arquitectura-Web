export interface LoginResponse {
  token: string;
  userId: number;
  role: 'player' | 'coach';
}

export interface PlayerResponse {
  player: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    position?: string;
    number?: number;
  };
}

export interface CoachResponse {
  coach: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    teamIds?: number[];
  };
} 