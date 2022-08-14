package com.king.mycf.web.rest;

import com.king.mycf.domain.LoanRequirement;
import com.king.mycf.repository.LoanRequirementRepository;
import com.king.mycf.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.king.mycf.domain.LoanRequirement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LoanRequirementResource {

    private final Logger log = LoggerFactory.getLogger(LoanRequirementResource.class);

    private static final String ENTITY_NAME = "loanRequirement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LoanRequirementRepository loanRequirementRepository;

    public LoanRequirementResource(LoanRequirementRepository loanRequirementRepository) {
        this.loanRequirementRepository = loanRequirementRepository;
    }

    /**
     * {@code POST  /loan-requirements} : Create a new loanRequirement.
     *
     * @param loanRequirement the loanRequirement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new loanRequirement, or with status {@code 400 (Bad Request)} if the loanRequirement has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/loan-requirements")
    public ResponseEntity<LoanRequirement> createLoanRequirement(@RequestBody LoanRequirement loanRequirement) throws URISyntaxException {
        log.debug("REST request to save LoanRequirement : {}", loanRequirement);
        if (loanRequirement.getId() != null) {
            throw new BadRequestAlertException("A new loanRequirement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LoanRequirement result = loanRequirementRepository.save(loanRequirement);
        return ResponseEntity
            .created(new URI("/api/loan-requirements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /loan-requirements/:id} : Updates an existing loanRequirement.
     *
     * @param id the id of the loanRequirement to save.
     * @param loanRequirement the loanRequirement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loanRequirement,
     * or with status {@code 400 (Bad Request)} if the loanRequirement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the loanRequirement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/loan-requirements/{id}")
    public ResponseEntity<LoanRequirement> updateLoanRequirement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LoanRequirement loanRequirement
    ) throws URISyntaxException {
        log.debug("REST request to update LoanRequirement : {}, {}", id, loanRequirement);
        if (loanRequirement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loanRequirement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loanRequirementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LoanRequirement result = loanRequirementRepository.save(loanRequirement);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, loanRequirement.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /loan-requirements/:id} : Partial updates given fields of an existing loanRequirement, field will ignore if it is null
     *
     * @param id the id of the loanRequirement to save.
     * @param loanRequirement the loanRequirement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated loanRequirement,
     * or with status {@code 400 (Bad Request)} if the loanRequirement is not valid,
     * or with status {@code 404 (Not Found)} if the loanRequirement is not found,
     * or with status {@code 500 (Internal Server Error)} if the loanRequirement couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/loan-requirements/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LoanRequirement> partialUpdateLoanRequirement(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody LoanRequirement loanRequirement
    ) throws URISyntaxException {
        log.debug("REST request to partial update LoanRequirement partially : {}, {}", id, loanRequirement);
        if (loanRequirement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, loanRequirement.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!loanRequirementRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LoanRequirement> result = loanRequirementRepository
            .findById(loanRequirement.getId())
            .map(existingLoanRequirement -> {
                if (loanRequirement.getTotalLimit() != null) {
                    existingLoanRequirement.setTotalLimit(loanRequirement.getTotalLimit());
                }
                if (loanRequirement.getCurrency() != null) {
                    existingLoanRequirement.setCurrency(loanRequirement.getCurrency());
                }
                if (loanRequirement.getType() != null) {
                    existingLoanRequirement.setType(loanRequirement.getType());
                }
                if (loanRequirement.getStartDate() != null) {
                    existingLoanRequirement.setStartDate(loanRequirement.getStartDate());
                }
                if (loanRequirement.getEndDate() != null) {
                    existingLoanRequirement.setEndDate(loanRequirement.getEndDate());
                }

                return existingLoanRequirement;
            })
            .map(loanRequirementRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, loanRequirement.getId().toString())
        );
    }

    /**
     * {@code GET  /loan-requirements} : get all the loanRequirements.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of loanRequirements in body.
     */
    @GetMapping("/loan-requirements")
    public ResponseEntity<List<LoanRequirement>> getAllLoanRequirements(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of LoanRequirements");
        Page<LoanRequirement> page = loanRequirementRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /loan-requirements/:id} : get the "id" loanRequirement.
     *
     * @param id the id of the loanRequirement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the loanRequirement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/loan-requirements/{id}")
    public ResponseEntity<LoanRequirement> getLoanRequirement(@PathVariable Long id) {
        log.debug("REST request to get LoanRequirement : {}", id);
        Optional<LoanRequirement> loanRequirement = loanRequirementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(loanRequirement);
    }

    /**
     * {@code DELETE  /loan-requirements/:id} : delete the "id" loanRequirement.
     *
     * @param id the id of the loanRequirement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/loan-requirements/{id}")
    public ResponseEntity<Void> deleteLoanRequirement(@PathVariable Long id) {
        log.debug("REST request to delete LoanRequirement : {}", id);
        loanRequirementRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
