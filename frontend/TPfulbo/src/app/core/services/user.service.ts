import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from './api.service';
import { Player, Coach } from '../../models/user.model';

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
          idUser: response.data.idUser,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fechaNacimiento: response.data.fechaNacimiento,
          mail: response.data.mail,
          telefono: response.data.telefono,
          contraseña: response.data.contraseña,
          role: 'Player',
          dni: response.data.dni,
          edad: response.data.edad
        };
      })
    );
  }

  getCoachById(id: number): Observable<Coach> {
    return this.apiService.get<any>(`api/user/coaches/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message);
        }
        return {
          idUser: response.data.idUser,
          nombre: response.data.nombre,
          apellido: response.data.apellido,
          fechaNacimiento: response.data.fechaNacimiento,
          mail: response.data.mail,
          telefono: response.data.telefono,
          contraseña: response.data.contraseña,
          role: 'Coach',
          licencia: response.data.licencia,
          fechaIngreso: response.data.fechaIngreso,
          aniosExperiencia: response.data.aniosExperiencia
        };
      })
    );
  }
} 