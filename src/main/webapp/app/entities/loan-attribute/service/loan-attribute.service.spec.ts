import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILoanAttribute } from '../loan-attribute.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../loan-attribute.test-samples';

import { LoanAttributeService } from './loan-attribute.service';

const requireRestSample: ILoanAttribute = {
  ...sampleWithRequiredData,
};

describe('LoanAttribute Service', () => {
  let service: LoanAttributeService;
  let httpMock: HttpTestingController;
  let expectedResult: ILoanAttribute | ILoanAttribute[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LoanAttributeService);
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

    it('should create a LoanAttribute', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const loanAttribute = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(loanAttribute).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LoanAttribute', () => {
      const loanAttribute = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(loanAttribute).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LoanAttribute', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LoanAttribute', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LoanAttribute', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLoanAttributeToCollectionIfMissing', () => {
      it('should add a LoanAttribute to an empty array', () => {
        const loanAttribute: ILoanAttribute = sampleWithRequiredData;
        expectedResult = service.addLoanAttributeToCollectionIfMissing([], loanAttribute);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loanAttribute);
      });

      it('should not add a LoanAttribute to an array that contains it', () => {
        const loanAttribute: ILoanAttribute = sampleWithRequiredData;
        const loanAttributeCollection: ILoanAttribute[] = [
          {
            ...loanAttribute,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLoanAttributeToCollectionIfMissing(loanAttributeCollection, loanAttribute);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LoanAttribute to an array that doesn't contain it", () => {
        const loanAttribute: ILoanAttribute = sampleWithRequiredData;
        const loanAttributeCollection: ILoanAttribute[] = [sampleWithPartialData];
        expectedResult = service.addLoanAttributeToCollectionIfMissing(loanAttributeCollection, loanAttribute);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loanAttribute);
      });

      it('should add only unique LoanAttribute to an array', () => {
        const loanAttributeArray: ILoanAttribute[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const loanAttributeCollection: ILoanAttribute[] = [sampleWithRequiredData];
        expectedResult = service.addLoanAttributeToCollectionIfMissing(loanAttributeCollection, ...loanAttributeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const loanAttribute: ILoanAttribute = sampleWithRequiredData;
        const loanAttribute2: ILoanAttribute = sampleWithPartialData;
        expectedResult = service.addLoanAttributeToCollectionIfMissing([], loanAttribute, loanAttribute2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loanAttribute);
        expect(expectedResult).toContain(loanAttribute2);
      });

      it('should accept null and undefined values', () => {
        const loanAttribute: ILoanAttribute = sampleWithRequiredData;
        expectedResult = service.addLoanAttributeToCollectionIfMissing([], null, loanAttribute, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loanAttribute);
      });

      it('should return initial array if no LoanAttribute is added', () => {
        const loanAttributeCollection: ILoanAttribute[] = [sampleWithRequiredData];
        expectedResult = service.addLoanAttributeToCollectionIfMissing(loanAttributeCollection, undefined, null);
        expect(expectedResult).toEqual(loanAttributeCollection);
      });
    });

    describe('compareLoanAttribute', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLoanAttribute(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLoanAttribute(entity1, entity2);
        const compareResult2 = service.compareLoanAttribute(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLoanAttribute(entity1, entity2);
        const compareResult2 = service.compareLoanAttribute(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLoanAttribute(entity1, entity2);
        const compareResult2 = service.compareLoanAttribute(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
