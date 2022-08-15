package com.king.mycf.repository;

import com.king.mycf.domain.CreditFacility;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CreditFacility entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CreditFacilityRepository extends JpaRepository<CreditFacility, Long> {}
