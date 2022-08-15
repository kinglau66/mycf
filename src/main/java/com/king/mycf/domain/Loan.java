package com.king.mycf.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Loan.
 */
@Entity
@Table(name = "loan")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Loan implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "amount")
    private Long amount;

    @Column(name = "currency")
    private String currency;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "interest_rate")
    private Double interestRate;

    @JsonIgnoreProperties(value = { "user", "creditFacility" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Applicant applicant;

    @OneToMany(mappedBy = "loan")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "loan" }, allowSetters = true)
    private Set<Payment> payments = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "creditLimits", "applicants" }, allowSetters = true)
    private CreditFacility creditFacility;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Loan id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAmount() {
        return this.amount;
    }

    public Loan amount(Long amount) {
        this.setAmount(amount);
        return this;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return this.currency;
    }

    public Loan currency(String currency) {
        this.setCurrency(currency);
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Loan startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public Loan endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Double getInterestRate() {
        return this.interestRate;
    }

    public Loan interestRate(Double interestRate) {
        this.setInterestRate(interestRate);
        return this;
    }

    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }

    public Applicant getApplicant() {
        return this.applicant;
    }

    public void setApplicant(Applicant applicant) {
        this.applicant = applicant;
    }

    public Loan applicant(Applicant applicant) {
        this.setApplicant(applicant);
        return this;
    }

    public Set<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(Set<Payment> payments) {
        if (this.payments != null) {
            this.payments.forEach(i -> i.setLoan(null));
        }
        if (payments != null) {
            payments.forEach(i -> i.setLoan(this));
        }
        this.payments = payments;
    }

    public Loan payments(Set<Payment> payments) {
        this.setPayments(payments);
        return this;
    }

    public Loan addPayment(Payment payment) {
        this.payments.add(payment);
        payment.setLoan(this);
        return this;
    }

    public Loan removePayment(Payment payment) {
        this.payments.remove(payment);
        payment.setLoan(null);
        return this;
    }

    public CreditFacility getCreditFacility() {
        return this.creditFacility;
    }

    public void setCreditFacility(CreditFacility creditFacility) {
        this.creditFacility = creditFacility;
    }

    public Loan creditFacility(CreditFacility creditFacility) {
        this.setCreditFacility(creditFacility);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Loan)) {
            return false;
        }
        return id != null && id.equals(((Loan) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Loan{" +
            "id=" + getId() +
            ", amount=" + getAmount() +
            ", currency='" + getCurrency() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", interestRate=" + getInterestRate() +
            "}";
    }
}
