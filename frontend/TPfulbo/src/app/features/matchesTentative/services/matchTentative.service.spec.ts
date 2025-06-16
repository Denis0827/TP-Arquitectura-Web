import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatchTentativeService } from './matchTentative.service';
import { environment } from '../../../../environments/environment';
import { MatchTentative } from '../../../models/matchTentative.model';
import { CreateMatchTentativeRequest } from '../../../models/requests/matchTentative.request';
import { ConfirmPlayerResponse, GetAllMatchTentativeResponse, GetMatchTentativeByIdResponse, GetConfirmedPlayersResponse, CreateMatchTentativeResponse } from '../../../models/responses/matchTentative.response';

describe('MatchTentativeService', () => {
  let service: MatchTentativeService;
  let httpMock: HttpTestingController;

  const mockMatchTentative: MatchTentative = {
    idMatch: 1,
    idCoach: 1,
    idField: 1,
    fecha: '2024-03-20T10:00:00',
    idCategory: 1,
    idPlayers: [1, 2, 3]
  };

  const mockGetAllMatchTentativeResponse: GetAllMatchTentativeResponse = {
    success: true,
    message: 'Matches tentative retrieved successfully',
    data: [mockMatchTentative]
  };

  const mockGetMatchTentativeByIdResponse: GetMatchTentativeByIdResponse = {
    success: true,
    message: 'Match tentative retrieved successfully',
    data: mockMatchTentative
  };

  const mockCreateMatchTentativeResponse: CreateMatchTentativeResponse = {
    success: true,
    message: 'Match tentative created successfully',
    data: mockMatchTentative
  };

  const mockConfirmPlayerResponse: ConfirmPlayerResponse = {
    success: true,
    message: 'Player confirmed successfully',
    data: {
      idMatch: 1,
      idPlayer: 1,
      confirmed: true
    }
  };

  const mockGetConfirmedPlayersResponse: GetConfirmedPlayersResponse = {
    success: true,
    message: 'Confirmed players retrieved successfully',
    data: [1, 2, 3]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MatchTentativeService]
    });

    service = TestBed.inject(MatchTentativeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllMatchTentative', () => {
    it('should return an array of matches tentative', () => {
      service.getAllMatchTentative().subscribe(matches => {
        expect(matches).toEqual([mockMatchTentative]);
      });

      const req = httpMock.expectOne('api/MatchTentative');
      expect(req.request.method).toBe('GET');
      req.flush(mockGetAllMatchTentativeResponse);
    });

    it('should handle error when getting matches tentative', () => {
      const errorMessage = 'Failed to fetch matches tentative';
      service.getAllMatchTentative().subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('api/MatchTentative');
      req.flush({ success: false, message: errorMessage });
    });
  });

  describe('getMatchTentativeById', () => {
    it('should return a match tentative by id', () => {
      service.getMatchTentativeById(1).subscribe(match => {
        expect(match).toEqual(mockMatchTentative);
      });

      const req = httpMock.expectOne('api/MatchTentative/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockGetMatchTentativeByIdResponse);
    });

    it('should handle error when getting match tentative by id', () => {
      const errorMessage = 'Failed to fetch match tentative';
      service.getMatchTentativeById(1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('api/MatchTentative/1');
      req.flush({ success: false, message: errorMessage });
    });
  });

  describe('createMatchTentative', () => {
    it('should create a new match tentative', () => {
      const newMatchTentative = { ...mockMatchTentative, idMatch: undefined };
      service.createMatchTentative(1, newMatchTentative).subscribe(match => {
        expect(match).toEqual(mockMatchTentative);
      });

      const req = httpMock.expectOne('api/MatchTentative/coaches/1/createMatch');
      expect(req.request.method).toBe('POST');
      req.flush(mockCreateMatchTentativeResponse);
    });

    it('should handle error when creating match tentative', () => {
      const errorMessage = 'Failed to create match tentative';
      service.createMatchTentative(1, mockMatchTentative).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('api/MatchTentative/coaches/1/createMatch');
      req.flush({ success: false, message: errorMessage });
    });
  });

  describe('deleteMatchTentative', () => {
    it('should delete a match tentative', () => {
      service.deleteMatchTentative(1).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne('api/MatchTentative/1');
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true, message: 'Match tentative deleted successfully' });
    });

    it('should handle error when deleting match tentative', () => {
      const errorMessage = 'Failed to delete match tentative';
      service.deleteMatchTentative(1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('api/MatchTentative/1');
      req.flush({ success: false, message: errorMessage });
    });
  });

  describe('confirmAttendance', () => {
    it('should confirm player attendance', () => {
      service.confirmAttendance(1, 1).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne('api/MatchTentative/1/confirm/1');
      expect(req.request.method).toBe('POST');
      req.flush(mockConfirmPlayerResponse);
    });

    it('should handle error when confirming attendance', () => {
      const errorMessage = 'Failed to confirm attendance';
      service.confirmAttendance(1, 1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('api/MatchTentative/1/confirm/1');
      req.flush({ success: false, message: errorMessage });
    });
  });

  describe('cancelConfirmation', () => {
    it('should cancel player confirmation', () => {
      service.cancelConfirmation(1, 1).subscribe(() => {
        expect(true).toBeTruthy();
      });

      const req = httpMock.expectOne('api/MatchTentative/1/unconfirm/1');
      expect(req.request.method).toBe('POST');
      req.flush(mockConfirmPlayerResponse);
    });

    it('should handle error when canceling confirmation', () => {
      const errorMessage = 'Failed to cancel confirmation';
      service.cancelConfirmation(1, 1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('api/MatchTentative/1/unconfirm/1');
      req.flush({ success: false, message: errorMessage });
    });
  });

  describe('getConfirmedPlayers', () => {
    it('should return confirmed players', () => {
      service.getConfirmedPlayers(1).subscribe(players => {
        expect(players).toEqual([1, 2, 3]);
      });

      const req = httpMock.expectOne('api/MatchTentative/1/confirmed');
      expect(req.request.method).toBe('GET');
      req.flush(mockGetConfirmedPlayersResponse);
    });

    it('should handle error when getting confirmed players', () => {
      const errorMessage = 'Failed to fetch confirmed players';
      service.getConfirmedPlayers(1).subscribe({
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      });

      const req = httpMock.expectOne('api/MatchTentative/1/confirmed');
      req.flush({ success: false, message: errorMessage });
    });
  });
}); 