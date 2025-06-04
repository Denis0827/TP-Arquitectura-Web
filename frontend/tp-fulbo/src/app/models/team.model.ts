export interface Team {
  id: number;
  name: string;
  description?: string;
  coachId: number;
  players: Player[];
}

export interface Player {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  number: number;
}

export interface TeamResponse {
  message: string;
  teamId: number;
} 