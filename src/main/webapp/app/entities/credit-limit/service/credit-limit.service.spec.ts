import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICreditLimit } from '../credit-limit.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../credit-limit.test-samples';

import { CreditLimitService } from './credit-limit.service';

const requireRestSample: ICreditLimit = {
  ...sampleWithRequiredData,
};

describe('CreditLimit Service', () => {
  let service: CreditLimitService;
  let httpMock: HttpTestingController;
  let expectedResult: ICreditLimit | ICreditLimit[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreditLimitService);
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

    it('should create a CreditLimit', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const creditLimit = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(creditLimit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CreditLimit', () => {
      const creditLimit = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(creditLimit).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CreditLimit', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CreditLimit', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CreditLimit', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCreditLimitToCollectionIfMissing', () => {
      it('should add a CreditLimit to an empty array', () => {
        const creditLimit: ICreditLimit = sampleWithRequiredData;
        expectedResult = service.addCreditLimitToCollectionIfMissing([], creditLimit);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditLimit);
      });

      it('should not add a CreditLimit to an array that contains it', () => {
        const creditLimit: ICreditLimit = sampleWithRequiredData;
        const creditLimitCollection: ICreditLimit[] = [
          {
            ...creditLimit,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCreditLimitToCollectionIfMissing(creditLimitCollection, creditLimit);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CreditLimit to an array that doesn't contain it", () => {
        const creditLimit: ICreditLimit = sampleWithRequiredData;
        const creditLimitCollection: ICreditLimit[] = [sampleWithPartialData];
        expectedResult = service.addCreditLimitToCollectionIfMissing(creditLimitCollection, creditLimit);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditLimit);
      });

      it('should add only unique CreditLimit to an array', () => {
        const creditLimitArray: ICreditLimit[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const creditLimitCollection: ICreditLimit[] = [sampleWithRequiredData];
        expectedResult = service.addCreditLimitToCollectionIfMissing(creditLimitCollection, ...creditLimitArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const creditLimit: ICreditLimit = sampleWithRequiredData;
        const creditLimit2: ICreditLimit = sampleWithPartialData;
        expectedResult = service.addCreditLimitToCollectionIfMissing([], creditLimit, creditLimit2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(creditLimit);
        expect(expectedResult).toContain(creditLimit2);
      });

      it('should accept null and undefined values', () => {
        const creditLimit: ICreditLimit = sampleWithRequiredData;
        expectedResult = service.addCreditLimitToCollectionIfMissing([], null, creditLimit, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(creditLimit);
      });

      it('should return initial array if no CreditLimit is added', () => {
        const creditLimitCollection: ICreditLimit[] = [sampleWithRequiredData];
        expectedResult = service.addCreditLimitToCollectionIfMissing(creditLimitCollection, undefined, null);
        expect(expectedResult).toEqual(creditLimitCollection);
      });
    });

    describe('compareCreditLimit', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCreditLimit(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCreditLimit(entity1, entity2);
        const compareResult2 = service.compareCreditLimit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCreditLimit(entity1, entity2);
        const compareResult2 = service.compareCreditLimit(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCreditLimit(entity1, entity2);
        const compareResult2 = service.compareCreditLimit(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
