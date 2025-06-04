export interface ConfirmDate {
  idDate: number;
  idMatch: number;
  idTeam: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  responseDate: string;
  notes?: string;
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