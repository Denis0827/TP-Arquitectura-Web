import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Player } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiService = inject(ApiService);

  getPlayerById(id: number): Observable<Player> {
    return this.apiService.get<any>(`api/user/players/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return {
          id: response.data.id,
          email: response.data.email,
          firstName: response.data.nombre,
          lastName: response.data.apellido,
          role: 'Player',
          position: response.data.position,
          number: response.data.number,
          teamId: response.data.teamId
        };
      })
    );
  }
} 