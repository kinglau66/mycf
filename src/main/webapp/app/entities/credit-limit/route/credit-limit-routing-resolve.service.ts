import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreditLimit } from '../credit-limit.model';
import { CreditLimitService } from '../service/credit-limit.service';

@Injectable({ providedIn: 'root' })
export class CreditLimitRoutingResolveService implements Resolve<ICreditLimit | null> {
  constructor(protected service: CreditLimitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditLimit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditLimit: HttpResponse<ICreditLimit>) => {
          if (creditLimit.body) {
            return of(creditLimit.body);
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
