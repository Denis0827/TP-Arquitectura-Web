import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfirmDateService } from './confirm-date.service';
import { environment } from '../../../../environments/environment';
import { ConfirmDate } from '../../../models/confirm-date.model';
import { CreateDateRequest } from '../../../models/requests/confirm-date.request';
import { ConfirmPlayerResponse, GetAllDatesResponse, GetDateByIdResponse, GetConfirmedPlayersResponse, CreateDateResponse } from '../../../models/responses/confirm-date.response';

describe('ConfirmDateService', () => {
  let service: ConfirmDateService;
  let httpMock: HttpTestingController;

  const mockDate: ConfirmDate & { idField: number; idCategory: number } = {
    idDate: 1,
    fecha: '2024-03-20T10:00:00',
    idPlayers: [1, 2, 3],
    idField: 1,
    idCategory: 1
  };

  const mockCreateDateRequest: CreateDateRequest & { idField: number; idCategory: number } = {
    fecha: '2024-03-20T10:00:00',
    idField: 1,
    idCategory: 1
  };

  const mockConfirmPlayerResponse: ConfirmPlayerResponse = {
    success: true,
    message: 'Attendance confirmed',
    data: {
      idDate: 1,
      idPlayer: 1
    }
  };

  const mockGetAllDatesResponse: GetAllDatesResponse = {
    success: true,
    message: 'Dates retrieved successfully',
    data: [mockDate]
  };

  const mockGetDateByIdResponse: GetDateByIdResponse = {
    success: true,
    message: 'Date retrieved successfully',
    data: mockDate
  };

  const mockGetConfirmedPlayersResponse: GetConfirmedPlayersResponse = {
    success: true,
    message: 'Players retrieved successfully',
    data: [1, 2, 3]
  };

  const mockCreateDateResponse: CreateDateResponse = {
    success: true,
    message: 'Date created successfully',
    data: mockDate
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfirmDateService]
    });

    service = TestBed.inject(ConfirmDateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllDates', () => {
    it('should return an array of dates', () => {
      service.getAllDates().subscribe(dates => {
        expect(dates).toEqual([mockDate]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGetAllDatesResponse);
    });

    it('should handle error when getting dates', () => {
      const errorMessage = 'Failed to fetch dates';
      service.getAllDates().subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate`);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getDateById', () => {
    it('should return a date by id', () => {
      service.getDateById(1).subscribe(date => {
        expect(date).toEqual(mockDate);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGetDateByIdResponse);
    });

    it('should handle error when getting date by id', () => {
      const errorMessage = 'Failed to fetch date';
      service.getDateById(999).subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/999`);
      req.flush({ message: errorMessage }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createDate', () => {
    const mockCoachId = 123;

    it('should create a new date with field and category', () => {
      service.createDate(mockCoachId, mockCreateDateRequest).subscribe(response => {
        expect(response).toEqual(mockDate);
        expect(response.idField).toBeDefined();
        expect(response.idCategory).toBeDefined();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/coaches/${mockCoachId}/createDate`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateDateRequest);
      req.flush(mockCreateDateResponse);
    });

    it('should handle error when creating date', () => {
      const errorMessage = 'Error al crear la fecha';
      service.createDate(mockCoachId, mockCreateDateRequest).subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/coaches/${mockCoachId}/createDate`);
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getDatesByPlayer', () => {
    it('should return dates for a player', () => {
      service.getDatesByPlayer(1).subscribe(dates => {
        expect(dates).toEqual([mockDate]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/player/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGetAllDatesResponse);
    });

    it('should handle error when getting dates by player', () => {
      const errorMessage = 'Failed to fetch player dates';
      service.getDatesByPlayer(999).subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/player/999`);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getConfirmedPlayers', () => {
    it('should return confirmed players for a date', () => {
      service.getConfirmedPlayers(1).subscribe(players => {
        expect(players).toEqual([1, 2, 3]);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/1/players`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGetConfirmedPlayersResponse);
    });

    it('should handle error when getting confirmed players', () => {
      const errorMessage = 'Failed to fetch confirmed players';
      service.getConfirmedPlayers(999).subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/999/players`);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('confirmAttendance', () => {
    it('should confirm player attendance', () => {
      const dateId = 1;
      const playerId = 1;
      service.confirmAttendance(dateId, playerId).subscribe(() => {
        expect().nothing(); // Expect no return value on success
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/${dateId}/confirm/${playerId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ dateId, playerId });
      req.flush(mockConfirmPlayerResponse);
    });

    it('should handle error when confirming attendance', () => {
      const dateId = 1;
      const playerId = 1;
      const errorMessage = 'Failed to confirm attendance';
      service.confirmAttendance(dateId, playerId).subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/${dateId}/confirm/${playerId}`);
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('cancelConfirmation', () => {
    it('should cancel player attendance', () => {
      const dateId = 1;
      const playerId = 1;
      service.cancelConfirmation(dateId, playerId).subscribe(() => {
        expect().nothing(); // Expect no return value on success
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/${dateId}/confirm/${playerId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true, message: 'Attendance cancelled' }); // Assuming similar response for delete
    });

    it('should handle error when canceling attendance', () => {
      const dateId = 1;
      const playerId = 1;
      const errorMessage = 'Failed to cancel confirmation';
      service.cancelConfirmation(dateId, playerId).subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/${dateId}/confirm/${playerId}`);
      req.flush({ message: errorMessage }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('deleteDate', () => {
    it('should delete a date', () => {
      const idDate = 1;
      service.deleteDate(idDate).subscribe(() => {
        expect().nothing(); // Expect no return value on success
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/${idDate}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true, message: 'Date deleted successfully' });
    });

    it('should handle error when deleting a date', () => {
      const idDate = 999;
      const errorMessage = 'Failed to delete date';
      service.deleteDate(idDate).subscribe({
        error: (error) => {
          expect(error).toEqual(errorMessage);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/ConfirmDate/${idDate}`);
      req.flush({ message: errorMessage }, { status: 500, statusText: 'Internal Server Error' });
    });
  });
}); 