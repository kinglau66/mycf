import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreditFacilityFormService } from './credit-facility-form.service';
import { CreditFacilityService } from '../service/credit-facility.service';
import { ICreditFacility } from '../credit-facility.model';

import { CreditFacilityUpdateComponent } from './credit-facility-update.component';

describe('CreditFacility Management Update Component', () => {
  let comp: CreditFacilityUpdateComponent;
  let fixture: ComponentFixture<CreditFacilityUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let creditFacilityFormService: CreditFacilityFormService;
  let creditFacilityService: CreditFacilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreditFacilityUpdateComponent],
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
      .overrideTemplate(CreditFacilityUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditFacilityUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    creditFacilityFormService = TestBed.inject(CreditFacilityFormService);
    creditFacilityService = TestBed.inject(CreditFacilityService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const creditFacility: ICreditFacility = { id: 456 };

      activatedRoute.data = of({ creditFacility });
      comp.ngOnInit();

      expect(comp.creditFacility).toEqual(creditFacility);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditFacility>>();
      const creditFacility = { id: 123 };
      jest.spyOn(creditFacilityFormService, 'getCreditFacility').mockReturnValue(creditFacility);
      jest.spyOn(creditFacilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditFacility });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditFacility }));
      saveSubject.complete();

      // THEN
      expect(creditFacilityFormService.getCreditFacility).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(creditFacilityService.update).toHaveBeenCalledWith(expect.objectContaining(creditFacility));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditFacility>>();
      const creditFacility = { id: 123 };
      jest.spyOn(creditFacilityFormService, 'getCreditFacility').mockReturnValue({ id: null });
      jest.spyOn(creditFacilityService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditFacility: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: creditFacility }));
      saveSubject.complete();

      // THEN
      expect(creditFacilityFormService.getCreditFacility).toHaveBeenCalled();
      expect(creditFacilityService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICreditFacility>>();
      const creditFacility = { id: 123 };
      jest.spyOn(creditFacilityService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ creditFacility });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(creditFacilityService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
