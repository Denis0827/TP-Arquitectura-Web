import { Coach } from '../user.model';

export interface CoachResponse {
    success: boolean;
    message: string;
    data: Coach;
}

export interface CoachesResponse {
    success: boolean;
    message: string;
    data: Coach[];
} 