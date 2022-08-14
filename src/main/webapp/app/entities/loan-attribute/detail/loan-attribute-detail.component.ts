import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoanAttribute } from '../loan-attribute.model';

@Component({
  selector: 'jhi-loan-attribute-detail',
  templateUrl: './loan-attribute-detail.component.html',
})
export class LoanAttributeDetailComponent implements OnInit {
  loanAttribute: ILoanAttribute | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanAttribute }) => {
      this.loanAttribute = loanAttribute;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
