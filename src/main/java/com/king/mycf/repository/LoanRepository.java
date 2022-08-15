package com.king.mycf.repository;

import com.king.mycf.domain.Loan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Loan entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    Page<Loan> findAllByApplicant_User_Login(String login, Pageable pageable);
}
