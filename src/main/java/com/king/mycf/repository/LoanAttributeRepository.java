package com.king.mycf.repository;

import com.king.mycf.domain.LoanAttribute;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LoanAttribute entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoanAttributeRepository extends JpaRepository<LoanAttribute, Long> {}
