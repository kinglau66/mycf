import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreditLimitDetailComponent } from './credit-limit-detail.component';

describe('CreditLimit Management Detail Component', () => {
  let comp: CreditLimitDetailComponent;
  let fixture: ComponentFixture<CreditLimitDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreditLimitDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ creditLimit: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CreditLimitDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CreditLimitDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load creditLimit on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.creditLimit).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
