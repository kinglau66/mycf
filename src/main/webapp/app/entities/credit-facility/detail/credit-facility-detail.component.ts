import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditFacility } from '../credit-facility.model';

@Component({
  selector: 'jhi-credit-facility-detail',
  templateUrl: './credit-facility-detail.component.html',
})
export class CreditFacilityDetailComponent implements OnInit {
  creditFacility: ICreditFacility | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditFacility }) => {
      this.creditFacility = creditFacility;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
