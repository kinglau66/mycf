package com.king.mycf.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.king.mycf.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CreditFacilityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CreditFacility.class);
        CreditFacility creditFacility1 = new CreditFacility();
        creditFacility1.setId(1L);
        CreditFacility creditFacility2 = new CreditFacility();
        creditFacility2.setId(creditFacility1.getId());
        assertThat(creditFacility1).isEqualTo(creditFacility2);
        creditFacility2.setId(2L);
        assertThat(creditFacility1).isNotEqualTo(creditFacility2);
        creditFacility1.setId(null);
        assertThat(creditFacility1).isNotEqualTo(creditFacility2);
    }
}
