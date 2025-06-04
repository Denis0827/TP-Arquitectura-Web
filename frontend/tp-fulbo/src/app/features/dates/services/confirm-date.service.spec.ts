import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfirmDateService } from './confirm-date.service';
import { environment } from '../../../../environments/environment';
import { ConfirmDate, ConfirmDateRequest, ConfirmDateResponse } from '../../../models/confirm-date.model';

describe('ConfirmDateService', () => {
  let service: ConfirmDateService;
  let httpMock: HttpTestingController;

  const mockDate: ConfirmDate = {
    idDate: 1,
    idMatch: 1,
    idTeam: 1,
    status: 'PENDING',
    responseDate: '2024-03-20T10:00:00',
    notes: 'Test date confirmation'
  };

  const mockCreateDateRequest: ConfirmDateRequest = {
    idMatch: 1,
    idTeam: 1,
    notes: 'New date confirmation'
  };

  const mockDateResponse: ConfirmDateResponse = {
    message: 'Date confirmation created successfully',
    dateId: 1
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
    it('should return an array of date confirmations', () => {
      const mockDates: ConfirmDate[] = [mockDate];

      service.getAllDates().subscribe(dates => {
        expect(dates).toEqual(mockDates);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-date`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDates);
    });

    it('should handle error when getting date confirmations', () => {
      service.getAllDates().subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-date`);
      req.error(new ErrorEvent('Server Error'), { status: 500 });
    });
  });

  describe('getDateById', () => {
    it('should return a date confirmation by id', () => {
      service.getDateById(1).subscribe(date => {
        expect(date).toEqual(mockDate);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-date/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDate);
    });

    it('should handle error when getting date confirmation by id', () => {
      service.getDateById(999).subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-date/999`);
      req.error(new ErrorEvent('Not Found'), { status: 404 });
    });
  });

  describe('createDate', () => {
    it('should create a new date confirmation', () => {
      service.createDate(mockCreateDateRequest).subscribe(response => {
        expect(response).toEqual(mockDateResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-date`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCreateDateRequest);
      req.flush(mockDateResponse);
    });

    it('should handle error when creating date confirmation', () => {
      service.createDate(mockCreateDateRequest).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-date`);
      req.error(new ErrorEvent('Bad Request'), { status: 400 });
    });
  });

  describe('getDatesByPlayer', () => {
    it('should return date confirmations for a player', () => {
      const mockDates: ConfirmDate[] = [mockDate];

      service.getDatesByPlayer(1).subscribe(dates => {
        expect(dates).toEqual(mockDates);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/confirm-date/player/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDates);
    });
  });
}); 