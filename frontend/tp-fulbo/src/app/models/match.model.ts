export interface Match {
  idMatch: number;
  idTeamA: number;
  idTeamB: number;
  idDate: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  scoreTeamA: number;
  scoreTeamB: number;
  notes?: string;
}

export interface CreateMatchRequest {
  idTeamA: number;
  idTeamB: number;
  idDate: number;
  notes?: string;
}

export interface MatchResponse {
  message: string;
  matchId: number;
} 