import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../credit-facility.test-samples';

import { CreditFacilityFormService } from './credit-facility-form.service';

describe('CreditFacility Form Service', () => {
  let service: CreditFacilityFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreditFacilityFormService);
  });

  describe('Service methods', () => {
    describe('createCreditFacilityFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCreditFacilityFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalLimit: expect.any(Object),
            currency: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
          })
        );
      });

      it('passing ICreditFacility should create a new form with FormGroup', () => {
        const formGroup = service.createCreditFacilityFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            totalLimit: expect.any(Object),
            currency: expect.any(Object),
            startDate: expect.any(Object),
            endDate: expect.any(Object),
          })
        );
      });
    });

    describe('getCreditFacility', () => {
      it('should return NewCreditFacility for default CreditFacility initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCreditFacilityFormGroup(sampleWithNewData);

        const creditFacility = service.getCreditFacility(formGroup) as any;

        expect(creditFacility).toMatchObject(sampleWithNewData);
      });

      it('should return NewCreditFacility for empty CreditFacility initial value', () => {
        const formGroup = service.createCreditFacilityFormGroup();

        const creditFacility = service.getCreditFacility(formGroup) as any;

        expect(creditFacility).toMatchObject({});
      });

      it('should return ICreditFacility', () => {
        const formGroup = service.createCreditFacilityFormGroup(sampleWithRequiredData);

        const creditFacility = service.getCreditFacility(formGroup) as any;

        expect(creditFacility).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICreditFacility should not enable id FormControl', () => {
        const formGroup = service.createCreditFacilityFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCreditFacility should disable id FormControl', () => {
        const formGroup = service.createCreditFacilityFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
