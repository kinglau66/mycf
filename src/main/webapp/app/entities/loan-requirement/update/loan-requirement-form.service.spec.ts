import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../loan-requirement.test-samples';

import { LoanRequirementFormService } from './loan-requirement-form.service';

describe('LoanRequirement Form Service', () => {
  let service: LoanRequirementFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanRequirementFormService);
  });

  describe('Service methods', () => {
    describe('createLoanRequirementFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLoanRequirementFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalLimit: expect.any(Object),
            currency: expect.any(Object),
            type: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
          })
        );
      });

      it('passing ILoanRequirement should create a new form with FormGroup', () => {
        const formGroup = service.createLoanRequirementFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalLimit: expect.any(Object),
            currency: expect.any(Object),
            type: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
          })
        );
      });
    });

    describe('getLoanRequirement', () => {
      it('should return NewLoanRequirement for default LoanRequirement initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLoanRequirementFormGroup(sampleWithNewData);

        const loanRequirement = service.getLoanRequirement(formGroup) as any;

        expect(loanRequirement).toMatchObject(sampleWithNewData);
      });

      it('should return NewLoanRequirement for empty LoanRequirement initial value', () => {
        const formGroup = service.createLoanRequirementFormGroup();

        const loanRequirement = service.getLoanRequirement(formGroup) as any;

        expect(loanRequirement).toMatchObject({});
      });

      it('should return ILoanRequirement', () => {
        const formGroup = service.createLoanRequirementFormGroup(sampleWithRequiredData);

        const loanRequirement = service.getLoanRequirement(formGroup) as any;

        expect(loanRequirement).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILoanRequirement should not enable id FormControl', () => {
        const formGroup = service.createLoanRequirementFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLoanRequirement should disable id FormControl', () => {
        const formGroup = service.createLoanRequirementFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
