import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILoan } from '../loan.model';
import { LoanService } from '../service/loan.service';

@Injectable({ providedIn: 'root' })
export class LoanRoutingResolveService implements Resolve<ILoan | null> {
  constructor(protected service: LoanService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILoan | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((loan: HttpResponse<ILoan>) => {
          if (loan.body) {
            return of(loan.body);
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
