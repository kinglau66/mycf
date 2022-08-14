import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LoanRequirementFormService } from './loan-requirement-form.service';
import { LoanRequirementService } from '../service/loan-requirement.service';
import { ILoanRequirement } from '../loan-requirement.model';

import { LoanRequirementUpdateComponent } from './loan-requirement-update.component';

describe('LoanRequirement Management Update Component', () => {
  let comp: LoanRequirementUpdateComponent;
  let fixture: ComponentFixture<LoanRequirementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loanRequirementFormService: LoanRequirementFormService;
  let loanRequirementService: LoanRequirementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LoanRequirementUpdateComponent],
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
      .overrideTemplate(LoanRequirementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoanRequirementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loanRequirementFormService = TestBed.inject(LoanRequirementFormService);
    loanRequirementService = TestBed.inject(LoanRequirementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const loanRequirement: ILoanRequirement = { id: 456 };

      activatedRoute.data = of({ loanRequirement });
      comp.ngOnInit();

      expect(comp.loanRequirement).toEqual(loanRequirement);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoanRequirement>>();
      const loanRequirement = { id: 123 };
      jest.spyOn(loanRequirementFormService, 'getLoanRequirement').mockReturnValue(loanRequirement);
      jest.spyOn(loanRequirementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loanRequirement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loanRequirement }));
      saveSubject.complete();

      // THEN
      expect(loanRequirementFormService.getLoanRequirement).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(loanRequirementService.update).toHaveBeenCalledWith(expect.objectContaining(loanRequirement));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoanRequirement>>();
      const loanRequirement = { id: 123 };
      jest.spyOn(loanRequirementFormService, 'getLoanRequirement').mockReturnValue({ id: null });
      jest.spyOn(loanRequirementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loanRequirement: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loanRequirement }));
      saveSubject.complete();

      // THEN
      expect(loanRequirementFormService.getLoanRequirement).toHaveBeenCalled();
      expect(loanRequirementService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoanRequirement>>();
      const loanRequirement = { id: 123 };
      jest.spyOn(loanRequirementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loanRequirement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loanRequirementService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
