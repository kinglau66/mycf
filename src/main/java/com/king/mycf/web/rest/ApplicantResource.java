package com.king.mycf.web.rest;

import com.king.mycf.domain.Applicant;
import com.king.mycf.repository.ApplicantRepository;
import com.king.mycf.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.king.mycf.domain.Applicant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ApplicantResource {

    private final Logger log = LoggerFactory.getLogger(ApplicantResource.class);

    private static final String ENTITY_NAME = "applicant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ApplicantRepository applicantRepository;

    public ApplicantResource(ApplicantRepository applicantRepository) {
        this.applicantRepository = applicantRepository;
    }

    /**
     * {@code POST  /applicants} : Create a new applicant.
     *
     * @param applicant the applicant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new applicant, or with status {@code 400 (Bad Request)} if the applicant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/applicants")
    public ResponseEntity<Applicant> createApplicant(@RequestBody Applicant applicant) throws URISyntaxException {
        log.debug("REST request to save Applicant : {}", applicant);
        if (applicant.getId() != null) {
            throw new BadRequestAlertException("A new applicant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Applicant result = applicantRepository.save(applicant);
        return ResponseEntity
            .created(new URI("/api/applicants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /applicants/:id} : Updates an existing applicant.
     *
     * @param id the id of the applicant to save.
     * @param applicant the applicant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated applicant,
     * or with status {@code 400 (Bad Request)} if the applicant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the applicant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/applicants/{id}")
    public ResponseEntity<Applicant> updateApplicant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Applicant applicant
    ) throws URISyntaxException {
        log.debug("REST request to update Applicant : {}, {}", id, applicant);
        if (applicant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, applicant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!applicantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Applicant result = applicantRepository.save(applicant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, applicant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /applicants/:id} : Partial updates given fields of an existing applicant, field will ignore if it is null
     *
     * @param id the id of the applicant to save.
     * @param applicant the applicant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated applicant,
     * or with status {@code 400 (Bad Request)} if the applicant is not valid,
     * or with status {@code 404 (Not Found)} if the applicant is not found,
     * or with status {@code 500 (Internal Server Error)} if the applicant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/applicants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Applicant> partialUpdateApplicant(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Applicant applicant
    ) throws URISyntaxException {
        log.debug("REST request to partial update Applicant partially : {}, {}", id, applicant);
        if (applicant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, applicant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!applicantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Applicant> result = applicantRepository
            .findById(applicant.getId())
            .map(existingApplicant -> {
                if (applicant.getFirstName() != null) {
                    existingApplicant.setFirstName(applicant.getFirstName());
                }
                if (applicant.getLastName() != null) {
                    existingApplicant.setLastName(applicant.getLastName());
                }
                if (applicant.getEmail() != null) {
                    existingApplicant.setEmail(applicant.getEmail());
                }
                if (applicant.getPhoneNumber() != null) {
                    existingApplicant.setPhoneNumber(applicant.getPhoneNumber());
                }
                if (applicant.getCreatedDt() != null) {
                    existingApplicant.setCreatedDt(applicant.getCreatedDt());
                }
                if (applicant.getSalary() != null) {
                    existingApplicant.setSalary(applicant.getSalary());
                }

                return existingApplicant;
            })
            .map(applicantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, applicant.getId().toString())
        );
    }

    /**
     * {@code GET  /applicants} : get all the applicants.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of applicants in body.
     */
    @GetMapping("/applicants")
    public List<Applicant> getAllApplicants() {
        log.debug("REST request to get all Applicants");
        return applicantRepository.findAll();
    }

    /**
     * {@code GET  /applicants/:id} : get the "id" applicant.
     *
     * @param id the id of the applicant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the applicant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/applicants/{id}")
    public ResponseEntity<Applicant> getApplicant(@PathVariable Long id) {
        log.debug("REST request to get Applicant : {}", id);
        Optional<Applicant> applicant = applicantRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(applicant);
    }

    /**
     * {@code DELETE  /applicants/:id} : delete the "id" applicant.
     *
     * @param id the id of the applicant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/applicants/{id}")
    public ResponseEntity<Void> deleteApplicant(@PathVariable Long id) {
        log.debug("REST request to delete Applicant : {}", id);
        applicantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
