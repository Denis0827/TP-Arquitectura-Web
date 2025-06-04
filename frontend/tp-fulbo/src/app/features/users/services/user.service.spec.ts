import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../../environments/environment';
import { PlayerRequest, LoginRequest } from '../../../models/requests/player.request';
import { LoginResponse, PlayerResponse, CoachResponse } from '../../../models/responses/login.response';
import { Player, Coach } from '../../../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/user`;

  // Test data
  const mockPlayerRequest: PlayerRequest = {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    position: 'Delantero',
    number: 9,
    password: 'password123'
  };

  const mockLoginRequest: LoginRequest = {
    email: 'juan@example.com',
    password: 'password123'
  };

  const mockLoginResponse: LoginResponse = {
    token: 'fake-jwt-token',
    userId: 1,
    role: 'player'
  };

  const mockPlayerResponse: PlayerResponse = {
    player: {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      position: 'Delantero',
      number: 9
    }
  };

  const mockCoachResponse: CoachResponse = {
    coach: {
      id: 1,
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
      teamIds: [1, 2]
    }
  };

  const mockPlayer: Player = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    position: 'Delantero',
    number: 9
  };

  const mockCoach: Coach = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan@example.com',
    teamIds: [1, 2]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('registerPlayer', () => {
    it('should register a player successfully', () => {
      service.registerPlayer(mockPlayerRequest).subscribe(response => {
        expect(response).toEqual(mockPlayerResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPlayerRequest);
      req.flush(mockPlayerResponse);
    });

    it('should handle registration error', () => {
      const errorMessage = 'Error al registrar jugador';
      
      service.registerPlayer(mockPlayerRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('login', () => {
    it('should login successfully', () => {
      service.login(mockLoginRequest).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);
      req.flush(mockLoginResponse);
    });

    it('should handle login error', () => {
      const errorMessage = 'Credenciales inválidas';
      
      service.login(mockLoginRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('createCoach', () => {
    it('should create a coach successfully', () => {
      const playerId = 1;
      
      service.createCoach(playerId).subscribe(response => {
        expect(response).toEqual(mockCoachResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/players/${playerId}/coach`);
      expect(req.request.method).toBe('POST');
      req.flush(mockCoachResponse);
    });

    it('should handle coach creation error', () => {
      const playerId = 1;
      const errorMessage = 'Error al crear coach';
      
      service.createCoach(playerId).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/players/${playerId}/coach`);
      req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getAllCoaches', () => {
    it('should get all coaches successfully', () => {
      const mockCoaches: Coach[] = [mockCoach];
      
      service.getAllCoaches().subscribe(coaches => {
        expect(coaches).toEqual(mockCoaches);
      });

      const req = httpMock.expectOne(`${apiUrl}/coaches`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCoaches);
    });

    it('should handle get coaches error', () => {
      const errorMessage = 'Error al obtener coaches';
      
      service.getAllCoaches().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/coaches`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getCoachById', () => {
    it('should get a coach by id successfully', () => {
      const coachId = 1;
      
      service.getCoachById(coachId).subscribe(coach => {
        expect(coach).toEqual(mockCoach);
      });

      const req = httpMock.expectOne(`${apiUrl}/coaches/${coachId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCoach);
    });

    it('should handle get coach by id error', () => {
      const coachId = 1;
      const errorMessage = 'Coach no encontrado';
      
      service.getCoachById(coachId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/coaches/${coachId}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteCoach', () => {
    it('should delete a coach successfully', () => {
      const coachId = 1;
      
      service.deleteCoach(coachId).subscribe(response => {
        expect(response).toEqual(mockCoachResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/coaches/${coachId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockCoachResponse);
    });

    it('should handle delete coach error', () => {
      const coachId = 1;
      const errorMessage = 'Error al eliminar coach';
      
      service.deleteCoach(coachId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/coaches/${coachId}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getAllPlayers', () => {
    it('should get all players successfully', () => {
      const mockPlayers: Player[] = [mockPlayer];
      
      service.getAllPlayers().subscribe(players => {
        expect(players).toEqual(mockPlayers);
      });

      const req = httpMock.expectOne(`${apiUrl}/players`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayers);
    });

    it('should handle get players error', () => {
      const errorMessage = 'Error al obtener jugadores';
      
      service.getAllPlayers().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/players`);
      req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getPlayerById', () => {
    it('should get a player by id successfully', () => {
      const playerId = 1;
      
      service.getPlayerById(playerId).subscribe(player => {
        expect(player).toEqual(mockPlayer);
      });

      const req = httpMock.expectOne(`${apiUrl}/players/${playerId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPlayer);
    });

    it('should handle get player by id error', () => {
      const playerId = 1;
      const errorMessage = 'Jugador no encontrado';
      
      service.getPlayerById(playerId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/players/${playerId}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deletePlayer', () => {
    it('should delete a player successfully', () => {
      const playerId = 1;
      
      service.deletePlayer(playerId).subscribe(response => {
        expect(response).toEqual(mockCoachResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/players/${playerId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockCoachResponse);
    });

    it('should handle delete player error', () => {
      const playerId = 1;
      const errorMessage = 'Error al eliminar jugador';
      
      service.deletePlayer(playerId).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
          expect(error.error).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/players/${playerId}`);
      req.flush(errorMessage, { status: 404, statusText: 'Not Found' });
    });
  });
}); 