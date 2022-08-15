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
 * A CreditFacility.
 */
@Entity
@Table(name = "credit_facility")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CreditFacility implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "total_limit")
    private Long totalLimit;

    @Column(name = "currency")
    private String currency;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @OneToMany(mappedBy = "creditFacility")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "creditFacility" }, allowSetters = true)
    private Set<CreditLimit> creditLimits = new HashSet<>();

    @OneToMany(mappedBy = "creditFacility")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "creditFacility" }, allowSetters = true)
    private Set<Applicant> applicants = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CreditFacility id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTotalLimit() {
        return this.totalLimit;
    }

    public CreditFacility totalLimit(Long totalLimit) {
        this.setTotalLimit(totalLimit);
        return this;
    }

    public void setTotalLimit(Long totalLimit) {
        this.totalLimit = totalLimit;
    }

    public String getCurrency() {
        return this.currency;
    }

    public CreditFacility currency(String currency) {
        this.setCurrency(currency);
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public CreditFacility startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public CreditFacility endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Set<CreditLimit> getCreditLimits() {
        return this.creditLimits;
    }

    public void setCreditLimits(Set<CreditLimit> creditLimits) {
        if (this.creditLimits != null) {
            this.creditLimits.forEach(i -> i.setCreditFacility(null));
        }
        if (creditLimits != null) {
            creditLimits.forEach(i -> i.setCreditFacility(this));
        }
        this.creditLimits = creditLimits;
    }

    public CreditFacility creditLimits(Set<CreditLimit> creditLimits) {
        this.setCreditLimits(creditLimits);
        return this;
    }

    public CreditFacility addCreditLimit(CreditLimit creditLimit) {
        this.creditLimits.add(creditLimit);
        creditLimit.setCreditFacility(this);
        return this;
    }

    public CreditFacility removeCreditLimit(CreditLimit creditLimit) {
        this.creditLimits.remove(creditLimit);
        creditLimit.setCreditFacility(null);
        return this;
    }

    public Set<Applicant> getApplicants() {
        return this.applicants;
    }

    public void setApplicants(Set<Applicant> applicants) {
        if (this.applicants != null) {
            this.applicants.forEach(i -> i.setCreditFacility(null));
        }
        if (applicants != null) {
            applicants.forEach(i -> i.setCreditFacility(this));
        }
        this.applicants = applicants;
    }

    public CreditFacility applicants(Set<Applicant> applicants) {
        this.setApplicants(applicants);
        return this;
    }

    public CreditFacility addApplicant(Applicant applicant) {
        this.applicants.add(applicant);
        applicant.setCreditFacility(this);
        return this;
    }

    public CreditFacility removeApplicant(Applicant applicant) {
        this.applicants.remove(applicant);
        applicant.setCreditFacility(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CreditFacility)) {
            return false;
        }
        return id != null && id.equals(((CreditFacility) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CreditFacility{" +
            "id=" + getId() +
            ", totalLimit=" + getTotalLimit() +
            ", currency='" + getCurrency() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            "}";
    }
}
