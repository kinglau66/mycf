import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILoanRequirement } from '../loan-requirement.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../loan-requirement.test-samples';

import { LoanRequirementService, RestLoanRequirement } from './loan-requirement.service';

const requireRestSample: RestLoanRequirement = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
  endDate: sampleWithRequiredData.endDate?.toJSON(),
};

describe('LoanRequirement Service', () => {
  let service: LoanRequirementService;
  let httpMock: HttpTestingController;
  let expectedResult: ILoanRequirement | ILoanRequirement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LoanRequirementService);
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

    it('should create a LoanRequirement', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const loanRequirement = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(loanRequirement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LoanRequirement', () => {
      const loanRequirement = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(loanRequirement).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LoanRequirement', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LoanRequirement', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LoanRequirement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLoanRequirementToCollectionIfMissing', () => {
      it('should add a LoanRequirement to an empty array', () => {
        const loanRequirement: ILoanRequirement = sampleWithRequiredData;
        expectedResult = service.addLoanRequirementToCollectionIfMissing([], loanRequirement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loanRequirement);
      });

      it('should not add a LoanRequirement to an array that contains it', () => {
        const loanRequirement: ILoanRequirement = sampleWithRequiredData;
        const loanRequirementCollection: ILoanRequirement[] = [
          {
            ...loanRequirement,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLoanRequirementToCollectionIfMissing(loanRequirementCollection, loanRequirement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LoanRequirement to an array that doesn't contain it", () => {
        const loanRequirement: ILoanRequirement = sampleWithRequiredData;
        const loanRequirementCollection: ILoanRequirement[] = [sampleWithPartialData];
        expectedResult = service.addLoanRequirementToCollectionIfMissing(loanRequirementCollection, loanRequirement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loanRequirement);
      });

      it('should add only unique LoanRequirement to an array', () => {
        const loanRequirementArray: ILoanRequirement[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const loanRequirementCollection: ILoanRequirement[] = [sampleWithRequiredData];
        expectedResult = service.addLoanRequirementToCollectionIfMissing(loanRequirementCollection, ...loanRequirementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const loanRequirement: ILoanRequirement = sampleWithRequiredData;
        const loanRequirement2: ILoanRequirement = sampleWithPartialData;
        expectedResult = service.addLoanRequirementToCollectionIfMissing([], loanRequirement, loanRequirement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(loanRequirement);
        expect(expectedResult).toContain(loanRequirement2);
      });

      it('should accept null and undefined values', () => {
        const loanRequirement: ILoanRequirement = sampleWithRequiredData;
        expectedResult = service.addLoanRequirementToCollectionIfMissing([], null, loanRequirement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(loanRequirement);
      });

      it('should return initial array if no LoanRequirement is added', () => {
        const loanRequirementCollection: ILoanRequirement[] = [sampleWithRequiredData];
        expectedResult = service.addLoanRequirementToCollectionIfMissing(loanRequirementCollection, undefined, null);
        expect(expectedResult).toEqual(loanRequirementCollection);
      });
    });

    describe('compareLoanRequirement', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLoanRequirement(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLoanRequirement(entity1, entity2);
        const compareResult2 = service.compareLoanRequirement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLoanRequirement(entity1, entity2);
        const compareResult2 = service.compareLoanRequirement(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLoanRequirement(entity1, entity2);
        const compareResult2 = service.compareLoanRequirement(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
