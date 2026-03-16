package com.fooddhuniya.repository;

import com.fooddhuniya.model.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.fooddhuniya.model.SponsorStatus;

@Repository
public interface SponsorRepository extends JpaRepository<Sponsor, Long> {
    List<Sponsor> findAllByUserId(Long userId);
    List<Sponsor> findByStatus(SponsorStatus status);
    Page<Sponsor> findByBusinessNameContainingIgnoreCase(String businessName, Pageable pageable);
}
