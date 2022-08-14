package com.king.mycf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.king.mycf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LoanRequirementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LoanRequirement.class);
        LoanRequirement loanRequirement1 = new LoanRequirement();
        loanRequirement1.setId(1L);
        LoanRequirement loanRequirement2 = new LoanRequirement();
        loanRequirement2.setId(loanRequirement1.getId());
        assertThat(loanRequirement1).isEqualTo(loanRequirement2);
        loanRequirement2.setId(2L);
        assertThat(loanRequirement1).isNotEqualTo(loanRequirement2);
        loanRequirement1.setId(null);
        assertThat(loanRequirement1).isNotEqualTo(loanRequirement2);
    }
}
