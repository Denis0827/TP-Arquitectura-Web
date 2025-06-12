import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatchService } from './match.service';
import { environment } from '../../../../environments/environment';
import { Match } from '../../../models/match.model';
import { CreateMatchRequest } from '../../../models/requests/match.request';
import { CreateMatchResponse } from '../../../models/responses/match.response';

describe('MatchService', () => {
  let service: MatchService;
  let httpMock: HttpTestingController;

  const mockMatch: Match = {
    idMatch: 1,
    idCoach: 1,
    idField: 1,
    idDate: 1,
    idCategory: 1,
    idTeamA: 1,
    idTeamB: 2
  };

  const mockCreateMatchRequest: CreateMatchRequest = {
    idCoach: 1,
    idField: 1,
    idDate: 1,
    idCategory: 1,
    idTeamA: 1,
    idTeamB: 2
  };

  const mockCreateMatchResponse: CreateMatchResponse = {
    success: true,
    message: 'Partido creado exitosamente',
    data: {
      matchId: 1
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MatchService]
    });

    service = TestBed.inject(MatchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllMatches', () => {
    it('should return an array of matches', () => {
      const mockMatches: Match[] = [mockMatch];

      service.getAllMatches().subscribe(matches => {
        expect(matches).toEqual(mockMatches);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMatches);
    });

    it('should handle error when getting matches', () => {
      service.getAllMatches().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match`);
      req.error(new ErrorEvent('Server Error'), { status: 500 });
    });
  });

  describe('getMatchById', () => {
    it('should return a match by id', () => {
      service.getMatchById(1).subscribe(match => {
        expect(match).toEqual(mockMatch);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMatch);
    });

    it('should handle error when getting match by id', () => {
      service.getMatchById(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match/999`);
      req.error(new ErrorEvent('Not Found'), { status: 404 });
    });
  });

  describe('createMatch', () => {
    it('should create a new match', () => {
      service.createMatch(mockCreateMatchRequest).subscribe(response => {
        expect(response).toEqual({ matchId: mockCreateMatchResponse.data.matchId });
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateMatchRequest);
      req.flush(mockCreateMatchResponse);
    });

    it('should handle error when creating match', () => {
      service.createMatch(mockCreateMatchRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match`);
      req.error(new ErrorEvent('Bad Request'), { status: 400 });
    });
  });

  describe('getMatchesByTeam', () => {
    it('should return matches for a team', () => {
      const mockMatches: Match[] = [mockMatch];

      service.getMatchesByTeam(1).subscribe(matches => {
        expect(matches).toEqual(mockMatches);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match/team/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMatches);
    });
  });

  describe('getMatchesByDate', () => {
    it('should return matches for a date', () => {
      const mockMatches: Match[] = [mockMatch];

      service.getMatchesByDate(1).subscribe(matches => {
        expect(matches).toEqual(mockMatches);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/match/date/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockMatches);
    });
  });
}); 