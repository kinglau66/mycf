package com.king.mycf.web.rest;

import com.king.mycf.domain.CreditLimit;
import com.king.mycf.repository.CreditLimitRepository;
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
 * REST controller for managing {@link com.king.mycf.domain.CreditLimit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CreditLimitResource {

    private final Logger log = LoggerFactory.getLogger(CreditLimitResource.class);

    private static final String ENTITY_NAME = "creditLimit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreditLimitRepository creditLimitRepository;

    public CreditLimitResource(CreditLimitRepository creditLimitRepository) {
        this.creditLimitRepository = creditLimitRepository;
    }

    /**
     * {@code POST  /credit-limits} : Create a new creditLimit.
     *
     * @param creditLimit the creditLimit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new creditLimit, or with status {@code 400 (Bad Request)} if the creditLimit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/credit-limits")
    public ResponseEntity<CreditLimit> createCreditLimit(@RequestBody CreditLimit creditLimit) throws URISyntaxException {
        log.debug("REST request to save CreditLimit : {}", creditLimit);
        if (creditLimit.getId() != null) {
            throw new BadRequestAlertException("A new creditLimit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CreditLimit result = creditLimitRepository.save(creditLimit);
        return ResponseEntity
            .created(new URI("/api/credit-limits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /credit-limits/:id} : Updates an existing creditLimit.
     *
     * @param id the id of the creditLimit to save.
     * @param creditLimit the creditLimit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditLimit,
     * or with status {@code 400 (Bad Request)} if the creditLimit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the creditLimit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/credit-limits/{id}")
    public ResponseEntity<CreditLimit> updateCreditLimit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CreditLimit creditLimit
    ) throws URISyntaxException {
        log.debug("REST request to update CreditLimit : {}, {}", id, creditLimit);
        if (creditLimit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditLimit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditLimitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CreditLimit result = creditLimitRepository.save(creditLimit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, creditLimit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /credit-limits/:id} : Partial updates given fields of an existing creditLimit, field will ignore if it is null
     *
     * @param id the id of the creditLimit to save.
     * @param creditLimit the creditLimit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditLimit,
     * or with status {@code 400 (Bad Request)} if the creditLimit is not valid,
     * or with status {@code 404 (Not Found)} if the creditLimit is not found,
     * or with status {@code 500 (Internal Server Error)} if the creditLimit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/credit-limits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CreditLimit> partialUpdateCreditLimit(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CreditLimit creditLimit
    ) throws URISyntaxException {
        log.debug("REST request to partial update CreditLimit partially : {}, {}", id, creditLimit);
        if (creditLimit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditLimit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditLimitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CreditLimit> result = creditLimitRepository
            .findById(creditLimit.getId())
            .map(existingCreditLimit -> {
                if (creditLimit.getType() != null) {
                    existingCreditLimit.setType(creditLimit.getType());
                }
                if (creditLimit.getTotalLimit() != null) {
                    existingCreditLimit.setTotalLimit(creditLimit.getTotalLimit());
                }

                return existingCreditLimit;
            })
            .map(creditLimitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, creditLimit.getId().toString())
        );
    }

    /**
     * {@code GET  /credit-limits} : get all the creditLimits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of creditLimits in body.
     */
    @GetMapping("/credit-limits")
    public List<CreditLimit> getAllCreditLimits() {
        log.debug("REST request to get all CreditLimits");
        return creditLimitRepository.findAll();
    }

    /**
     * {@code GET  /credit-limits/:id} : get the "id" creditLimit.
     *
     * @param id the id of the creditLimit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the creditLimit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/credit-limits/{id}")
    public ResponseEntity<CreditLimit> getCreditLimit(@PathVariable Long id) {
        log.debug("REST request to get CreditLimit : {}", id);
        Optional<CreditLimit> creditLimit = creditLimitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(creditLimit);
    }

    /**
     * {@code DELETE  /credit-limits/:id} : delete the "id" creditLimit.
     *
     * @param id the id of the creditLimit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/credit-limits/{id}")
    public ResponseEntity<Void> deleteCreditLimit(@PathVariable Long id) {
        log.debug("REST request to delete CreditLimit : {}", id);
        creditLimitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
