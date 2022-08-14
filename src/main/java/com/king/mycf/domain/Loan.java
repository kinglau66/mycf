package com.king.mycf.domain;

import java.io.Serializable;
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

    @Column(name = "current")
    private String current;

    @OneToOne
    @JoinColumn(unique = true)
    private LoanAttribute loanAttribute;

    @OneToOne
    @JoinColumn(unique = true)
    private Applicant applicant;

    @ManyToOne
    private LoanRequirement loanRequirement;

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

    public String getCurrent() {
        return this.current;
    }

    public Loan current(String current) {
        this.setCurrent(current);
        return this;
    }

    public void setCurrent(String current) {
        this.current = current;
    }

    public LoanAttribute getLoanAttribute() {
        return this.loanAttribute;
    }

    public void setLoanAttribute(LoanAttribute loanAttribute) {
        this.loanAttribute = loanAttribute;
    }

    public Loan loanAttribute(LoanAttribute loanAttribute) {
        this.setLoanAttribute(loanAttribute);
        return this;
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

    public LoanRequirement getLoanRequirement() {
        return this.loanRequirement;
    }

    public void setLoanRequirement(LoanRequirement loanRequirement) {
        this.loanRequirement = loanRequirement;
    }

    public Loan loanRequirement(LoanRequirement loanRequirement) {
        this.setLoanRequirement(loanRequirement);
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
            ", current='" + getCurrent() + "'" +
            "}";
    }
}
