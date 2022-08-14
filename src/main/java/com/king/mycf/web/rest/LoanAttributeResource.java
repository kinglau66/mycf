package com.king.mycf.web.rest;

import com.king.mycf.domain.LoanAttribute;
import com.king.mycf.repository.LoanAttributeRepository;
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
 * REST controller for managing {@link com.king.mycf.domain.LoanAttribute}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LoanAttributeResource {

    private final Logger log = LoggerFactory.getLogger(LoanAttributeResource.class);

    private static final String ENTITY_NAME = "loanAttribute";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LoanAttributeRepository loanAttributeRepository;

    public LoanAttributeResource(LoanAttributeRepository loanAttributeRepository) {
        this.loanAttributeRepository = loanAttributeRepository;
    }

    /**
     * {@code POST  /loan-attributes} : Create a new loanAttribute.
     *
     * @param loanAttribute the loanAttribute to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new loanAttribute, or with status {@code 400 (Bad Request)} if the loanAttribute has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/loan-attributes")
    public ResponseEntity<LoanAttribute> createLoanAttribute(@RequestBody LoanAttribute loanAttribute) throws URISyntaxException {
        log.debug("REST request to save LoanAttribute : {}", loanAttribute);
        if (loanAttribute.getId() != null) {
            throw new BadRequestAlertException("A new loanAttribute cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LoanAttribute result = loanAttributeRepository.save(loanAttribute);
        return ResponseEntity
            .created(new URI("/api/loan-attributes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /loan-attributes/:id} : Updates an existing loanAttribute.
     *
     * @param id the id of the loanAttribute to save.
     * @param loanAttribute the loanAttribute to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loanAttribute,
     * or with status {@code 400 (Bad Request)} if the loanAttribute is not valid,
     * or with status {@code 500 (Internal Server Error)} if the loanAttribute couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/loan-attributes/{id}")
    public ResponseEntity<LoanAttribute> updateLoanAttribute(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LoanAttribute loanAttribute
    ) throws URISyntaxException {
        log.debug("REST request to update LoanAttribute : {}, {}", id, loanAttribute);
        if (loanAttribute.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loanAttribute.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loanAttributeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LoanAttribute result = loanAttributeRepository.save(loanAttribute);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, loanAttribute.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /loan-attributes/:id} : Partial updates given fields of an existing loanAttribute, field will ignore if it is null
     *
     * @param id the id of the loanAttribute to save.
     * @param loanAttribute the loanAttribute to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loanAttribute,
     * or with status {@code 400 (Bad Request)} if the loanAttribute is not valid,
     * or with status {@code 404 (Not Found)} if the loanAttribute is not found,
     * or with status {@code 500 (Internal Server Error)} if the loanAttribute couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/loan-attributes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LoanAttribute> partialUpdateLoanAttribute(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LoanAttribute loanAttribute
    ) throws URISyntaxException {
        log.debug("REST request to partial update LoanAttribute partially : {}, {}", id, loanAttribute);
        if (loanAttribute.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loanAttribute.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loanAttributeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LoanAttribute> result = loanAttributeRepository
            .findById(loanAttribute.getId())
            .map(existingLoanAttribute -> {
                if (loanAttribute.getJobTitle() != null) {
                    existingLoanAttribute.setJobTitle(loanAttribute.getJobTitle());
                }
                if (loanAttribute.getMinSalary() != null) {
                    existingLoanAttribute.setMinSalary(loanAttribute.getMinSalary());
                }
                if (loanAttribute.getMaxSalary() != null) {
                    existingLoanAttribute.setMaxSalary(loanAttribute.getMaxSalary());
                }

                return existingLoanAttribute;
            })
            .map(loanAttributeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, loanAttribute.getId().toString())
        );
    }

    /**
     * {@code GET  /loan-attributes} : get all the loanAttributes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of loanAttributes in body.
     */
    @GetMapping("/loan-attributes")
    public List<LoanAttribute> getAllLoanAttributes() {
        log.debug("REST request to get all LoanAttributes");
        return loanAttributeRepository.findAll();
    }

    /**
     * {@code GET  /loan-attributes/:id} : get the "id" loanAttribute.
     *
     * @param id the id of the loanAttribute to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the loanAttribute, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/loan-attributes/{id}")
    public ResponseEntity<LoanAttribute> getLoanAttribute(@PathVariable Long id) {
        log.debug("REST request to get LoanAttribute : {}", id);
        Optional<LoanAttribute> loanAttribute = loanAttributeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(loanAttribute);
    }

    /**
     * {@code DELETE  /loan-attributes/:id} : delete the "id" loanAttribute.
     *
     * @param id the id of the loanAttribute to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/loan-attributes/{id}")
    public ResponseEntity<Void> deleteLoanAttribute(@PathVariable Long id) {
        log.debug("REST request to delete LoanAttribute : {}", id);
        loanAttributeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
