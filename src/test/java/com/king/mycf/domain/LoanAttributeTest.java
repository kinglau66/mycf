package com.king.mycf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.king.mycf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LoanAttributeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LoanAttribute.class);
        LoanAttribute loanAttribute1 = new LoanAttribute();
        loanAttribute1.setId(1L);
        LoanAttribute loanAttribute2 = new LoanAttribute();
        loanAttribute2.setId(loanAttribute1.getId());
        assertThat(loanAttribute1).isEqualTo(loanAttribute2);
        loanAttribute2.setId(2L);
        assertThat(loanAttribute1).isNotEqualTo(loanAttribute2);
        loanAttribute1.setId(null);
        assertThat(loanAttribute1).isNotEqualTo(loanAttribute2);
    }
}
