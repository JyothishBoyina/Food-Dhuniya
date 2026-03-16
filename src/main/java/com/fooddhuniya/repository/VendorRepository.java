package com.fooddhuniya.repository;

import com.fooddhuniya.model.Vendor;
import com.fooddhuniya.model.VendorStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    Page<Vendor> findByStatus(VendorStatus status, Pageable pageable);

    Page<Vendor> findByBusinessNameContainingIgnoreCase(String businessName, Pageable pageable);

    java.util.List<Vendor> findAllByUserId(Long userId);
}
