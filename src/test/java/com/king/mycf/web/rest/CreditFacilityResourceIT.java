package com.king.mycf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.king.mycf.IntegrationTest;
import com.king.mycf.domain.CreditFacility;
import com.king.mycf.repository.CreditFacilityRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link CreditFacilityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CreditFacilityResourceIT {

    private static final Long DEFAULT_TOTAL_LIMIT = 1L;
    private static final Long UPDATED_TOTAL_LIMIT = 2L;

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/credit-facilities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CreditFacilityRepository creditFacilityRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCreditFacilityMockMvc;

    private CreditFacility creditFacility;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditFacility createEntity(EntityManager em) {
        CreditFacility creditFacility = new CreditFacility()
            .totalLimit(DEFAULT_TOTAL_LIMIT)
            .currency(DEFAULT_CURRENCY)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE);
        return creditFacility;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditFacility createUpdatedEntity(EntityManager em) {
        CreditFacility creditFacility = new CreditFacility()
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);
        return creditFacility;
    }

    @BeforeEach
    public void initTest() {
        creditFacility = createEntity(em);
    }

    @Test
    @Transactional
    void createCreditFacility() throws Exception {
        int databaseSizeBeforeCreate = creditFacilityRepository.findAll().size();
        // Create the CreditFacility
        restCreditFacilityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(creditFacility))
            )
            .andExpect(status().isCreated());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeCreate + 1);
        CreditFacility testCreditFacility = creditFacilityList.get(creditFacilityList.size() - 1);
        assertThat(testCreditFacility.getTotalLimit()).isEqualTo(DEFAULT_TOTAL_LIMIT);
        assertThat(testCreditFacility.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testCreditFacility.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testCreditFacility.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void createCreditFacilityWithExistingId() throws Exception {
        // Create the CreditFacility with an existing ID
        creditFacility.setId(1L);

        int databaseSizeBeforeCreate = creditFacilityRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCreditFacilityMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(creditFacility))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCreditFacilities() throws Exception {
        // Initialize the database
        creditFacilityRepository.saveAndFlush(creditFacility);

        // Get all the creditFacilityList
        restCreditFacilityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(creditFacility.getId().intValue())))
            .andExpect(jsonPath("$.[*].totalLimit").value(hasItem(DEFAULT_TOTAL_LIMIT.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getCreditFacility() throws Exception {
        // Initialize the database
        creditFacilityRepository.saveAndFlush(creditFacility);

        // Get the creditFacility
        restCreditFacilityMockMvc
            .perform(get(ENTITY_API_URL_ID, creditFacility.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(creditFacility.getId().intValue()))
            .andExpect(jsonPath("$.totalLimit").value(DEFAULT_TOTAL_LIMIT.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCreditFacility() throws Exception {
        // Get the creditFacility
        restCreditFacilityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCreditFacility() throws Exception {
        // Initialize the database
        creditFacilityRepository.saveAndFlush(creditFacility);

        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();

        // Update the creditFacility
        CreditFacility updatedCreditFacility = creditFacilityRepository.findById(creditFacility.getId()).get();
        // Disconnect from session so that the updates on updatedCreditFacility are not directly saved in db
        em.detach(updatedCreditFacility);
        updatedCreditFacility
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restCreditFacilityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCreditFacility.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCreditFacility))
            )
            .andExpect(status().isOk());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
        CreditFacility testCreditFacility = creditFacilityList.get(creditFacilityList.size() - 1);
        assertThat(testCreditFacility.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
        assertThat(testCreditFacility.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testCreditFacility.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testCreditFacility.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingCreditFacility() throws Exception {
        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();
        creditFacility.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditFacilityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, creditFacility.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(creditFacility))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCreditFacility() throws Exception {
        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();
        creditFacility.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditFacilityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(creditFacility))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCreditFacility() throws Exception {
        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();
        creditFacility.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditFacilityMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(creditFacility)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCreditFacilityWithPatch() throws Exception {
        // Initialize the database
        creditFacilityRepository.saveAndFlush(creditFacility);

        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();

        // Update the creditFacility using partial update
        CreditFacility partialUpdatedCreditFacility = new CreditFacility();
        partialUpdatedCreditFacility.setId(creditFacility.getId());

        partialUpdatedCreditFacility
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restCreditFacilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCreditFacility.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditFacility))
            )
            .andExpect(status().isOk());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
        CreditFacility testCreditFacility = creditFacilityList.get(creditFacilityList.size() - 1);
        assertThat(testCreditFacility.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
        assertThat(testCreditFacility.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testCreditFacility.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testCreditFacility.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateCreditFacilityWithPatch() throws Exception {
        // Initialize the database
        creditFacilityRepository.saveAndFlush(creditFacility);

        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();

        // Update the creditFacility using partial update
        CreditFacility partialUpdatedCreditFacility = new CreditFacility();
        partialUpdatedCreditFacility.setId(creditFacility.getId());

        partialUpdatedCreditFacility
            .totalLimit(UPDATED_TOTAL_LIMIT)
            .currency(UPDATED_CURRENCY)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restCreditFacilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCreditFacility.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditFacility))
            )
            .andExpect(status().isOk());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
        CreditFacility testCreditFacility = creditFacilityList.get(creditFacilityList.size() - 1);
        assertThat(testCreditFacility.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
        assertThat(testCreditFacility.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testCreditFacility.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testCreditFacility.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingCreditFacility() throws Exception {
        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();
        creditFacility.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditFacilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, creditFacility.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(creditFacility))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCreditFacility() throws Exception {
        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();
        creditFacility.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditFacilityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(creditFacility))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCreditFacility() throws Exception {
        int databaseSizeBeforeUpdate = creditFacilityRepository.findAll().size();
        creditFacility.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditFacilityMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(creditFacility))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CreditFacility in the database
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCreditFacility() throws Exception {
        // Initialize the database
        creditFacilityRepository.saveAndFlush(creditFacility);

        int databaseSizeBeforeDelete = creditFacilityRepository.findAll().size();

        // Delete the creditFacility
        restCreditFacilityMockMvc
            .perform(delete(ENTITY_API_URL_ID, creditFacility.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CreditFacility> creditFacilityList = creditFacilityRepository.findAll();
        assertThat(creditFacilityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
