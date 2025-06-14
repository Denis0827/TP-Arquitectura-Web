export interface CreateMatchRequest {
  idCoach: number;
  idField: number;
  idConfirmDate: number;
  idCategory: number;
  idPlayersTeamA: number[];
  idPlayersTeamB: number[];
}