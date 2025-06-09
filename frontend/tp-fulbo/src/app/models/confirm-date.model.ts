export interface ConfirmDate {
  idDate: number;
  fecha: string;
  idPlayers: number[];
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Match {
  id: string;
  team1: Team;
  team2: Team;
  score?: {
    team1: number;
    team2: number;
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
}

export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
}

export interface ConfirmDateRequest {
  idMatch: number;
  idTeam: number;
  notes?: string;
}

export interface ConfirmDateResponse {
  message: string;
  dateId: number;
} 