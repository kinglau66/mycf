import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILoan, NewLoan } from '../loan.model';

export type PartialUpdateLoan = Partial<ILoan> & Pick<ILoan, 'id'>;

export type EntityResponseType = HttpResponse<ILoan>;
export type EntityArrayResponseType = HttpResponse<ILoan[]>;

@Injectable({ providedIn: 'root' })
export class LoanService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loans');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loan: NewLoan): Observable<EntityResponseType> {
    return this.http.post<ILoan>(this.resourceUrl, loan, { observe: 'response' });
  }

  update(loan: ILoan): Observable<EntityResponseType> {
    return this.http.put<ILoan>(`${this.resourceUrl}/${this.getLoanIdentifier(loan)}`, loan, { observe: 'response' });
  }

  partialUpdate(loan: PartialUpdateLoan): Observable<EntityResponseType> {
    return this.http.patch<ILoan>(`${this.resourceUrl}/${this.getLoanIdentifier(loan)}`, loan, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILoan>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILoan[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLoanIdentifier(loan: Pick<ILoan, 'id'>): number {
    return loan.id;
  }

  compareLoan(o1: Pick<ILoan, 'id'> | null, o2: Pick<ILoan, 'id'> | null): boolean {
    return o1 && o2 ? this.getLoanIdentifier(o1) === this.getLoanIdentifier(o2) : o1 === o2;
  }

  addLoanToCollectionIfMissing<Type extends Pick<ILoan, 'id'>>(
    loanCollection: Type[],
    ...loansToCheck: (Type | null | undefined)[]
  ): Type[] {
    const loans: Type[] = loansToCheck.filter(isPresent);
    if (loans.length > 0) {
      const loanCollectionIdentifiers = loanCollection.map(loanItem => this.getLoanIdentifier(loanItem)!);
      const loansToAdd = loans.filter(loanItem => {
        const loanIdentifier = this.getLoanIdentifier(loanItem);
        if (loanCollectionIdentifiers.includes(loanIdentifier)) {
          return false;
        }
        loanCollectionIdentifiers.push(loanIdentifier);
        return true;
      });
      return [...loansToAdd, ...loanCollection];
    }
    return loanCollection;
  }
}
