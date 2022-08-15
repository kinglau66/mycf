package com.king.mycf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.king.mycf.IntegrationTest;
import com.king.mycf.domain.CreditLimit;
import com.king.mycf.domain.enumeration.LoanType;
import com.king.mycf.repository.CreditLimitRepository;
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
 * Integration tests for the {@link CreditLimitResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CreditLimitResourceIT {

    private static final LoanType DEFAULT_TYPE = LoanType.CAR;
    private static final LoanType UPDATED_TYPE = LoanType.ENGLISH;

    private static final Long DEFAULT_TOTAL_LIMIT = 1L;
    private static final Long UPDATED_TOTAL_LIMIT = 2L;

    private static final String ENTITY_API_URL = "/api/credit-limits";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CreditLimitRepository creditLimitRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCreditLimitMockMvc;

    private CreditLimit creditLimit;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditLimit createEntity(EntityManager em) {
        CreditLimit creditLimit = new CreditLimit().type(DEFAULT_TYPE).totalLimit(DEFAULT_TOTAL_LIMIT);
        return creditLimit;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CreditLimit createUpdatedEntity(EntityManager em) {
        CreditLimit creditLimit = new CreditLimit().type(UPDATED_TYPE).totalLimit(UPDATED_TOTAL_LIMIT);
        return creditLimit;
    }

    @BeforeEach
    public void initTest() {
        creditLimit = createEntity(em);
    }

    @Test
    @Transactional
    void createCreditLimit() throws Exception {
        int databaseSizeBeforeCreate = creditLimitRepository.findAll().size();
        // Create the CreditLimit
        restCreditLimitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(creditLimit)))
            .andExpect(status().isCreated());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeCreate + 1);
        CreditLimit testCreditLimit = creditLimitList.get(creditLimitList.size() - 1);
        assertThat(testCreditLimit.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCreditLimit.getTotalLimit()).isEqualTo(DEFAULT_TOTAL_LIMIT);
    }

    @Test
    @Transactional
    void createCreditLimitWithExistingId() throws Exception {
        // Create the CreditLimit with an existing ID
        creditLimit.setId(1L);

        int databaseSizeBeforeCreate = creditLimitRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCreditLimitMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(creditLimit)))
            .andExpect(status().isBadRequest());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCreditLimits() throws Exception {
        // Initialize the database
        creditLimitRepository.saveAndFlush(creditLimit);

        // Get all the creditLimitList
        restCreditLimitMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(creditLimit.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE.toString())))
            .andExpect(jsonPath("$.[*].totalLimit").value(hasItem(DEFAULT_TOTAL_LIMIT.intValue())));
    }

    @Test
    @Transactional
    void getCreditLimit() throws Exception {
        // Initialize the database
        creditLimitRepository.saveAndFlush(creditLimit);

        // Get the creditLimit
        restCreditLimitMockMvc
            .perform(get(ENTITY_API_URL_ID, creditLimit.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(creditLimit.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE.toString()))
            .andExpect(jsonPath("$.totalLimit").value(DEFAULT_TOTAL_LIMIT.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingCreditLimit() throws Exception {
        // Get the creditLimit
        restCreditLimitMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCreditLimit() throws Exception {
        // Initialize the database
        creditLimitRepository.saveAndFlush(creditLimit);

        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();

        // Update the creditLimit
        CreditLimit updatedCreditLimit = creditLimitRepository.findById(creditLimit.getId()).get();
        // Disconnect from session so that the updates on updatedCreditLimit are not directly saved in db
        em.detach(updatedCreditLimit);
        updatedCreditLimit.type(UPDATED_TYPE).totalLimit(UPDATED_TOTAL_LIMIT);

        restCreditLimitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCreditLimit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCreditLimit))
            )
            .andExpect(status().isOk());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
        CreditLimit testCreditLimit = creditLimitList.get(creditLimitList.size() - 1);
        assertThat(testCreditLimit.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCreditLimit.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
    }

    @Test
    @Transactional
    void putNonExistingCreditLimit() throws Exception {
        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();
        creditLimit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditLimitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, creditLimit.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(creditLimit))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCreditLimit() throws Exception {
        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();
        creditLimit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditLimitMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(creditLimit))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCreditLimit() throws Exception {
        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();
        creditLimit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditLimitMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(creditLimit)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCreditLimitWithPatch() throws Exception {
        // Initialize the database
        creditLimitRepository.saveAndFlush(creditLimit);

        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();

        // Update the creditLimit using partial update
        CreditLimit partialUpdatedCreditLimit = new CreditLimit();
        partialUpdatedCreditLimit.setId(creditLimit.getId());

        restCreditLimitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCreditLimit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditLimit))
            )
            .andExpect(status().isOk());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
        CreditLimit testCreditLimit = creditLimitList.get(creditLimitList.size() - 1);
        assertThat(testCreditLimit.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testCreditLimit.getTotalLimit()).isEqualTo(DEFAULT_TOTAL_LIMIT);
    }

    @Test
    @Transactional
    void fullUpdateCreditLimitWithPatch() throws Exception {
        // Initialize the database
        creditLimitRepository.saveAndFlush(creditLimit);

        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();

        // Update the creditLimit using partial update
        CreditLimit partialUpdatedCreditLimit = new CreditLimit();
        partialUpdatedCreditLimit.setId(creditLimit.getId());

        partialUpdatedCreditLimit.type(UPDATED_TYPE).totalLimit(UPDATED_TOTAL_LIMIT);

        restCreditLimitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCreditLimit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCreditLimit))
            )
            .andExpect(status().isOk());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
        CreditLimit testCreditLimit = creditLimitList.get(creditLimitList.size() - 1);
        assertThat(testCreditLimit.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testCreditLimit.getTotalLimit()).isEqualTo(UPDATED_TOTAL_LIMIT);
    }

    @Test
    @Transactional
    void patchNonExistingCreditLimit() throws Exception {
        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();
        creditLimit.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCreditLimitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, creditLimit.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(creditLimit))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCreditLimit() throws Exception {
        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();
        creditLimit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditLimitMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(creditLimit))
            )
            .andExpect(status().isBadRequest());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCreditLimit() throws Exception {
        int databaseSizeBeforeUpdate = creditLimitRepository.findAll().size();
        creditLimit.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCreditLimitMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(creditLimit))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CreditLimit in the database
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCreditLimit() throws Exception {
        // Initialize the database
        creditLimitRepository.saveAndFlush(creditLimit);

        int databaseSizeBeforeDelete = creditLimitRepository.findAll().size();

        // Delete the creditLimit
        restCreditLimitMockMvc
            .perform(delete(ENTITY_API_URL_ID, creditLimit.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CreditLimit> creditLimitList = creditLimitRepository.findAll();
        assertThat(creditLimitList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
