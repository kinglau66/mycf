import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreditFacilityDetailComponent } from './credit-facility-detail.component';

describe('CreditFacility Management Detail Component', () => {
  let comp: CreditFacilityDetailComponent;
  let fixture: ComponentFixture<CreditFacilityDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditFacilityDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ creditFacility: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CreditFacilityDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CreditFacilityDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load creditFacility on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.creditFacility).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
