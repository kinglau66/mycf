package com.king.mycf.web.rest;

import com.king.mycf.domain.CreditFacility;
import com.king.mycf.repository.CreditFacilityRepository;
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
 * REST controller for managing {@link com.king.mycf.domain.CreditFacility}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CreditFacilityResource {

    private final Logger log = LoggerFactory.getLogger(CreditFacilityResource.class);

    private static final String ENTITY_NAME = "creditFacility";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CreditFacilityRepository creditFacilityRepository;

    public CreditFacilityResource(CreditFacilityRepository creditFacilityRepository) {
        this.creditFacilityRepository = creditFacilityRepository;
    }

    /**
     * {@code POST  /credit-facilities} : Create a new creditFacility.
     *
     * @param creditFacility the creditFacility to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new creditFacility, or with status {@code 400 (Bad Request)} if the creditFacility has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/credit-facilities")
    public ResponseEntity<CreditFacility> createCreditFacility(@RequestBody CreditFacility creditFacility) throws URISyntaxException {
        log.debug("REST request to save CreditFacility : {}", creditFacility);
        if (creditFacility.getId() != null) {
            throw new BadRequestAlertException("A new creditFacility cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CreditFacility result = creditFacilityRepository.save(creditFacility);
        return ResponseEntity
            .created(new URI("/api/credit-facilities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /credit-facilities/:id} : Updates an existing creditFacility.
     *
     * @param id the id of the creditFacility to save.
     * @param creditFacility the creditFacility to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditFacility,
     * or with status {@code 400 (Bad Request)} if the creditFacility is not valid,
     * or with status {@code 500 (Internal Server Error)} if the creditFacility couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/credit-facilities/{id}")
    public ResponseEntity<CreditFacility> updateCreditFacility(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CreditFacility creditFacility
    ) throws URISyntaxException {
        log.debug("REST request to update CreditFacility : {}, {}", id, creditFacility);
        if (creditFacility.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditFacility.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditFacilityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CreditFacility result = creditFacilityRepository.save(creditFacility);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, creditFacility.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /credit-facilities/:id} : Partial updates given fields of an existing creditFacility, field will ignore if it is null
     *
     * @param id the id of the creditFacility to save.
     * @param creditFacility the creditFacility to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated creditFacility,
     * or with status {@code 400 (Bad Request)} if the creditFacility is not valid,
     * or with status {@code 404 (Not Found)} if the creditFacility is not found,
     * or with status {@code 500 (Internal Server Error)} if the creditFacility couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/credit-facilities/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CreditFacility> partialUpdateCreditFacility(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CreditFacility creditFacility
    ) throws URISyntaxException {
        log.debug("REST request to partial update CreditFacility partially : {}, {}", id, creditFacility);
        if (creditFacility.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, creditFacility.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!creditFacilityRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CreditFacility> result = creditFacilityRepository
            .findById(creditFacility.getId())
            .map(existingCreditFacility -> {
                if (creditFacility.getTotalLimit() != null) {
                    existingCreditFacility.setTotalLimit(creditFacility.getTotalLimit());
                }
                if (creditFacility.getCurrency() != null) {
                    existingCreditFacility.setCurrency(creditFacility.getCurrency());
                }
                if (creditFacility.getStartDate() != null) {
                    existingCreditFacility.setStartDate(creditFacility.getStartDate());
                }
                if (creditFacility.getEndDate() != null) {
                    existingCreditFacility.setEndDate(creditFacility.getEndDate());
                }

                return existingCreditFacility;
            })
            .map(creditFacilityRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, creditFacility.getId().toString())
        );
    }

    /**
     * {@code GET  /credit-facilities} : get all the creditFacilities.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of creditFacilities in body.
     */
    @GetMapping("/credit-facilities")
    public ResponseEntity<List<CreditFacility>> getAllCreditFacilities(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of CreditFacilities");
        Page<CreditFacility> page = creditFacilityRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /credit-facilities/:id} : get the "id" creditFacility.
     *
     * @param id the id of the creditFacility to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the creditFacility, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/credit-facilities/{id}")
    public ResponseEntity<CreditFacility> getCreditFacility(@PathVariable Long id) {
        log.debug("REST request to get CreditFacility : {}", id);
        Optional<CreditFacility> creditFacility = creditFacilityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(creditFacility);
    }

    /**
     * {@code DELETE  /credit-facilities/:id} : delete the "id" creditFacility.
     *
     * @param id the id of the creditFacility to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/credit-facilities/{id}")
    public ResponseEntity<Void> deleteCreditFacility(@PathVariable Long id) {
        log.debug("REST request to delete CreditFacility : {}", id);
        creditFacilityRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
