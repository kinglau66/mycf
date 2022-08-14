import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoanRequirement } from '../loan-requirement.model';
import { LoanRequirementService } from '../service/loan-requirement.service';

@Injectable({ providedIn: 'root' })
export class LoanRequirementRoutingResolveService implements Resolve<ILoanRequirement | null> {
  constructor(protected service: LoanRequirementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoanRequirement | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loanRequirement: HttpResponse<ILoanRequirement>) => {
          if (loanRequirement.body) {
            return of(loanRequirement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
