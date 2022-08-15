import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreditFacility, NewCreditFacility } from '../credit-facility.model';

export type PartialUpdateCreditFacility = Partial<ICreditFacility> & Pick<ICreditFacility, 'id'>;

type RestOf<T extends ICreditFacility | NewCreditFacility> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestCreditFacility = RestOf<ICreditFacility>;

export type NewRestCreditFacility = RestOf<NewCreditFacility>;

export type PartialUpdateRestCreditFacility = RestOf<PartialUpdateCreditFacility>;

export type EntityResponseType = HttpResponse<ICreditFacility>;
export type EntityArrayResponseType = HttpResponse<ICreditFacility[]>;

@Injectable({ providedIn: 'root' })
export class CreditFacilityService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-facilities');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(creditFacility: NewCreditFacility): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacility);
    return this.http
      .post<RestCreditFacility>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(creditFacility: ICreditFacility): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacility);
    return this.http
      .put<RestCreditFacility>(`${this.resourceUrl}/${this.getCreditFacilityIdentifier(creditFacility)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(creditFacility: PartialUpdateCreditFacility): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(creditFacility);
    return this.http
      .patch<RestCreditFacility>(`${this.resourceUrl}/${this.getCreditFacilityIdentifier(creditFacility)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestCreditFacility>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestCreditFacility[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCreditFacilityIdentifier(creditFacility: Pick<ICreditFacility, 'id'>): number {
    return creditFacility.id;
  }

  compareCreditFacility(o1: Pick<ICreditFacility, 'id'> | null, o2: Pick<ICreditFacility, 'id'> | null): boolean {
    return o1 && o2 ? this.getCreditFacilityIdentifier(o1) === this.getCreditFacilityIdentifier(o2) : o1 === o2;
  }

  addCreditFacilityToCollectionIfMissing<Type extends Pick<ICreditFacility, 'id'>>(
    creditFacilityCollection: Type[],
    ...creditFacilitiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const creditFacilities: Type[] = creditFacilitiesToCheck.filter(isPresent);
    if (creditFacilities.length > 0) {
      const creditFacilityCollectionIdentifiers = creditFacilityCollection.map(
        creditFacilityItem => this.getCreditFacilityIdentifier(creditFacilityItem)!
      );
      const creditFacilitiesToAdd = creditFacilities.filter(creditFacilityItem => {
        const creditFacilityIdentifier = this.getCreditFacilityIdentifier(creditFacilityItem);
        if (creditFacilityCollectionIdentifiers.includes(creditFacilityIdentifier)) {
          return false;
        }
        creditFacilityCollectionIdentifiers.push(creditFacilityIdentifier);
        return true;
      });
      return [...creditFacilitiesToAdd, ...creditFacilityCollection];
    }
    return creditFacilityCollection;
  }

  protected convertDateFromClient<T extends ICreditFacility | NewCreditFacility | PartialUpdateCreditFacility>(
    creditFacility: T
  ): RestOf<T> {
    return {
      ...creditFacility,
      startDate: creditFacility.startDate?.format(DATE_FORMAT) ?? null,
      endDate: creditFacility.endDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restCreditFacility: RestCreditFacility): ICreditFacility {
    return {
      ...restCreditFacility,
      startDate: restCreditFacility.startDate ? dayjs(restCreditFacility.startDate) : undefined,
      endDate: restCreditFacility.endDate ? dayjs(restCreditFacility.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestCreditFacility>): HttpResponse<ICreditFacility> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestCreditFacility[]>): HttpResponse<ICreditFacility[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
