import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoanRequirement } from '../loan-requirement.model';

@Component({
  selector: 'jhi-loan-requirement-detail',
  templateUrl: './loan-requirement-detail.component.html',
})
export class LoanRequirementDetailComponent implements OnInit {
  loanRequirement: ILoanRequirement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loanRequirement }) => {
      this.loanRequirement = loanRequirement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
