package com.king.mycf.domain;

import com.king.mycf.domain.enumeration.LoanType;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LoanRequirement.
 */
@Entity
@Table(name = "loan_requirement")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class LoanRequirement implements Serializable {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private LoanType type;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LoanRequirement id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTotalLimit() {
        return this.totalLimit;
    }

    public LoanRequirement totalLimit(Long totalLimit) {
        this.setTotalLimit(totalLimit);
        return this;
    }

    public void setTotalLimit(Long totalLimit) {
        this.totalLimit = totalLimit;
    }

    public String getCurrency() {
        return this.currency;
    }

    public LoanRequirement currency(String currency) {
        this.setCurrency(currency);
        return this;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public LoanType getType() {
        return this.type;
    }

    public LoanRequirement type(LoanType type) {
        this.setType(type);
        return this;
    }

    public void setType(LoanType type) {
        this.type = type;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public LoanRequirement startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public LoanRequirement endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LoanRequirement)) {
            return false;
        }
        return id != null && id.equals(((LoanRequirement) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LoanRequirement{" +
            "id=" + getId() +
            ", totalLimit=" + getTotalLimit() +
            ", currency='" + getCurrency() + "'" +
            ", type='" + getType() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            "}";
    }
}
