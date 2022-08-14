import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoan } from '../loan.model';

@Component({
  selector: 'jhi-loan-detail',
  templateUrl: './loan-detail.component.html',
})
export class LoanDetailComponent implements OnInit {
  loan: ILoan | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loan }) => {
      this.loan = loan;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
