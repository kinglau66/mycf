import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IApplicant, NewApplicant } from '../applicant.model';

export type PartialUpdateApplicant = Partial<IApplicant> & Pick<IApplicant, 'id'>;

type RestOf<T extends IApplicant | NewApplicant> = Omit<T, 'createdDt'> & {
  createdDt?: string | null;
};

export type RestApplicant = RestOf<IApplicant>;

export type NewRestApplicant = RestOf<NewApplicant>;

export type PartialUpdateRestApplicant = RestOf<PartialUpdateApplicant>;

export type EntityResponseType = HttpResponse<IApplicant>;
export type EntityArrayResponseType = HttpResponse<IApplicant[]>;

@Injectable({ providedIn: 'root' })
export class ApplicantService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/applicants');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(applicant: NewApplicant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicant);
    return this.http
      .post<RestApplicant>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(applicant: IApplicant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicant);
    return this.http
      .put<RestApplicant>(`${this.resourceUrl}/${this.getApplicantIdentifier(applicant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(applicant: PartialUpdateApplicant): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(applicant);
    return this.http
      .patch<RestApplicant>(`${this.resourceUrl}/${this.getApplicantIdentifier(applicant)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestApplicant>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestApplicant[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getApplicantIdentifier(applicant: Pick<IApplicant, 'id'>): number {
    return applicant.id;
  }

  compareApplicant(o1: Pick<IApplicant, 'id'> | null, o2: Pick<IApplicant, 'id'> | null): boolean {
    return o1 && o2 ? this.getApplicantIdentifier(o1) === this.getApplicantIdentifier(o2) : o1 === o2;
  }

  addApplicantToCollectionIfMissing<Type extends Pick<IApplicant, 'id'>>(
    applicantCollection: Type[],
    ...applicantsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const applicants: Type[] = applicantsToCheck.filter(isPresent);
    if (applicants.length > 0) {
      const applicantCollectionIdentifiers = applicantCollection.map(applicantItem => this.getApplicantIdentifier(applicantItem)!);
      const applicantsToAdd = applicants.filter(applicantItem => {
        const applicantIdentifier = this.getApplicantIdentifier(applicantItem);
        if (applicantCollectionIdentifiers.includes(applicantIdentifier)) {
          return false;
        }
        applicantCollectionIdentifiers.push(applicantIdentifier);
        return true;
      });
      return [...applicantsToAdd, ...applicantCollection];
    }
    return applicantCollection;
  }

  protected convertDateFromClient<T extends IApplicant | NewApplicant | PartialUpdateApplicant>(applicant: T): RestOf<T> {
    return {
      ...applicant,
      createdDt: applicant.createdDt?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restApplicant: RestApplicant): IApplicant {
    return {
      ...restApplicant,
      createdDt: restApplicant.createdDt ? dayjs(restApplicant.createdDt) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestApplicant>): HttpResponse<IApplicant> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestApplicant[]>): HttpResponse<IApplicant[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
