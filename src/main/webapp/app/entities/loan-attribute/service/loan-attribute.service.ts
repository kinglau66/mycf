import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILoanAttribute, NewLoanAttribute } from '../loan-attribute.model';

export type PartialUpdateLoanAttribute = Partial<ILoanAttribute> & Pick<ILoanAttribute, 'id'>;

export type EntityResponseType = HttpResponse<ILoanAttribute>;
export type EntityArrayResponseType = HttpResponse<ILoanAttribute[]>;

@Injectable({ providedIn: 'root' })
export class LoanAttributeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loan-attributes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loanAttribute: NewLoanAttribute): Observable<EntityResponseType> {
    return this.http.post<ILoanAttribute>(this.resourceUrl, loanAttribute, { observe: 'response' });
  }

  update(loanAttribute: ILoanAttribute): Observable<EntityResponseType> {
    return this.http.put<ILoanAttribute>(`${this.resourceUrl}/${this.getLoanAttributeIdentifier(loanAttribute)}`, loanAttribute, {
      observe: 'response',
    });
  }

  partialUpdate(loanAttribute: PartialUpdateLoanAttribute): Observable<EntityResponseType> {
    return this.http.patch<ILoanAttribute>(`${this.resourceUrl}/${this.getLoanAttributeIdentifier(loanAttribute)}`, loanAttribute, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILoanAttribute>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILoanAttribute[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLoanAttributeIdentifier(loanAttribute: Pick<ILoanAttribute, 'id'>): number {
    return loanAttribute.id;
  }

  compareLoanAttribute(o1: Pick<ILoanAttribute, 'id'> | null, o2: Pick<ILoanAttribute, 'id'> | null): boolean {
    return o1 && o2 ? this.getLoanAttributeIdentifier(o1) === this.getLoanAttributeIdentifier(o2) : o1 === o2;
  }

  addLoanAttributeToCollectionIfMissing<Type extends Pick<ILoanAttribute, 'id'>>(
    loanAttributeCollection: Type[],
    ...loanAttributesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const loanAttributes: Type[] = loanAttributesToCheck.filter(isPresent);
    if (loanAttributes.length > 0) {
      const loanAttributeCollectionIdentifiers = loanAttributeCollection.map(
        loanAttributeItem => this.getLoanAttributeIdentifier(loanAttributeItem)!
      );
      const loanAttributesToAdd = loanAttributes.filter(loanAttributeItem => {
        const loanAttributeIdentifier = this.getLoanAttributeIdentifier(loanAttributeItem);
        if (loanAttributeCollectionIdentifiers.includes(loanAttributeIdentifier)) {
          return false;
        }
        loanAttributeCollectionIdentifiers.push(loanAttributeIdentifier);
        return true;
      });
      return [...loanAttributesToAdd, ...loanAttributeCollection];
    }
    return loanAttributeCollection;
  }
}
