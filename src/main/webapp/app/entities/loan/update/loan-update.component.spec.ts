import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LoanFormService } from './loan-form.service';
import { LoanService } from '../service/loan.service';
import { ILoan } from '../loan.model';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ApplicantService } from 'app/entities/applicant/service/applicant.service';
import { ICreditFacility } from 'app/entities/credit-facility/credit-facility.model';
import { CreditFacilityService } from 'app/entities/credit-facility/service/credit-facility.service';

import { LoanUpdateComponent } from './loan-update.component';

describe('Loan Management Update Component', () => {
  let comp: LoanUpdateComponent;
  let fixture: ComponentFixture<LoanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loanFormService: LoanFormService;
  let loanService: LoanService;
  let applicantService: ApplicantService;
  let creditFacilityService: CreditFacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LoanUpdateComponent],
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
      .overrideTemplate(LoanUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoanUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loanFormService = TestBed.inject(LoanFormService);
    loanService = TestBed.inject(LoanService);
    applicantService = TestBed.inject(ApplicantService);
    creditFacilityService = TestBed.inject(CreditFacilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Applicant query and add missing value', () => {
      const loan: ILoan = { id: 456 };
      const applicant: IApplicant = { id: 30494 };
      loan.applicant = applicant;

      const applicantCollection: IApplicant[] = [{ id: 74174 }];
      jest.spyOn(applicantService, 'query').mockReturnValue(of(new HttpResponse({ body: applicantCollection })));
      const additionalApplicants = [applicant];
      const expectedCollection: IApplicant[] = [...additionalApplicants, ...applicantCollection];
      jest.spyOn(applicantService, 'addApplicantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      expect(applicantService.query).toHaveBeenCalled();
      expect(applicantService.addApplicantToCollectionIfMissing).toHaveBeenCalledWith(
        applicantCollection,
        ...additionalApplicants.map(expect.objectContaining)
      );
      expect(comp.applicantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call CreditFacility query and add missing value', () => {
      const loan: ILoan = { id: 456 };
      const creditFacility: ICreditFacility = { id: 27971 };
      loan.creditFacility = creditFacility;

      const creditFacilityCollection: ICreditFacility[] = [{ id: 67834 }];
      jest.spyOn(creditFacilityService, 'query').mockReturnValue(of(new HttpResponse({ body: creditFacilityCollection })));
      const additionalCreditFacilities = [creditFacility];
      const expectedCollection: ICreditFacility[] = [...additionalCreditFacilities, ...creditFacilityCollection];
      jest.spyOn(creditFacilityService, 'addCreditFacilityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      expect(creditFacilityService.query).toHaveBeenCalled();
      expect(creditFacilityService.addCreditFacilityToCollectionIfMissing).toHaveBeenCalledWith(
        creditFacilityCollection,
        ...additionalCreditFacilities.map(expect.objectContaining)
      );
      expect(comp.creditFacilitiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const loan: ILoan = { id: 456 };
      const applicant: IApplicant = { id: 39198 };
      loan.applicant = applicant;
      const creditFacility: ICreditFacility = { id: 86705 };
      loan.creditFacility = creditFacility;

      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      expect(comp.applicantsSharedCollection).toContain(applicant);
      expect(comp.creditFacilitiesSharedCollection).toContain(creditFacility);
      expect(comp.loan).toEqual(loan);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoan>>();
      const loan = { id: 123 };
      jest.spyOn(loanFormService, 'getLoan').mockReturnValue(loan);
      jest.spyOn(loanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loan }));
      saveSubject.complete();

      // THEN
      expect(loanFormService.getLoan).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(loanService.update).toHaveBeenCalledWith(expect.objectContaining(loan));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoan>>();
      const loan = { id: 123 };
      jest.spyOn(loanFormService, 'getLoan').mockReturnValue({ id: null });
      jest.spyOn(loanService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loan: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loan }));
      saveSubject.complete();

      // THEN
      expect(loanFormService.getLoan).toHaveBeenCalled();
      expect(loanService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoan>>();
      const loan = { id: 123 };
      jest.spyOn(loanService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loanService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareApplicant', () => {
      it('Should forward to applicantService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicantService, 'compareApplicant');
        comp.compareApplicant(entity, entity2);
        expect(applicantService.compareApplicant).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
