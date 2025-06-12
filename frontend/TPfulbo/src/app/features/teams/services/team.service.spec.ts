import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamService, CreateTeamRequest, UpdateTeamRequest } from './team.service';
import { environment } from '../../../../environments/environment';
import { Team, Player } from '../../../models/team.model';

describe('TeamService', () => {
  let service: TeamService;
  let httpMock: HttpTestingController;

  const mockTeam: Team = {
    id: 1,
    name: 'Test Team',
    description: 'Test Description',
    coachId: 1,
    players: []
  };

  const mockPlayer: Player = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    position: 'Forward',
    number: 10
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
      req.flush(mockTeams);
    });

    it('should handle error when getting teams', () => {
      service.getAllTeams().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team`);
      req.error(new ErrorEvent('Server Error'), { status: 500 });
    });
  });

  describe('getTeamById', () => {
    it('should return a team by id', () => {
      service.getTeamById(1).subscribe(team => {
        expect(team).toEqual(mockTeam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTeam);
    });

    it('should handle error when getting team by id', () => {
      service.getTeamById(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/999`);
      req.error(new ErrorEvent('Not Found'), { status: 404 });
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
      req.flush(mockTeams);
    });
  });

  describe('createTeam', () => {
    it('should create a new team', () => {
      const newTeam: CreateTeamRequest = {
        name: 'New Team',
        description: 'New Description',
        coachId: 1
      };

      service.createTeam(newTeam).subscribe(team => {
        expect(team).toEqual(mockTeam);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newTeam);
      req.flush(mockTeam);
    });
  });

  describe('updateTeam', () => {
    it('should update an existing team', () => {
      const updateData: UpdateTeamRequest = {
        name: 'Updated Team',
        description: 'Updated Description'
      };

      service.updateTeam(1, updateData).subscribe(team => {
        expect(team).toEqual({ ...mockTeam, ...updateData });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush({ ...mockTeam, ...updateData });
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', (done) => {
      service.deleteTeam(1).subscribe(response => {
        expect(response).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('player management', () => {
    it('should add a player to team', () => {
      service.addPlayerToTeam(1, mockPlayer).subscribe(team => {
        expect(team.players).toContain(mockPlayer);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1/players`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPlayer);
      req.flush({ ...mockTeam, players: [mockPlayer] });
    });

    it('should remove a player from team', () => {
      service.removePlayerFromTeam(1, 1).subscribe(team => {
        expect(team.players).not.toContain(mockPlayer);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1/players/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ ...mockTeam, players: [] });
    });

    it('should update a player in team', () => {
      const updatedPlayer = { ...mockPlayer, number: 11 };
      service.updatePlayerInTeam(1, 1, updatedPlayer).subscribe(team => {
        expect(team.players).toContain(updatedPlayer);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/team/1/players/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPlayer);
      req.flush({ ...mockTeam, players: [updatedPlayer] });
    });
  });
}); 