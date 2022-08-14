import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoanRequirementDetailComponent } from './loan-requirement-detail.component';

describe('LoanRequirement Management Detail Component', () => {
  let comp: LoanRequirementDetailComponent;
  let fixture: ComponentFixture<LoanRequirementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoanRequirementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ loanRequirement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LoanRequirementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LoanRequirementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load loanRequirement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.loanRequirement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
