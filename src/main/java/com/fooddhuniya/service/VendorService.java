package com.fooddhuniya.service;

import com.fooddhuniya.dto.VendorRegistrationRequest;
import com.fooddhuniya.model.User;
import com.fooddhuniya.model.Vendor;
import com.fooddhuniya.model.VendorStatus;
import com.fooddhuniya.repository.UserRepository;
import com.fooddhuniya.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class VendorService {

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private UserRepository userRepository;

    public Vendor registerVendor(VendorRegistrationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Vendor vendor = new Vendor();
        vendor.setUser(user);
        vendor.setBusinessName(request.getBusinessName());
        vendor.setContactPerson(request.getContactPerson());
        vendor.setPhone(request.getPhone());
        vendor.setEmail(request.getEmail());
        vendor.setCuisineType(request.getCuisineType());
        vendor.setMenuItems(request.getMenuItems());
        vendor.setFssaiLicense(request.getFssaiLicense());
        vendor.setStallType(request.getStallType());
        vendor.setLogoUrl(request.getLogoUrl());
        vendor.setStatus(VendorStatus.PENDING);

        return vendorRepository.save(vendor);
    }

    public Page<Vendor> getApprovedVendors(Pageable pageable) {
        return vendorRepository.findByStatus(VendorStatus.APPROVED, pageable);
    }

    public Page<Vendor> searchVendors(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return vendorRepository.findByBusinessNameContainingIgnoreCase(search, pageable);
        }
        return vendorRepository.findAll(pageable);
    }

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vendor not found"));
    }

    public Vendor approveVendor(Long id, String stallNumber) {
        Vendor vendor = getVendorById(id);
        vendor.setStatus(VendorStatus.APPROVED);
        if (stallNumber != null) {
            vendor.setStallNumber(stallNumber);
        }
        return vendorRepository.save(vendor);
    }

    public Vendor rejectVendor(Long id) {
        Vendor vendor = getVendorById(id);
        vendor.setStatus(VendorStatus.REJECTED);
        return vendorRepository.save(vendor);
    }

    public Vendor updateStallNumber(Long id, String stallNumber) {
        Vendor vendor = getVendorById(id);
        vendor.setStallNumber(stallNumber);
        return vendorRepository.save(vendor);
    }

    public Vendor updatePaymentStatus(Long id, String paymentStatus) {
        Vendor vendor = getVendorById(id);
        vendor.setPaymentStatus(paymentStatus);
        return vendorRepository.save(vendor);
    }

    public java.util.List<Vendor> getAllVendorsByUserId(Long userId) {
        return vendorRepository.findAllByUserId(userId);
    }

    public Vendor getVendorByUserId(Long userId) {
        java.util.List<Vendor> list = vendorRepository.findAllByUserId(userId);
        return list.isEmpty() ? null : list.get(0);
    }

    public void bulkUpdateStatus(java.util.List<Long> ids, VendorStatus status) {
        java.util.List<Vendor> vendors = vendorRepository.findAllById(ids);
        vendors.forEach(v -> v.setStatus(status));
        vendorRepository.saveAll(vendors);
    }

    public void deleteVendor(Long id) {
        vendorRepository.deleteById(id);
    }
}
