package com.king.mycf.repository;

import com.king.mycf.domain.LoanRequirement;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LoanRequirement entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoanRequirementRepository extends JpaRepository<LoanRequirement, Long> {}
