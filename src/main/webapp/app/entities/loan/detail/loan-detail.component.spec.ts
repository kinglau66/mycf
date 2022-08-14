import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoanDetailComponent } from './loan-detail.component';

describe('Loan Management Detail Component', () => {
  let comp: LoanDetailComponent;
  let fixture: ComponentFixture<LoanDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ loan: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LoanDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LoanDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load loan on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.loan).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
