import { MatchTentative } from "../matchTentative.model";

export interface ConfirmPlayerResponse {
    success: boolean;
    message: string;
    data: {};
}

export interface GetMatchTentativeByIdResponse {
    success: boolean;
    message: string;
    data: MatchTentative;
}

export interface GetConfirmedPlayersResponse {
    success: boolean;
    message: string;
    data: number[];
}

export interface GetAllMatchTentativeResponse {
    success: boolean;
    message: string;
    data: MatchTentative[];
}

export interface CreateMatchTentativeResponse {
    success: boolean;
    message: string;
    data: MatchTentative;
}