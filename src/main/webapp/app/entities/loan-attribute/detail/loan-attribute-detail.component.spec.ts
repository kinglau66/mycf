import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoanAttributeDetailComponent } from './loan-attribute-detail.component';

describe('LoanAttribute Management Detail Component', () => {
  let comp: LoanAttributeDetailComponent;
  let fixture: ComponentFixture<LoanAttributeDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanAttributeDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ loanAttribute: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LoanAttributeDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LoanAttributeDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load loanAttribute on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.loanAttribute).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
