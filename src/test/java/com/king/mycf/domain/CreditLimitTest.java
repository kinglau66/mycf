package com.king.mycf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.king.mycf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CreditLimitTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CreditLimit.class);
        CreditLimit creditLimit1 = new CreditLimit();
        creditLimit1.setId(1L);
        CreditLimit creditLimit2 = new CreditLimit();
        creditLimit2.setId(creditLimit1.getId());
        assertThat(creditLimit1).isEqualTo(creditLimit2);
        creditLimit2.setId(2L);
        assertThat(creditLimit1).isNotEqualTo(creditLimit2);
        creditLimit1.setId(null);
        assertThat(creditLimit1).isNotEqualTo(creditLimit2);
    }
}
