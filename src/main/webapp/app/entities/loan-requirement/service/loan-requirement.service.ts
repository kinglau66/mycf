import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILoanRequirement, NewLoanRequirement } from '../loan-requirement.model';

export type PartialUpdateLoanRequirement = Partial<ILoanRequirement> & Pick<ILoanRequirement, 'id'>;

type RestOf<T extends ILoanRequirement | NewLoanRequirement> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

export type RestLoanRequirement = RestOf<ILoanRequirement>;

export type NewRestLoanRequirement = RestOf<NewLoanRequirement>;

export type PartialUpdateRestLoanRequirement = RestOf<PartialUpdateLoanRequirement>;

export type EntityResponseType = HttpResponse<ILoanRequirement>;
export type EntityArrayResponseType = HttpResponse<ILoanRequirement[]>;

@Injectable({ providedIn: 'root' })
export class LoanRequirementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/loan-requirements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(loanRequirement: NewLoanRequirement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanRequirement);
    return this.http
      .post<RestLoanRequirement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(loanRequirement: ILoanRequirement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanRequirement);
    return this.http
      .put<RestLoanRequirement>(`${this.resourceUrl}/${this.getLoanRequirementIdentifier(loanRequirement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(loanRequirement: PartialUpdateLoanRequirement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(loanRequirement);
    return this.http
      .patch<RestLoanRequirement>(`${this.resourceUrl}/${this.getLoanRequirementIdentifier(loanRequirement)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestLoanRequirement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestLoanRequirement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLoanRequirementIdentifier(loanRequirement: Pick<ILoanRequirement, 'id'>): number {
    return loanRequirement.id;
  }

  compareLoanRequirement(o1: Pick<ILoanRequirement, 'id'> | null, o2: Pick<ILoanRequirement, 'id'> | null): boolean {
    return o1 && o2 ? this.getLoanRequirementIdentifier(o1) === this.getLoanRequirementIdentifier(o2) : o1 === o2;
  }

  addLoanRequirementToCollectionIfMissing<Type extends Pick<ILoanRequirement, 'id'>>(
    loanRequirementCollection: Type[],
    ...loanRequirementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const loanRequirements: Type[] = loanRequirementsToCheck.filter(isPresent);
    if (loanRequirements.length > 0) {
      const loanRequirementCollectionIdentifiers = loanRequirementCollection.map(
        loanRequirementItem => this.getLoanRequirementIdentifier(loanRequirementItem)!
      );
      const loanRequirementsToAdd = loanRequirements.filter(loanRequirementItem => {
        const loanRequirementIdentifier = this.getLoanRequirementIdentifier(loanRequirementItem);
        if (loanRequirementCollectionIdentifiers.includes(loanRequirementIdentifier)) {
          return false;
        }
        loanRequirementCollectionIdentifiers.push(loanRequirementIdentifier);
        return true;
      });
      return [...loanRequirementsToAdd, ...loanRequirementCollection];
    }
    return loanRequirementCollection;
  }

  protected convertDateFromClient<T extends ILoanRequirement | NewLoanRequirement | PartialUpdateLoanRequirement>(
    loanRequirement: T
  ): RestOf<T> {
    return {
      ...loanRequirement,
      startDate: loanRequirement.startDate?.toJSON() ?? null,
      endDate: loanRequirement.endDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restLoanRequirement: RestLoanRequirement): ILoanRequirement {
    return {
      ...restLoanRequirement,
      startDate: restLoanRequirement.startDate ? dayjs(restLoanRequirement.startDate) : undefined,
      endDate: restLoanRequirement.endDate ? dayjs(restLoanRequirement.endDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestLoanRequirement>): HttpResponse<ILoanRequirement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestLoanRequirement[]>): HttpResponse<ILoanRequirement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
