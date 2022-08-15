package com.king.mycf.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * The Employee entity.
 */
@Schema(description = "The Employee entity.")
@Entity
@Table(name = "applicant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Applicant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    /**
     * The firstname attribute.
     */
    @Schema(description = "The firstname attribute.")
    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "created_dt")
    private LocalDate createdDt;

    @Column(name = "salary")
    private Long salary;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = { "creditLimits", "applicants" }, allowSetters = true)
    private CreditFacility creditFacility;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Applicant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Applicant firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public Applicant lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return this.email;
    }

    public Applicant email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Applicant phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public LocalDate getCreatedDt() {
        return this.createdDt;
    }

    public Applicant createdDt(LocalDate createdDt) {
        this.setCreatedDt(createdDt);
        return this;
    }

    public void setCreatedDt(LocalDate createdDt) {
        this.createdDt = createdDt;
    }

    public Long getSalary() {
        return this.salary;
    }

    public Applicant salary(Long salary) {
        this.setSalary(salary);
        return this;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Applicant user(User user) {
        this.setUser(user);
        return this;
    }

    public CreditFacility getCreditFacility() {
        return this.creditFacility;
    }

    public void setCreditFacility(CreditFacility creditFacility) {
        this.creditFacility = creditFacility;
    }

    public Applicant creditFacility(CreditFacility creditFacility) {
        this.setCreditFacility(creditFacility);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Applicant)) {
            return false;
        }
        return id != null && id.equals(((Applicant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Applicant{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", email='" + getEmail() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", createdDt='" + getCreatedDt() + "'" +
            ", salary=" + getSalary() +
            "}";
    }
}
