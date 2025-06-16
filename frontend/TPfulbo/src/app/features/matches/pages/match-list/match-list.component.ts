import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ServiceFacade } from '../../../../core/services/service-facade.service';
import { Match } from '../../../../models/match.model';
import { Player, Coach, User } from '../../../../models/user.model';
import { Field } from '../../../../models/field.model';
import { Category } from '../../../../models/category.model';
import { AuthService } from '../../../auth/services/auth.service';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';

interface MatchWithDetails extends Match {
  coachName?: string;
  teamAPlayers?: Player[];
  teamBPlayers?: Player[];
  field?: Field;
  category?: Category;
}

interface MatchWithDisplayIndex extends MatchWithDetails {
  displayIndex: number;
}

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.scss']
})
export class MatchListComponent implements OnInit {
  public matches: MatchWithDisplayIndex[] = [];
  public loading = true;
  public error: string | null = null;

  constructor(private serviceFacade: ServiceFacade, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  private loadMatches(): void {
    this.loading = true;
    this.error = null;

    console.log('MatchListComponent: Iniciando carga de partidos...');
    this.serviceFacade.getAllMatches().pipe(
      catchError(err => {
        this.error = 'Error al cargar los partidos.';
        this.loading = false;
        console.error('MatchListComponent: Error al cargar partidos:', err);
        return of([]);
      })
    ).subscribe({
      next: (matches) => {
        console.log('MatchListComponent: Partidos obtenidos de la API (crudos):', matches);
        if (matches.length === 0) {
          console.log('MatchListComponent: No se encontraron partidos.');
          this.matches = [];
          this.loading = false;
          return;
        }

        const matchDetailsObservables = matches.map(match => 
          this.loadMatchDetails(match)
        );

        forkJoin(matchDetailsObservables).pipe(
          catchError(err => {
            this.error = 'Error al cargar los detalles de los partidos.';
            this.loading = false;
            console.error('MatchListComponent: Error al cargar detalles de partidos:', err);
            return of([]);
          })
        ).subscribe({
          next: (matchesWithDetails) => {
            console.log('MatchListComponent: Partidos con detalles cargados:', matchesWithDetails);
            
            // Ordenar por fecha para asegurar un orden consistente para el displayIndex
            const sortedMatches = matchesWithDetails.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

            let filteredAndIndexedMatches: MatchWithDisplayIndex[] = [];
            const currentUser = this.authService.getCurrentUser();
            
            if (currentUser) {
              if (currentUser.role === 'Player') {
                const playerId = currentUser.idUser;
                filteredAndIndexedMatches = sortedMatches.filter(match => 
                  match.teamAPlayers?.some(player => player.idUser === playerId) ||
                  match.teamBPlayers?.some(player => player.idUser === playerId)
                ).map((match, index) => ({ ...match, displayIndex: index + 1 }));
                console.log('MatchListComponent: Partidos filtrados e indexados para jugador:', filteredAndIndexedMatches);
              } else if (currentUser.role === 'Coach') {
                const coachId = currentUser.idUser;
                filteredAndIndexedMatches = sortedMatches.filter(match => match.idCoach === coachId)
                                                        .map((match, index) => ({ ...match, displayIndex: index + 1 }));
                console.log('MatchListComponent: Partidos filtrados e indexados para entrenador:', filteredAndIndexedMatches);
              } else {
                // Para otros roles, indexar todos los partidos ordenados por fecha
                filteredAndIndexedMatches = sortedMatches.map((match, index) => ({ ...match, displayIndex: index + 1 }));
                console.log('MatchListComponent: Todos los partidos indexados por fecha:', filteredAndIndexedMatches);
              }
            } else {
              // Si no hay usuario logueado, indexar todos los partidos ordenados por fecha
              filteredAndIndexedMatches = sortedMatches.map((match, index) => ({ ...match, displayIndex: index + 1 }));
              console.log('MatchListComponent: Todos los partidos indexados por fecha (sin login):', filteredAndIndexedMatches);
            }

            this.matches = filteredAndIndexedMatches;
            this.loading = false;
          },
          error: (err) => {
            console.error('MatchListComponent: Error final en forkJoin:', err);
          },
          complete: () => {
            console.log('MatchListComponent: Carga de partidos completada.');
          }
        });
      },
      error: (err) => {
        console.error('MatchListComponent: Error inicial en getAllMatches:', err);
      },
      complete: () => {
        console.log('MatchListComponent: Suscripción a getAllMatches completada.');
      }
    });
  }

  private loadMatchDetails(match: Match): Observable<MatchWithDetails> {
    console.log(`MatchListComponent: Cargando detalles para el partido ${match.idMatch}`);
    return forkJoin({
      coach: this.serviceFacade.getCoachById(match.idCoach).pipe(
        map(response => {
          if ('data' in response) {
            return response.data as Coach;
          }
          return response as Coach;
        }),
        catchError(err => {
          console.warn(`MatchListComponent: No se pudo cargar el entrenador ${match.idCoach}:`, err);
          return of(null);
        })
      ),
      teamA: this.serviceFacade.getTeamById(match.idTeamA).pipe(
        tap(team => {
          console.log(`MatchListComponent: Equipo A (${match.idTeamA}) cargado:`, team);
          console.log(`MatchListComponent: Contenido completo de Equipo A (${match.idTeamA}):`, JSON.stringify(team));
        }),
        catchError(err => {
          console.warn(`MatchListComponent: No se pudo cargar el equipo A ${match.idTeamA}:`, err);
          return of(null);
        })
      ),
      teamB: this.serviceFacade.getTeamById(match.idTeamB).pipe(
        tap(team => {
          console.log(`MatchListComponent: Equipo B (${match.idTeamB}) cargado:`, team);
          console.log(`MatchListComponent: Contenido completo de Equipo B (${match.idTeamB}):`, JSON.stringify(team));
        }),
        catchError(err => {
          console.warn(`MatchListComponent: No se pudo cargar el equipo B ${match.idTeamB}:`, err);
          return of(null);
        })
      ),
      field: this.serviceFacade.getFieldById(match.idField).pipe(
        tap(field => {
          console.log(`MatchListComponent: Campo (${match.idField}) cargado:`, field);
        }),
        catchError(err => {
          console.warn(`MatchListComponent: No se pudo cargar el campo ${match.idField}:`, err);
          return of(null);
        })
      ),
      category: this.serviceFacade.getCategoryById(match.idCategory).pipe(
        tap(category => {
          console.log(`MatchListComponent: Categoría (${match.idCategory}) cargada:`, category);
        }),
        catchError(err => {
          console.warn(`MatchListComponent: No se pudo cargar la categoría ${match.idCategory}:`, err);
          return of(null);
        })
      )
    }).pipe(
      switchMap(({ coach, teamA, teamB, field, category }) => {
        console.log(`MatchListComponent: Procesando partido ${match.idMatch}: Equipo A:`, teamA, `Equipo B:`, teamB);

        const teamAPlayerObservables: Observable<(Player | null)[]> = teamA && teamA.idPlayers && teamA.idPlayers.length > 0
          ? forkJoin(teamA.idPlayers.map(id =>
              this.serviceFacade.getPlayerById(id).pipe(
                catchError(err => {
                  console.warn(`MatchListComponent: No se pudo cargar el jugador ${id} para el equipo A:`, err);
                  return of(null);
                })
              )
            ))
          : of([]);

        const teamBPlayerObservables: Observable<(Player | null)[]> = teamB && teamB.idPlayers && teamB.idPlayers.length > 0
          ? forkJoin(teamB.idPlayers.map(id =>
              this.serviceFacade.getPlayerById(id).pipe(
                catchError(err => {
                  console.warn(`MatchListComponent: No se pudo cargar el jugador ${id} para el equipo B:`, err);
                  return of(null);
                })
              )
            ))
          : of([]);

        return forkJoin([of(coach), teamAPlayerObservables, teamBPlayerObservables]).pipe(
          map(([loadedCoach, teamAPlayers, teamBPlayers]) => {
            console.log(`MatchListComponent: Jugadores del Equipo A para partido ${match.idMatch}:`, teamAPlayers);
            console.log(`MatchListComponent: Jugadores del Equipo B para partido ${match.idMatch}:`, teamBPlayers);
            return {
              ...match,
              coachName: loadedCoach ? `${loadedCoach.nombre} ${loadedCoach.apellido}` : 'Unknown Coach',
              teamAPlayers: teamAPlayers.filter((p: Player | null): p is Player => p !== null),
              teamBPlayers: teamBPlayers.filter((p: Player | null): p is Player => p !== null),
              field: field || undefined,
              category: category || undefined
            };
          })
        );
      })
    );
  }
}
