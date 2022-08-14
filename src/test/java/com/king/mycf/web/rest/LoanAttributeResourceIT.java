package com.king.mycf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.king.mycf.IntegrationTest;
import com.king.mycf.domain.LoanAttribute;
import com.king.mycf.repository.LoanAttributeRepository;
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
 * Integration tests for the {@link LoanAttributeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LoanAttributeResourceIT {

    private static final String DEFAULT_JOB_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_JOB_TITLE = "BBBBBBBBBB";

    private static final Long DEFAULT_MIN_SALARY = 1L;
    private static final Long UPDATED_MIN_SALARY = 2L;

    private static final Long DEFAULT_MAX_SALARY = 1L;
    private static final Long UPDATED_MAX_SALARY = 2L;

    private static final String ENTITY_API_URL = "/api/loan-attributes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LoanAttributeRepository loanAttributeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoanAttributeMockMvc;

    private LoanAttribute loanAttribute;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoanAttribute createEntity(EntityManager em) {
        LoanAttribute loanAttribute = new LoanAttribute()
            .jobTitle(DEFAULT_JOB_TITLE)
            .minSalary(DEFAULT_MIN_SALARY)
            .maxSalary(DEFAULT_MAX_SALARY);
        return loanAttribute;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LoanAttribute createUpdatedEntity(EntityManager em) {
        LoanAttribute loanAttribute = new LoanAttribute()
            .jobTitle(UPDATED_JOB_TITLE)
            .minSalary(UPDATED_MIN_SALARY)
            .maxSalary(UPDATED_MAX_SALARY);
        return loanAttribute;
    }

    @BeforeEach
    public void initTest() {
        loanAttribute = createEntity(em);
    }

    @Test
    @Transactional
    void createLoanAttribute() throws Exception {
        int databaseSizeBeforeCreate = loanAttributeRepository.findAll().size();
        // Create the LoanAttribute
        restLoanAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loanAttribute)))
            .andExpect(status().isCreated());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeCreate + 1);
        LoanAttribute testLoanAttribute = loanAttributeList.get(loanAttributeList.size() - 1);
        assertThat(testLoanAttribute.getJobTitle()).isEqualTo(DEFAULT_JOB_TITLE);
        assertThat(testLoanAttribute.getMinSalary()).isEqualTo(DEFAULT_MIN_SALARY);
        assertThat(testLoanAttribute.getMaxSalary()).isEqualTo(DEFAULT_MAX_SALARY);
    }

    @Test
    @Transactional
    void createLoanAttributeWithExistingId() throws Exception {
        // Create the LoanAttribute with an existing ID
        loanAttribute.setId(1L);

        int databaseSizeBeforeCreate = loanAttributeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoanAttributeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loanAttribute)))
            .andExpect(status().isBadRequest());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLoanAttributes() throws Exception {
        // Initialize the database
        loanAttributeRepository.saveAndFlush(loanAttribute);

        // Get all the loanAttributeList
        restLoanAttributeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loanAttribute.getId().intValue())))
            .andExpect(jsonPath("$.[*].jobTitle").value(hasItem(DEFAULT_JOB_TITLE)))
            .andExpect(jsonPath("$.[*].minSalary").value(hasItem(DEFAULT_MIN_SALARY.intValue())))
            .andExpect(jsonPath("$.[*].maxSalary").value(hasItem(DEFAULT_MAX_SALARY.intValue())));
    }

    @Test
    @Transactional
    void getLoanAttribute() throws Exception {
        // Initialize the database
        loanAttributeRepository.saveAndFlush(loanAttribute);

        // Get the loanAttribute
        restLoanAttributeMockMvc
            .perform(get(ENTITY_API_URL_ID, loanAttribute.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(loanAttribute.getId().intValue()))
            .andExpect(jsonPath("$.jobTitle").value(DEFAULT_JOB_TITLE))
            .andExpect(jsonPath("$.minSalary").value(DEFAULT_MIN_SALARY.intValue()))
            .andExpect(jsonPath("$.maxSalary").value(DEFAULT_MAX_SALARY.intValue()));
    }

    @Test
    @Transactional
    void getNonExistingLoanAttribute() throws Exception {
        // Get the loanAttribute
        restLoanAttributeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLoanAttribute() throws Exception {
        // Initialize the database
        loanAttributeRepository.saveAndFlush(loanAttribute);

        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();

        // Update the loanAttribute
        LoanAttribute updatedLoanAttribute = loanAttributeRepository.findById(loanAttribute.getId()).get();
        // Disconnect from session so that the updates on updatedLoanAttribute are not directly saved in db
        em.detach(updatedLoanAttribute);
        updatedLoanAttribute.jobTitle(UPDATED_JOB_TITLE).minSalary(UPDATED_MIN_SALARY).maxSalary(UPDATED_MAX_SALARY);

        restLoanAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLoanAttribute.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLoanAttribute))
            )
            .andExpect(status().isOk());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
        LoanAttribute testLoanAttribute = loanAttributeList.get(loanAttributeList.size() - 1);
        assertThat(testLoanAttribute.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testLoanAttribute.getMinSalary()).isEqualTo(UPDATED_MIN_SALARY);
        assertThat(testLoanAttribute.getMaxSalary()).isEqualTo(UPDATED_MAX_SALARY);
    }

    @Test
    @Transactional
    void putNonExistingLoanAttribute() throws Exception {
        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();
        loanAttribute.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoanAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, loanAttribute.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loanAttribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLoanAttribute() throws Exception {
        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();
        loanAttribute.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanAttributeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loanAttribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLoanAttribute() throws Exception {
        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();
        loanAttribute.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanAttributeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loanAttribute)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoanAttributeWithPatch() throws Exception {
        // Initialize the database
        loanAttributeRepository.saveAndFlush(loanAttribute);

        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();

        // Update the loanAttribute using partial update
        LoanAttribute partialUpdatedLoanAttribute = new LoanAttribute();
        partialUpdatedLoanAttribute.setId(loanAttribute.getId());

        partialUpdatedLoanAttribute.jobTitle(UPDATED_JOB_TITLE).minSalary(UPDATED_MIN_SALARY);

        restLoanAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoanAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoanAttribute))
            )
            .andExpect(status().isOk());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
        LoanAttribute testLoanAttribute = loanAttributeList.get(loanAttributeList.size() - 1);
        assertThat(testLoanAttribute.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testLoanAttribute.getMinSalary()).isEqualTo(UPDATED_MIN_SALARY);
        assertThat(testLoanAttribute.getMaxSalary()).isEqualTo(DEFAULT_MAX_SALARY);
    }

    @Test
    @Transactional
    void fullUpdateLoanAttributeWithPatch() throws Exception {
        // Initialize the database
        loanAttributeRepository.saveAndFlush(loanAttribute);

        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();

        // Update the loanAttribute using partial update
        LoanAttribute partialUpdatedLoanAttribute = new LoanAttribute();
        partialUpdatedLoanAttribute.setId(loanAttribute.getId());

        partialUpdatedLoanAttribute.jobTitle(UPDATED_JOB_TITLE).minSalary(UPDATED_MIN_SALARY).maxSalary(UPDATED_MAX_SALARY);

        restLoanAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoanAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoanAttribute))
            )
            .andExpect(status().isOk());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
        LoanAttribute testLoanAttribute = loanAttributeList.get(loanAttributeList.size() - 1);
        assertThat(testLoanAttribute.getJobTitle()).isEqualTo(UPDATED_JOB_TITLE);
        assertThat(testLoanAttribute.getMinSalary()).isEqualTo(UPDATED_MIN_SALARY);
        assertThat(testLoanAttribute.getMaxSalary()).isEqualTo(UPDATED_MAX_SALARY);
    }

    @Test
    @Transactional
    void patchNonExistingLoanAttribute() throws Exception {
        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();
        loanAttribute.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoanAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, loanAttribute.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loanAttribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLoanAttribute() throws Exception {
        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();
        loanAttribute.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loanAttribute))
            )
            .andExpect(status().isBadRequest());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLoanAttribute() throws Exception {
        int databaseSizeBeforeUpdate = loanAttributeRepository.findAll().size();
        loanAttribute.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanAttributeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(loanAttribute))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LoanAttribute in the database
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLoanAttribute() throws Exception {
        // Initialize the database
        loanAttributeRepository.saveAndFlush(loanAttribute);

        int databaseSizeBeforeDelete = loanAttributeRepository.findAll().size();

        // Delete the loanAttribute
        restLoanAttributeMockMvc
            .perform(delete(ENTITY_API_URL_ID, loanAttribute.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LoanAttribute> loanAttributeList = loanAttributeRepository.findAll();
        assertThat(loanAttributeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
