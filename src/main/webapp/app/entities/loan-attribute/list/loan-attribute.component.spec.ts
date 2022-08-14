import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LoanAttributeService } from '../service/loan-attribute.service';

import { LoanAttributeComponent } from './loan-attribute.component';

describe('LoanAttribute Management Component', () => {
  let comp: LoanAttributeComponent;
  let fixture: ComponentFixture<LoanAttributeComponent>;
  let service: LoanAttributeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'loan-attribute', component: LoanAttributeComponent }]), HttpClientTestingModule],
      declarations: [LoanAttributeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(LoanAttributeComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LoanAttributeComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LoanAttributeService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.loanAttributes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to loanAttributeService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLoanAttributeIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLoanAttributeIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
