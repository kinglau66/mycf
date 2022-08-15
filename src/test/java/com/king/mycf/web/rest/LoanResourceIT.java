package com.king.mycf.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.king.mycf.IntegrationTest;
import com.king.mycf.domain.Loan;
import com.king.mycf.repository.LoanRepository;
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
 * Integration tests for the {@link LoanResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LoanResourceIT {

    private static final Long DEFAULT_AMOUNT = 1L;
    private static final Long UPDATED_AMOUNT = 2L;

    private static final String DEFAULT_CURRENCY = "AAAAAAAAAA";
    private static final String UPDATED_CURRENCY = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Double DEFAULT_INTEREST_RATE = 1D;
    private static final Double UPDATED_INTEREST_RATE = 2D;

    private static final String ENTITY_API_URL = "/api/loans";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LoanRepository loanRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLoanMockMvc;

    private Loan loan;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Loan createEntity(EntityManager em) {
        Loan loan = new Loan()
            .amount(DEFAULT_AMOUNT)
            .currency(DEFAULT_CURRENCY)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .interestRate(DEFAULT_INTEREST_RATE);
        return loan;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Loan createUpdatedEntity(EntityManager em) {
        Loan loan = new Loan()
            .amount(UPDATED_AMOUNT)
            .currency(UPDATED_CURRENCY)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .interestRate(UPDATED_INTEREST_RATE);
        return loan;
    }

    @BeforeEach
    public void initTest() {
        loan = createEntity(em);
    }

    @Test
    @Transactional
    void createLoan() throws Exception {
        int databaseSizeBeforeCreate = loanRepository.findAll().size();
        // Create the Loan
        restLoanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loan)))
            .andExpect(status().isCreated());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeCreate + 1);
        Loan testLoan = loanList.get(loanList.size() - 1);
        assertThat(testLoan.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testLoan.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testLoan.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testLoan.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testLoan.getInterestRate()).isEqualTo(DEFAULT_INTEREST_RATE);
    }

    @Test
    @Transactional
    void createLoanWithExistingId() throws Exception {
        // Create the Loan with an existing ID
        loan.setId(1L);

        int databaseSizeBeforeCreate = loanRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLoanMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loan)))
            .andExpect(status().isBadRequest());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllLoans() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        // Get all the loanList
        restLoanMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(loan.getId().intValue())))
            .andExpect(jsonPath("$.[*].amount").value(hasItem(DEFAULT_AMOUNT.intValue())))
            .andExpect(jsonPath("$.[*].currency").value(hasItem(DEFAULT_CURRENCY)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].interestRate").value(hasItem(DEFAULT_INTEREST_RATE.doubleValue())));
    }

    @Test
    @Transactional
    void getLoan() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        // Get the loan
        restLoanMockMvc
            .perform(get(ENTITY_API_URL_ID, loan.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(loan.getId().intValue()))
            .andExpect(jsonPath("$.amount").value(DEFAULT_AMOUNT.intValue()))
            .andExpect(jsonPath("$.currency").value(DEFAULT_CURRENCY))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.interestRate").value(DEFAULT_INTEREST_RATE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingLoan() throws Exception {
        // Get the loan
        restLoanMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewLoan() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        int databaseSizeBeforeUpdate = loanRepository.findAll().size();

        // Update the loan
        Loan updatedLoan = loanRepository.findById(loan.getId()).get();
        // Disconnect from session so that the updates on updatedLoan are not directly saved in db
        em.detach(updatedLoan);
        updatedLoan
            .amount(UPDATED_AMOUNT)
            .currency(UPDATED_CURRENCY)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .interestRate(UPDATED_INTEREST_RATE);

        restLoanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLoan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLoan))
            )
            .andExpect(status().isOk());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
        Loan testLoan = loanList.get(loanList.size() - 1);
        assertThat(testLoan.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testLoan.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testLoan.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLoan.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLoan.getInterestRate()).isEqualTo(UPDATED_INTEREST_RATE);
    }

    @Test
    @Transactional
    void putNonExistingLoan() throws Exception {
        int databaseSizeBeforeUpdate = loanRepository.findAll().size();
        loan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, loan.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLoan() throws Exception {
        int databaseSizeBeforeUpdate = loanRepository.findAll().size();
        loan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(loan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLoan() throws Exception {
        int databaseSizeBeforeUpdate = loanRepository.findAll().size();
        loan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(loan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLoanWithPatch() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        int databaseSizeBeforeUpdate = loanRepository.findAll().size();

        // Update the loan using partial update
        Loan partialUpdatedLoan = new Loan();
        partialUpdatedLoan.setId(loan.getId());

        partialUpdatedLoan.startDate(UPDATED_START_DATE).interestRate(UPDATED_INTEREST_RATE);

        restLoanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoan))
            )
            .andExpect(status().isOk());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
        Loan testLoan = loanList.get(loanList.size() - 1);
        assertThat(testLoan.getAmount()).isEqualTo(DEFAULT_AMOUNT);
        assertThat(testLoan.getCurrency()).isEqualTo(DEFAULT_CURRENCY);
        assertThat(testLoan.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLoan.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testLoan.getInterestRate()).isEqualTo(UPDATED_INTEREST_RATE);
    }

    @Test
    @Transactional
    void fullUpdateLoanWithPatch() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        int databaseSizeBeforeUpdate = loanRepository.findAll().size();

        // Update the loan using partial update
        Loan partialUpdatedLoan = new Loan();
        partialUpdatedLoan.setId(loan.getId());

        partialUpdatedLoan
            .amount(UPDATED_AMOUNT)
            .currency(UPDATED_CURRENCY)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .interestRate(UPDATED_INTEREST_RATE);

        restLoanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLoan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLoan))
            )
            .andExpect(status().isOk());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
        Loan testLoan = loanList.get(loanList.size() - 1);
        assertThat(testLoan.getAmount()).isEqualTo(UPDATED_AMOUNT);
        assertThat(testLoan.getCurrency()).isEqualTo(UPDATED_CURRENCY);
        assertThat(testLoan.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testLoan.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testLoan.getInterestRate()).isEqualTo(UPDATED_INTEREST_RATE);
    }

    @Test
    @Transactional
    void patchNonExistingLoan() throws Exception {
        int databaseSizeBeforeUpdate = loanRepository.findAll().size();
        loan.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLoanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, loan.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLoan() throws Exception {
        int databaseSizeBeforeUpdate = loanRepository.findAll().size();
        loan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(loan))
            )
            .andExpect(status().isBadRequest());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLoan() throws Exception {
        int databaseSizeBeforeUpdate = loanRepository.findAll().size();
        loan.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLoanMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(loan)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Loan in the database
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLoan() throws Exception {
        // Initialize the database
        loanRepository.saveAndFlush(loan);

        int databaseSizeBeforeDelete = loanRepository.findAll().size();

        // Delete the loan
        restLoanMockMvc
            .perform(delete(ENTITY_API_URL_ID, loan.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Loan> loanList = loanRepository.findAll();
        assertThat(loanList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
