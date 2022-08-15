import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICreditFacility } from '../credit-facility.model';
import { CreditFacilityService } from '../service/credit-facility.service';

@Injectable({ providedIn: 'root' })
export class CreditFacilityRoutingResolveService implements Resolve<ICreditFacility | null> {
  constructor(protected service: CreditFacilityService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditFacility | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditFacility: HttpResponse<ICreditFacility>) => {
          if (creditFacility.body) {
            return of(creditFacility.body);
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
