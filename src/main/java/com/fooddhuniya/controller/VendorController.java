package com.fooddhuniya.controller;

import com.fooddhuniya.dto.MessageResponse;
import com.fooddhuniya.dto.VendorRegistrationRequest;
import com.fooddhuniya.model.Vendor;
import com.fooddhuniya.model.VendorStatus;
import com.fooddhuniya.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    @Autowired
    private VendorService vendorService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('VENDOR') or hasRole('ADMIN')")
    public ResponseEntity<?> registerVendor(@Valid @RequestBody VendorRegistrationRequest request) {
        vendorService.registerVendor(request);
        return ResponseEntity.ok(new MessageResponse("Vendor registered successfully and is pending approval."));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('VENDOR')")
    public ResponseEntity<java.util.List<Vendor>> getMyVendorProfiles(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.fooddhuniya.security.UserDetailsImpl userDetails) {
        return ResponseEntity.ok(vendorService.getAllVendorsByUserId(userDetails.getId()));
    }

    @GetMapping("/")
    public ResponseEntity<Page<Vendor>> getApprovedVendors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(vendorService.getApprovedVendors(PageRequest.of(page, size)));
    }

    @GetMapping("/admin/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Vendor>> adminSearchVendors(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(vendorService.searchVendors(search, PageRequest.of(page, size)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id) {
        return ResponseEntity.ok(vendorService.getVendorById(id));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveVendor(@PathVariable Long id, @RequestParam(required = false) String stallNumber) {
        vendorService.approveVendor(id, stallNumber);
        return ResponseEntity.ok(new MessageResponse("Vendor approved successfully."));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectVendor(@PathVariable Long id) {
        vendorService.rejectVendor(id);
        return ResponseEntity.ok(new MessageResponse("Vendor rejected."));
    }

    @PutMapping("/{id}/stall-number")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStallNumber(@PathVariable Long id, @RequestParam String stallNumber) {
        vendorService.updateStallNumber(id, stallNumber);
        return ResponseEntity.ok(new MessageResponse("Stall number updated."));
    }

    @PutMapping("/{id}/payment-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        vendorService.updatePaymentStatus(id, status);
        return ResponseEntity.ok(new MessageResponse("Payment status updated."));
    }

    @PostMapping("/admin/bulk-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkUpdateStatus(@RequestBody BulkStatusUpdateRequest request) {
        vendorService.bulkUpdateStatus(request.getIds(), request.getStatus());
        return ResponseEntity.ok(new MessageResponse("Bulk update successful."));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id) {
        vendorService.deleteVendor(id);
        return ResponseEntity.ok(new MessageResponse("Vendor deleted successfully."));
    }

    // Helper DTO for bulk update
    public static class BulkStatusUpdateRequest {
        private List<Long> ids;
        private VendorStatus status;
        public List<Long> getIds() { return ids; }
        public void setIds(List<Long> ids) { this.ids = ids; }
        public VendorStatus getStatus() { return status; }
        public void setStatus(VendorStatus status) { this.status = status; }
    }
}
