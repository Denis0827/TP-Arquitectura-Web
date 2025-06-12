import { Team } from '../team.model';

export interface TeamResponse {
  success: boolean;
  message: string;
  data: Team;
}

export interface TeamsResponse {
  success: boolean;
  message: string;
  data: Team[];
} 