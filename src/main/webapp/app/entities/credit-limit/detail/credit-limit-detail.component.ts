import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICreditLimit } from '../credit-limit.model';

@Component({
  selector: 'jhi-credit-limit-detail',
  templateUrl: './credit-limit-detail.component.html',
})
export class CreditLimitDetailComponent implements OnInit {
  creditLimit: ICreditLimit | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ creditLimit }) => {
      this.creditLimit = creditLimit;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
