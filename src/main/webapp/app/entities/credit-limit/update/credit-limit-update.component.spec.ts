import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreditLimitFormService } from './credit-limit-form.service';
import { CreditLimitService } from '../service/credit-limit.service';
import { ICreditLimit } from '../credit-limit.model';
import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';
import { CreditFacilityService } from 'app/entities/credit-facility/service/credit-facility.service';

import { CreditLimitUpdateComponent } from './credit-limit-update.component';

describe('CreditLimit Management Update Component', () => {
  let comp: CreditLimitUpdateComponent;
  let fixture: ComponentFixture<CreditLimitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditLimitFormService: CreditLimitFormService;
  let creditLimitService: CreditLimitService;
  let creditFacilityService: CreditFacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreditLimitUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CreditLimitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditLimitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditLimitFormService = TestBed.inject(CreditLimitFormService);
    creditLimitService = TestBed.inject(CreditLimitService);
    creditFacilityService = TestBed.inject(CreditFacilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call CreditFacility query and add missing value', () => {
      const creditLimit: ICreditLimit = { id: 456 };
      const creditFacility: ICreditFacility = { id: 56053 };
      creditLimit.creditFacility = creditFacility;

      const creditFacilityCollection: ICreditFacility[] = [{ id: 9468 }];
      jest.spyOn(creditFacilityService, 'query').mockReturnValue(of(new HttpResponse({ body: creditFacilityCollection })));
      const additionalCreditFacilities = [creditFacility];
      const expectedCollection: ICreditFacility[] = [...additionalCreditFacilities, ...creditFacilityCollection];
      jest.spyOn(creditFacilityService, 'addCreditFacilityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ creditLimit });
      comp.ngOnInit();

      expect(creditFacilityService.query).toHaveBeenCalled();
      expect(creditFacilityService.addCreditFacilityToCollectionIfMissing).toHaveBeenCalledWith(
        creditFacilityCollection,
        ...additionalCreditFacilities.map(expect.objectContaining)
      );
      expect(comp.creditFacilitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const creditLimit: ICreditLimit = { id: 456 };
      const creditFacility: ICreditFacility = { id: 50162 };
      creditLimit.creditFacility = creditFacility;

      activatedRoute.data = of({ creditLimit });
      comp.ngOnInit();

      expect(comp.creditFacilitiesSharedCollection).toContain(creditFacility);
      expect(comp.creditLimit).toEqual(creditLimit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditLimit>>();
      const creditLimit = { id: 123 };
      jest.spyOn(creditLimitFormService, 'getCreditLimit').mockReturnValue(creditLimit);
      jest.spyOn(creditLimitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditLimit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditLimit }));
      saveSubject.complete();

      // THEN
      expect(creditLimitFormService.getCreditLimit).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditLimitService.update).toHaveBeenCalledWith(expect.objectContaining(creditLimit));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditLimit>>();
      const creditLimit = { id: 123 };
      jest.spyOn(creditLimitFormService, 'getCreditLimit').mockReturnValue({ id: null });
      jest.spyOn(creditLimitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditLimit: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditLimit }));
      saveSubject.complete();

      // THEN
      expect(creditLimitFormService.getCreditLimit).toHaveBeenCalled();
      expect(creditLimitService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditLimit>>();
      const creditLimit = { id: 123 };
      jest.spyOn(creditLimitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditLimit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditLimitService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCreditFacility', () => {
      it('Should forward to creditFacilityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(creditFacilityService, 'compareCreditFacility');
        comp.compareCreditFacility(entity, entity2);
        expect(creditFacilityService.compareCreditFacility).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
