export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
  }
  
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}