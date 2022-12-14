import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { PaymentFormService, PaymentFormGroup } from './payment-form.service';
import { IPayment } from '../payment.model';
import { PaymentService } from '../service/payment.service';
import { ILoan } from 'app/entities/loan/loan.model';
import { LoanService } from 'app/entities/loan/service/loan.service';

@Component({
  selector: 'jhi-payment-update',
  templateUrl: './payment-update.component.html',
})
export class PaymentUpdateComponent implements OnInit {
  isSaving = false;
  payment: IPayment | null = null;

  loansSharedCollection: ILoan[] = [];

  editForm: PaymentFormGroup = this.paymentFormService.createPaymentFormGroup();

  numberFormat = new Intl.NumberFormat('en-SG', { style: 'currency', currency: 'SGD' });

  constructor(
    protected paymentService: PaymentService,
    protected paymentFormService: PaymentFormService,
    protected loanService: LoanService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLoan = (o1: ILoan | null, o2: ILoan | null): boolean => this.loanService.compareLoan(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ payment }) => {
      this.payment = payment;
      if (payment) {
        this.updateForm(payment);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const payment = this.paymentFormService.getPayment(this.editForm);
    if (payment.id !== null) {
      this.subscribeToSaveResponse(this.paymentService.update(payment));
    } else {
      this.subscribeToSaveResponse(this.paymentService.create(payment));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPayment>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(payment: IPayment): void {
    this.payment = payment;
    this.paymentFormService.resetForm(this.editForm, payment);

    this.loansSharedCollection = this.loanService.addLoanToCollectionIfMissing<ILoan>(this.loansSharedCollection, payment.loan);
  }

  protected loadRelationshipsOptions(): void {
    this.loanService
      .query()
      .pipe(map((res: HttpResponse<ILoan[]>) => res.body ?? []))
      .pipe(map((loans: ILoan[]) => this.loanService.addLoanToCollectionIfMissing<ILoan>(loans, this.payment?.loan)))
      .subscribe((loans: ILoan[]) => (this.loansSharedCollection = loans));
  }
}
