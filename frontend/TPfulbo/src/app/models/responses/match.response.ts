import { Match } from '../match.model';

export interface CreateMatchResponse {
  success: boolean;
  message: string;
  data: {
    matchId: number;
  };
}

export interface GetMatchByIdResponse {
  success: boolean;
  message: string;
  data: Match;
}

export interface DeleteMatchResponse {
  success: boolean;
  message: string;
  data: {
    idMatch: number;
  };
}

export interface MatchesResponse {
  success: boolean;
  message: string;
  data: Match[];
}
