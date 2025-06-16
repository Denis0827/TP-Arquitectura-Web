import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamService, CreateTeamRequest, UpdateTeamRequest } from './team.service';
import { environment } from '../../../../environments/environment';
import { Team } from '../../../models/team.model';
import { Player } from '../../../models/user.model';

describe('TeamService', () => {
  let service: TeamService;
  let httpMock: HttpTestingController;

  const mockTeam: Team = {
    idTeam: 1,
    idPlayers: [1, 2, 3]
  };

  const mockPlayer: Player = {
    idUser: 1,
    nombre: 'John',
    apellido: 'Doe',
    fechaNacimiento: '1990-01-01',
    mail: 'john.doe@example.com',
    telefono: '123456789',
    contraseña: 'password',
    role: 'Player',
    dni: '12345678A',
    edad: 30
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeamService]
    });

    service = TestBed.inject(TeamService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllTeams', () => {
    it('should return an array of teams', () => {
      const mockTeams: Team[] = [mockTeam];

      service.getAllTeams().subscribe(teams => {
        expect(teams).toEqual(mockTeams);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, message: 'Ok', data: mockTeams });
    });

    it('should handle error when getting teams', () => {
      service.getAllTeams().subscribe({
        error: (error) => {
          expect(error.message).toContain('Error al obtener todos los equipos');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: false, message: 'Error al obtener todos los equipos' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getTeamById', () => {
    it('should return a team by id', () => {
      service.getTeamById(1).subscribe(team => {
        expect(team).toEqual(mockTeam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, message: 'Ok', data: mockTeam });
    });

    it('should handle error when getting team by id', () => {
      service.getTeamById(999).subscribe({
        error: (error) => {
          expect(error.message).toContain('Error al obtener el equipo por ID');
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/999`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: false, message: 'Error al obtener el equipo por ID' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getTeamsByPlayer', () => {
    it('should return teams for a player', () => {
      const mockTeams: Team[] = [mockTeam];

      service.getTeamsByPlayer(1).subscribe(teams => {
        expect(teams).toEqual(mockTeams);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/players/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, message: 'Ok', data: mockTeams });
    });
  });

  describe('createTeam', () => {
    it('should create a new team', () => {
      const newTeamRequest: CreateTeamRequest = {
        idPlayers: [4, 5, 6]
      };
      const createdTeam: Team = { ...mockTeam, idTeam: 2, idPlayers: newTeamRequest.idPlayers };

      service.createTeam(newTeamRequest).subscribe(team => {
        expect(team).toEqual(createdTeam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTeamRequest);
      req.flush({ success: true, message: 'Equipo creado exitosamente', data: createdTeam });
    });
  });

  describe('updateTeam', () => {
    it('should update an existing team', () => {
      const updateData: UpdateTeamRequest = {
        idPlayers: [1, 2, 3, 4]
      };
      const updatedTeam: Team = { ...mockTeam, idPlayers: updateData.idPlayers ?? mockTeam.idPlayers };

      service.updateTeam(1, updateData).subscribe(team => {
        expect(team).toEqual(updatedTeam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush({ success: true, message: 'Equipo actualizado exitosamente', data: updatedTeam });
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', (done) => {
      service.deleteTeam(1).subscribe(() => {
        expect().nothing();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true, message: 'Equipo eliminado exitosamente' });
    });
  });

  describe('player management', () => {
    it('should add a player to team', () => {
      const teamAfterAdd: Team = { ...mockTeam, idPlayers: [...mockTeam.idPlayers, mockPlayer.idUser] };

      service.addPlayerToTeam(mockTeam.idTeam, mockPlayer).subscribe(team => {
        expect(team.idPlayers).toContain(mockPlayer.idUser);
        expect(team.idPlayers.length).toBe(mockTeam.idPlayers.length + 1);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/${mockTeam.idTeam}/players`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPlayer);
      req.flush({ success: true, message: 'Jugador añadido', data: teamAfterAdd });
    });

    it('should remove a player from team', () => {
      const teamAfterRemove: Team = { ...mockTeam, idPlayers: mockTeam.idPlayers.filter(id => id !== mockPlayer.idUser) };

      const mockTeamWithPlayer: Team = { ...mockTeam, idPlayers: [mockPlayer.idUser, ...mockTeam.idPlayers] };

      service.removePlayerFromTeam(mockTeamWithPlayer.idTeam, mockPlayer.idUser).subscribe(team => {
        expect(team.idPlayers).not.toContain(mockPlayer.idUser);
        expect(team.idPlayers.length).toBe(mockTeamWithPlayer.idPlayers.length - 1);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/${mockTeamWithPlayer.idTeam}/players/${mockPlayer.idUser}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true, message: 'Jugador eliminado', data: teamAfterRemove });
    });

    it('should update a player in team', () => {
      const updatedPlayerId = mockPlayer.idUser;
      const updatedPlayer: Player = { ...mockPlayer, nombre: 'Updated Name' };
      const teamAfterUpdate: Team = { ...mockTeam, idPlayers: [updatedPlayerId, ...mockTeam.idPlayers.filter(id => id !== updatedPlayerId)] };

      service.updatePlayerInTeam(mockTeam.idTeam, updatedPlayerId, updatedPlayer).subscribe(team => {
        expect(team.idPlayers).toContain(updatedPlayerId);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/${mockTeam.idTeam}/players/${updatedPlayerId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPlayer);
      req.flush({ success: true, message: 'Jugador actualizado', data: teamAfterUpdate });
    });
  });
}); 