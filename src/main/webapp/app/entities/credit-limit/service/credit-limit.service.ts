import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICreditLimit, NewCreditLimit } from '../credit-limit.model';

export type PartialUpdateCreditLimit = Partial<ICreditLimit> & Pick<ICreditLimit, 'id'>;

export type EntityResponseType = HttpResponse<ICreditLimit>;
export type EntityArrayResponseType = HttpResponse<ICreditLimit[]>;

@Injectable({ providedIn: 'root' })
export class CreditLimitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/credit-limits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(creditLimit: NewCreditLimit): Observable<EntityResponseType> {
    return this.http.post<ICreditLimit>(this.resourceUrl, creditLimit, { observe: 'response' });
  }

  update(creditLimit: ICreditLimit): Observable<EntityResponseType> {
    return this.http.put<ICreditLimit>(`${this.resourceUrl}/${this.getCreditLimitIdentifier(creditLimit)}`, creditLimit, {
      observe: 'response',
    });
  }

  partialUpdate(creditLimit: PartialUpdateCreditLimit): Observable<EntityResponseType> {
    return this.http.patch<ICreditLimit>(`${this.resourceUrl}/${this.getCreditLimitIdentifier(creditLimit)}`, creditLimit, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICreditLimit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICreditLimit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCreditLimitIdentifier(creditLimit: Pick<ICreditLimit, 'id'>): number {
    return creditLimit.id;
  }

  compareCreditLimit(o1: Pick<ICreditLimit, 'id'> | null, o2: Pick<ICreditLimit, 'id'> | null): boolean {
    return o1 && o2 ? this.getCreditLimitIdentifier(o1) === this.getCreditLimitIdentifier(o2) : o1 === o2;
  }

  addCreditLimitToCollectionIfMissing<Type extends Pick<ICreditLimit, 'id'>>(
    creditLimitCollection: Type[],
    ...creditLimitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const creditLimits: Type[] = creditLimitsToCheck.filter(isPresent);
    if (creditLimits.length > 0) {
      const creditLimitCollectionIdentifiers = creditLimitCollection.map(
        creditLimitItem => this.getCreditLimitIdentifier(creditLimitItem)!
      );
      const creditLimitsToAdd = creditLimits.filter(creditLimitItem => {
        const creditLimitIdentifier = this.getCreditLimitIdentifier(creditLimitItem);
        if (creditLimitCollectionIdentifiers.includes(creditLimitIdentifier)) {
          return false;
        }
        creditLimitCollectionIdentifiers.push(creditLimitIdentifier);
        return true;
      });
      return [...creditLimitsToAdd, ...creditLimitCollection];
    }
    return creditLimitCollection;
  }
}
