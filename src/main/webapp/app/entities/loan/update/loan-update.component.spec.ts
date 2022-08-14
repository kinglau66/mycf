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
import { ILoanAttribute } from 'app/entities/loan-attribute/loan-attribute.model';
import { LoanAttributeService } from 'app/entities/loan-attribute/service/loan-attribute.service';
import { IApplicant } from 'app/entities/applicant/applicant.model';
import { ApplicantService } from 'app/entities/applicant/service/applicant.service';
import { ILoanRequirement } from 'app/entities/loan-requirement/loan-requirement.model';
import { LoanRequirementService } from 'app/entities/loan-requirement/service/loan-requirement.service';

import { LoanUpdateComponent } from './loan-update.component';

describe('Loan Management Update Component', () => {
  let comp: LoanUpdateComponent;
  let fixture: ComponentFixture<LoanUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loanFormService: LoanFormService;
  let loanService: LoanService;
  let loanAttributeService: LoanAttributeService;
  let applicantService: ApplicantService;
  let loanRequirementService: LoanRequirementService;

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
    loanAttributeService = TestBed.inject(LoanAttributeService);
    applicantService = TestBed.inject(ApplicantService);
    loanRequirementService = TestBed.inject(LoanRequirementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LoanAttribute query and add missing value', () => {
      const loan: ILoan = { id: 456 };
      const loanAttribute: ILoanAttribute = { id: 73826 };
      loan.loanAttribute = loanAttribute;

      const loanAttributeCollection: ILoanAttribute[] = [{ id: 73848 }];
      jest.spyOn(loanAttributeService, 'query').mockReturnValue(of(new HttpResponse({ body: loanAttributeCollection })));
      const additionalLoanAttributes = [loanAttribute];
      const expectedCollection: ILoanAttribute[] = [...additionalLoanAttributes, ...loanAttributeCollection];
      jest.spyOn(loanAttributeService, 'addLoanAttributeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      expect(loanAttributeService.query).toHaveBeenCalled();
      expect(loanAttributeService.addLoanAttributeToCollectionIfMissing).toHaveBeenCalledWith(
        loanAttributeCollection,
        ...additionalLoanAttributes.map(expect.objectContaining)
      );
      expect(comp.loanAttributesSharedCollection).toEqual(expectedCollection);
    });

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

    it('Should call LoanRequirement query and add missing value', () => {
      const loan: ILoan = { id: 456 };
      const loanRequirement: ILoanRequirement = { id: 4421 };
      loan.loanRequirement = loanRequirement;

      const loanRequirementCollection: ILoanRequirement[] = [{ id: 57602 }];
      jest.spyOn(loanRequirementService, 'query').mockReturnValue(of(new HttpResponse({ body: loanRequirementCollection })));
      const additionalLoanRequirements = [loanRequirement];
      const expectedCollection: ILoanRequirement[] = [...additionalLoanRequirements, ...loanRequirementCollection];
      jest.spyOn(loanRequirementService, 'addLoanRequirementToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      expect(loanRequirementService.query).toHaveBeenCalled();
      expect(loanRequirementService.addLoanRequirementToCollectionIfMissing).toHaveBeenCalledWith(
        loanRequirementCollection,
        ...additionalLoanRequirements.map(expect.objectContaining)
      );
      expect(comp.loanRequirementsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const loan: ILoan = { id: 456 };
      const loanAttribute: ILoanAttribute = { id: 88068 };
      loan.loanAttribute = loanAttribute;
      const applicant: IApplicant = { id: 39198 };
      loan.applicant = applicant;
      const loanRequirement: ILoanRequirement = { id: 272 };
      loan.loanRequirement = loanRequirement;

      activatedRoute.data = of({ loan });
      comp.ngOnInit();

      expect(comp.loanAttributesSharedCollection).toContain(loanAttribute);
      expect(comp.applicantsSharedCollection).toContain(applicant);
      expect(comp.loanRequirementsSharedCollection).toContain(loanRequirement);
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
    describe('compareLoanAttribute', () => {
      it('Should forward to loanAttributeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(loanAttributeService, 'compareLoanAttribute');
        comp.compareLoanAttribute(entity, entity2);
        expect(loanAttributeService.compareLoanAttribute).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareApplicant', () => {
      it('Should forward to applicantService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(applicantService, 'compareApplicant');
        comp.compareApplicant(entity, entity2);
        expect(applicantService.compareApplicant).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareLoanRequirement', () => {
      it('Should forward to loanRequirementService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(loanRequirementService, 'compareLoanRequirement');
        comp.compareLoanRequirement(entity, entity2);
        expect(loanRequirementService.compareLoanRequirement).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
