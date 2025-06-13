import { ConfirmDate } from "../confirm-date.model";

export interface ConfirmPlayerResponse {
    success: boolean;
    message: string;
    data: {
        idDate: number;
        idPlayer: number;
        idField: number;
        idCategory: number;
    }
}

export interface GetDateByIdResponse {
    success: boolean;
    message: string;
    data: ConfirmDate & { idField: number; idCategory: number };
}

export interface GetConfirmedPlayersResponse {
    success: boolean;
    message: string;
    data: number[];
}

export interface GetAllDatesResponse {
    success: boolean;
    message: string;
    data: (ConfirmDate & { idField: number; idCategory: number })[];
}

export interface CreateDateResponse {
    success: boolean;
    message: string;
    data: ConfirmDate & { idField: number; idCategory: number };
}