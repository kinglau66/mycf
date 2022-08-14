import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LoanAttributeFormService } from './loan-attribute-form.service';
import { LoanAttributeService } from '../service/loan-attribute.service';
import { ILoanAttribute } from '../loan-attribute.model';

import { LoanAttributeUpdateComponent } from './loan-attribute-update.component';

describe('LoanAttribute Management Update Component', () => {
  let comp: LoanAttributeUpdateComponent;
  let fixture: ComponentFixture<LoanAttributeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let loanAttributeFormService: LoanAttributeFormService;
  let loanAttributeService: LoanAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LoanAttributeUpdateComponent],
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
      .overrideTemplate(LoanAttributeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoanAttributeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    loanAttributeFormService = TestBed.inject(LoanAttributeFormService);
    loanAttributeService = TestBed.inject(LoanAttributeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const loanAttribute: ILoanAttribute = { id: 456 };

      activatedRoute.data = of({ loanAttribute });
      comp.ngOnInit();

      expect(comp.loanAttribute).toEqual(loanAttribute);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoanAttribute>>();
      const loanAttribute = { id: 123 };
      jest.spyOn(loanAttributeFormService, 'getLoanAttribute').mockReturnValue(loanAttribute);
      jest.spyOn(loanAttributeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loanAttribute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loanAttribute }));
      saveSubject.complete();

      // THEN
      expect(loanAttributeFormService.getLoanAttribute).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(loanAttributeService.update).toHaveBeenCalledWith(expect.objectContaining(loanAttribute));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoanAttribute>>();
      const loanAttribute = { id: 123 };
      jest.spyOn(loanAttributeFormService, 'getLoanAttribute').mockReturnValue({ id: null });
      jest.spyOn(loanAttributeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loanAttribute: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: loanAttribute }));
      saveSubject.complete();

      // THEN
      expect(loanAttributeFormService.getLoanAttribute).toHaveBeenCalled();
      expect(loanAttributeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILoanAttribute>>();
      const loanAttribute = { id: 123 };
      jest.spyOn(loanAttributeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ loanAttribute });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(loanAttributeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
