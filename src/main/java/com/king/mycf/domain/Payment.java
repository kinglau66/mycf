package com.king.mycf.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Payment.
 */
@Entity
@Table(name = "payment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Payment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "payment_amount")
    private Long paymentAmount;

    @Column(name = "payment_type")
    private String paymentType;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @ManyToOne
    @JsonIgnoreProperties(value = { "applicant", "payments", "creditFacility" }, allowSetters = true)
    private Loan loan;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Payment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPaymentAmount() {
        return this.paymentAmount;
    }

    public Payment paymentAmount(Long paymentAmount) {
        this.setPaymentAmount(paymentAmount);
        return this;
    }

    public void setPaymentAmount(Long paymentAmount) {
        this.paymentAmount = paymentAmount;
    }

    public String getPaymentType() {
        return this.paymentType;
    }

    public Payment paymentType(String paymentType) {
        this.setPaymentType(paymentType);
        return this;
    }

    public void setPaymentType(String paymentType) {
        this.paymentType = paymentType;
    }

    public LocalDate getPaymentDate() {
        return this.paymentDate;
    }

    public Payment paymentDate(LocalDate paymentDate) {
        this.setPaymentDate(paymentDate);
        return this;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public Loan getLoan() {
        return this.loan;
    }

    public void setLoan(Loan loan) {
        this.loan = loan;
    }

    public Payment loan(Loan loan) {
        this.setLoan(loan);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Payment)) {
            return false;
        }
        return id != null && id.equals(((Payment) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Payment{" +
            "id=" + getId() +
            ", paymentAmount=" + getPaymentAmount() +
            ", paymentType='" + getPaymentType() + "'" +
            ", paymentDate='" + getPaymentDate() + "'" +
            "}";
    }
}
