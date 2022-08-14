package com.king.mycf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.king.mycf.IntegrationTest;
import com.king.mycf.domain.LoanRequirement;
import com.king.mycf.domain.enumeration.LoanType;
import com.king.mycf.repository.LoanRequirementRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link LoanRequirementResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LoanRequirementResourceIT {

    private static final Long DEFAULT_TOTAL_LIMIT = 1L;
    private static final Long UPDATED_TOTAL_LIMIT = 2L;

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final LoanType DEFAULT_TYPE = LoanType.CAR;
    private static final LoanType UPDATED_TYPE = LoanType.ENGLISH;

    private static final Instant DEFAULT_START_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_START_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_END_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_END_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/loan-requirements";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LoanRequirementRepository loanRequirementRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoanRequirementMockMvc;

    private LoanRequirement loanRequirement;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoanRequirement createEntity(EntityManager em) {
        LoanRequirement loanRequirement = new LoanRequirement()
            .totalLimit(DEFAULT_TOTAL_LIMIT)
            .currency(DEFAULT_CURRENCY)
            .type(DEFAULT_TYPE)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE);
        return loanRequirement;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoanRequirement createUpdatedEntity(EntityManager em) {
        LoanRequirement loanRequirement = new LoanRequirement()
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .type(UPDATED_TYPE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);
        return loanRequirement;
    }

    @BeforeEach
    public void initTest() {
        loanRequirement = createEntity(em);
    }

    @Test
    @Transactional
    void createLoanRequirement() throws Exception {
        int databaseSizeBeforeCreate = loanRequirementRepository.findAll().size();
        // Create the LoanRequirement
        restLoanRequirementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isCreated());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeCreate + 1);
        LoanRequirement testLoanRequirement = loanRequirementList.get(loanRequirementList.size() - 1);
        assertThat(testLoanRequirement.getTotalLimit()).isEqualTo(DEFAULT_TOTAL_LIMIT);
        assertThat(testLoanRequirement.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testLoanRequirement.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testLoanRequirement.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLoanRequirement.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void createLoanRequirementWithExistingId() throws Exception {
        // Create the LoanRequirement with an existing ID
        loanRequirement.setId(1L);

        int databaseSizeBeforeCreate = loanRequirementRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoanRequirementMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLoanRequirements() throws Exception {
        // Initialize the database
        loanRequirementRepository.saveAndFlush(loanRequirement);

        // Get all the loanRequirementList
        restLoanRequirementMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loanRequirement.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalLimit").value(hasItem(DEFAULT_TOTAL_LIMIT.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getLoanRequirement() throws Exception {
        // Initialize the database
        loanRequirementRepository.saveAndFlush(loanRequirement);

        // Get the loanRequirement
        restLoanRequirementMockMvc
            .perform(get(ENTITY_API_URL_ID, loanRequirement.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(loanRequirement.getId().intValue()))
            .andExpect(jsonPath("$.totalLimit").value(DEFAULT_TOTAL_LIMIT.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingLoanRequirement() throws Exception {
        // Get the loanRequirement
        restLoanRequirementMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLoanRequirement() throws Exception {
        // Initialize the database
        loanRequirementRepository.saveAndFlush(loanRequirement);

        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();

        // Update the loanRequirement
        LoanRequirement updatedLoanRequirement = loanRequirementRepository.findById(loanRequirement.getId()).get();
        // Disconnect from session so that the updates on updatedLoanRequirement are not directly saved in db
        em.detach(updatedLoanRequirement);
        updatedLoanRequirement
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .type(UPDATED_TYPE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restLoanRequirementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLoanRequirement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLoanRequirement))
            )
            .andExpect(status().isOk());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
        LoanRequirement testLoanRequirement = loanRequirementList.get(loanRequirementList.size() - 1);
        assertThat(testLoanRequirement.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
        assertThat(testLoanRequirement.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testLoanRequirement.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLoanRequirement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLoanRequirement.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingLoanRequirement() throws Exception {
        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();
        loanRequirement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoanRequirementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, loanRequirement.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLoanRequirement() throws Exception {
        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();
        loanRequirement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanRequirementMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLoanRequirement() throws Exception {
        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();
        loanRequirement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanRequirementMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoanRequirementWithPatch() throws Exception {
        // Initialize the database
        loanRequirementRepository.saveAndFlush(loanRequirement);

        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();

        // Update the loanRequirement using partial update
        LoanRequirement partialUpdatedLoanRequirement = new LoanRequirement();
        partialUpdatedLoanRequirement.setId(loanRequirement.getId());

        partialUpdatedLoanRequirement
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .type(UPDATED_TYPE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restLoanRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoanRequirement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoanRequirement))
            )
            .andExpect(status().isOk());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
        LoanRequirement testLoanRequirement = loanRequirementList.get(loanRequirementList.size() - 1);
        assertThat(testLoanRequirement.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
        assertThat(testLoanRequirement.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testLoanRequirement.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLoanRequirement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLoanRequirement.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateLoanRequirementWithPatch() throws Exception {
        // Initialize the database
        loanRequirementRepository.saveAndFlush(loanRequirement);

        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();

        // Update the loanRequirement using partial update
        LoanRequirement partialUpdatedLoanRequirement = new LoanRequirement();
        partialUpdatedLoanRequirement.setId(loanRequirement.getId());

        partialUpdatedLoanRequirement
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .type(UPDATED_TYPE)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restLoanRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoanRequirement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoanRequirement))
            )
            .andExpect(status().isOk());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
        LoanRequirement testLoanRequirement = loanRequirementList.get(loanRequirementList.size() - 1);
        assertThat(testLoanRequirement.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
        assertThat(testLoanRequirement.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testLoanRequirement.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testLoanRequirement.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLoanRequirement.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingLoanRequirement() throws Exception {
        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();
        loanRequirement.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoanRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, loanRequirement.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLoanRequirement() throws Exception {
        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();
        loanRequirement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLoanRequirement() throws Exception {
        int databaseSizeBeforeUpdate = loanRequirementRepository.findAll().size();
        loanRequirement.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanRequirementMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loanRequirement))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoanRequirement in the database
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLoanRequirement() throws Exception {
        // Initialize the database
        loanRequirementRepository.saveAndFlush(loanRequirement);

        int databaseSizeBeforeDelete = loanRequirementRepository.findAll().size();

        // Delete the loanRequirement
        restLoanRequirementMockMvc
            .perform(delete(ENTITY_API_URL_ID, loanRequirement.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LoanRequirement> loanRequirementList = loanRequirementRepository.findAll();
        assertThat(loanRequirementList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
