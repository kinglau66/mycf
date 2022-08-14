import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../loan-attribute.test-samples';

import { LoanAttributeFormService } from './loan-attribute-form.service';

describe('LoanAttribute Form Service', () => {
  let service: LoanAttributeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoanAttributeFormService);
  });

  describe('Service methods', () => {
    describe('createLoanAttributeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLoanAttributeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            jobTitle: expect.any(Object),
            minSalary: expect.any(Object),
            maxSalary: expect.any(Object),
          })
        );
      });

      it('passing ILoanAttribute should create a new form with FormGroup', () => {
        const formGroup = service.createLoanAttributeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            jobTitle: expect.any(Object),
            minSalary: expect.any(Object),
            maxSalary: expect.any(Object),
          })
        );
      });
    });

    describe('getLoanAttribute', () => {
      it('should return NewLoanAttribute for default LoanAttribute initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLoanAttributeFormGroup(sampleWithNewData);

        const loanAttribute = service.getLoanAttribute(formGroup) as any;

        expect(loanAttribute).toMatchObject(sampleWithNewData);
      });

      it('should return NewLoanAttribute for empty LoanAttribute initial value', () => {
        const formGroup = service.createLoanAttributeFormGroup();

        const loanAttribute = service.getLoanAttribute(formGroup) as any;

        expect(loanAttribute).toMatchObject({});
      });

      it('should return ILoanAttribute', () => {
        const formGroup = service.createLoanAttributeFormGroup(sampleWithRequiredData);

        const loanAttribute = service.getLoanAttribute(formGroup) as any;

        expect(loanAttribute).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILoanAttribute should not enable id FormControl', () => {
        const formGroup = service.createLoanAttributeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLoanAttribute should disable id FormControl', () => {
        const formGroup = service.createLoanAttributeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
