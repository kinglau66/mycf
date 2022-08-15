package com.king.mycf.repository;

import com.king.mycf.domain.CreditLimit;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CreditLimit entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CreditLimitRepository extends JpaRepository<CreditLimit, Long> {}
