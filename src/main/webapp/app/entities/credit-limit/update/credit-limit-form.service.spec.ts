import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../credit-limit.test-samples';

import { CreditLimitFormService } from './credit-limit-form.service';

describe('CreditLimit Form Service', () => {
  let service: CreditLimitFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditLimitFormService);
  });

  describe('Service methods', () => {
    describe('createCreditLimitFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCreditLimitFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            totalLimit: expect.any(Object),
            creditFacility: expect.any(Object),
          })
        );
      });

      it('passing ICreditLimit should create a new form with FormGroup', () => {
        const formGroup = service.createCreditLimitFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            type: expect.any(Object),
            totalLimit: expect.any(Object),
            creditFacility: expect.any(Object),
          })
        );
      });
    });

    describe('getCreditLimit', () => {
      it('should return NewCreditLimit for default CreditLimit initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCreditLimitFormGroup(sampleWithNewData);

        const creditLimit = service.getCreditLimit(formGroup) as any;

        expect(creditLimit).toMatchObject(sampleWithNewData);
      });

      it('should return NewCreditLimit for empty CreditLimit initial value', () => {
        const formGroup = service.createCreditLimitFormGroup();

        const creditLimit = service.getCreditLimit(formGroup) as any;

        expect(creditLimit).toMatchObject({});
      });

      it('should return ICreditLimit', () => {
        const formGroup = service.createCreditLimitFormGroup(sampleWithRequiredData);

        const creditLimit = service.getCreditLimit(formGroup) as any;

        expect(creditLimit).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICreditLimit should not enable id FormControl', () => {
        const formGroup = service.createCreditLimitFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCreditLimit should disable id FormControl', () => {
        const formGroup = service.createCreditLimitFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
