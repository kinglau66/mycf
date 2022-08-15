import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CreditLimitService } from '../service/credit-limit.service';

import { CreditLimitComponent } from './credit-limit.component';

describe('CreditLimit Management Component', () => {
  let comp: CreditLimitComponent;
  let fixture: ComponentFixture<CreditLimitComponent>;
  let service: CreditLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'credit-limit', component: CreditLimitComponent }]), HttpClientTestingModule],
      declarations: [CreditLimitComponent],
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
      .overrideTemplate(CreditLimitComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreditLimitComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CreditLimitService);

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
    expect(comp.creditLimits?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to creditLimitService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCreditLimitIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCreditLimitIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
