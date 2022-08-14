import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoanAttribute } from '../loan-attribute.model';
import { LoanAttributeService } from '../service/loan-attribute.service';

@Injectable({ providedIn: 'root' })
export class LoanAttributeRoutingResolveService implements Resolve<ILoanAttribute | null> {
  constructor(protected service: LoanAttributeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoanAttribute | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loanAttribute: HttpResponse<ILoanAttribute>) => {
          if (loanAttribute.body) {
            return of(loanAttribute.body);
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
