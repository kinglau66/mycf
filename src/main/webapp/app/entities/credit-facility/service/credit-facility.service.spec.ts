import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICreditFacility } from '../credit-facility.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../credit-facility.test-samples';

import { CreditFacilityService, RestCreditFacility } from './credit-facility.service';

const requireRestSample: RestCreditFacility = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
  endDate: sampleWithRequiredData.endDate?.format(DATE_FORMAT),
};

describe('CreditFacility Service', () => {
  let service: CreditFacilityService;
  let httpMock: HttpTestingController;
  let expectedResult: ICreditFacility | ICreditFacility[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreditFacilityService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a CreditFacility', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const creditFacility = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(creditFacility).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CreditFacility', () => {
      const creditFacility = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(creditFacility).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CreditFacility', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CreditFacility', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CreditFacility', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCreditFacilityToCollectionIfMissing', () => {
      it('should add a CreditFacility to an empty array', () => {
        const creditFacility: ICreditFacility = sampleWithRequiredData;
        expectedResult = service.addCreditFacilityToCollectionIfMissing([], creditFacility);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditFacility);
      });

      it('should not add a CreditFacility to an array that contains it', () => {
        const creditFacility: ICreditFacility = sampleWithRequiredData;
        const creditFacilityCollection: ICreditFacility[] = [
          {
            ...creditFacility,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCreditFacilityToCollectionIfMissing(creditFacilityCollection, creditFacility);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CreditFacility to an array that doesn't contain it", () => {
        const creditFacility: ICreditFacility = sampleWithRequiredData;
        const creditFacilityCollection: ICreditFacility[] = [sampleWithPartialData];
        expectedResult = service.addCreditFacilityToCollectionIfMissing(creditFacilityCollection, creditFacility);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditFacility);
      });

      it('should add only unique CreditFacility to an array', () => {
        const creditFacilityArray: ICreditFacility[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const creditFacilityCollection: ICreditFacility[] = [sampleWithRequiredData];
        expectedResult = service.addCreditFacilityToCollectionIfMissing(creditFacilityCollection, ...creditFacilityArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const creditFacility: ICreditFacility = sampleWithRequiredData;
        const creditFacility2: ICreditFacility = sampleWithPartialData;
        expectedResult = service.addCreditFacilityToCollectionIfMissing([], creditFacility, creditFacility2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditFacility);
        expect(expectedResult).toContain(creditFacility2);
      });

      it('should accept null and undefined values', () => {
        const creditFacility: ICreditFacility = sampleWithRequiredData;
        expectedResult = service.addCreditFacilityToCollectionIfMissing([], null, creditFacility, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditFacility);
      });

      it('should return initial array if no CreditFacility is added', () => {
        const creditFacilityCollection: ICreditFacility[] = [sampleWithRequiredData];
        expectedResult = service.addCreditFacilityToCollectionIfMissing(creditFacilityCollection, undefined, null);
        expect(expectedResult).toEqual(creditFacilityCollection);
      });
    });

    describe('compareCreditFacility', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCreditFacility(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCreditFacility(entity1, entity2);
        const compareResult2 = service.compareCreditFacility(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCreditFacility(entity1, entity2);
        const compareResult2 = service.compareCreditFacility(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCreditFacility(entity1, entity2);
        const compareResult2 = service.compareCreditFacility(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
