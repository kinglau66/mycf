package com.king.mycf.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.king.mycf.domain.enumeration.LoanType;
import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CreditLimit.
 */
@Entity
@Table(name = "credit_limit")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CreditLimit implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private LoanType type;

    @Column(name = "total_limit")
    private Long totalLimit;

    @ManyToOne
    @JsonIgnoreProperties(value = { "creditLimits", "applicants" }, allowSetters = true)
    private CreditFacility creditFacility;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CreditLimit id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LoanType getType() {
        return this.type;
    }

    public CreditLimit type(LoanType type) {
        this.setType(type);
        return this;
    }

    public void setType(LoanType type) {
        this.type = type;
    }

    public Long getTotalLimit() {
        return this.totalLimit;
    }

    public CreditLimit totalLimit(Long totalLimit) {
        this.setTotalLimit(totalLimit);
        return this;
    }

    public void setTotalLimit(Long totalLimit) {
        this.totalLimit = totalLimit;
    }

    public CreditFacility getCreditFacility() {
        return this.creditFacility;
    }

    public void setCreditFacility(CreditFacility creditFacility) {
        this.creditFacility = creditFacility;
    }

    public CreditLimit creditFacility(CreditFacility creditFacility) {
        this.setCreditFacility(creditFacility);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CreditLimit)) {
            return false;
        }
        return id != null && id.equals(((CreditLimit) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CreditLimit{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", totalLimit=" + getTotalLimit() +
            "}";
    }
}
