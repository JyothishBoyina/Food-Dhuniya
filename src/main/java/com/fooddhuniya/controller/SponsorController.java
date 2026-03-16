package com.fooddhuniya.controller;

import com.fooddhuniya.dto.MessageResponse;
import com.fooddhuniya.dto.SponsorRegistrationRequest;
import com.fooddhuniya.model.Sponsor;
import com.fooddhuniya.service.SponsorService;
import com.fooddhuniya.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/sponsors")
public class SponsorController {

    @Autowired
    private SponsorService sponsorService;

    @PostMapping("/register")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN', 'SPONSOR')")
    public ResponseEntity<?> registerSponsor(@Valid @RequestBody SponsorRegistrationRequest request) {
        sponsorService.registerSponsor(request);
        return ResponseEntity.ok(new MessageResponse("Sponsor registration submitted successfully and is pending approval."));
    }

    @GetMapping("/me")
    @PreAuthorize("hasAnyRole('VENDOR', 'SPONSOR')")
    public ResponseEntity<?> getMySponsorships(
            @org.springframework.security.core.annotation.AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<Sponsor> sponsors = sponsorService.getAllSponsorsByUserId(userDetails.getId());
        if (sponsors.isEmpty()) {
            return ResponseEntity.notFound().build(); // 404 will be ignored by frontend
        }
        return ResponseEntity.ok(sponsors.get(0)); // Frontend expects a single object
    }

    @GetMapping("/")
    public ResponseEntity<List<Sponsor>> getApprovedSponsors() {
        return ResponseEntity.ok(sponsorService.getApprovedSponsors());
    }

    @GetMapping("/admin/list")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Sponsor>> adminSearchSponsors(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(sponsorService.searchSponsors(search, PageRequest.of(page, size)));
    }

    @PutMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveSponsor(@PathVariable Long id) {
        sponsorService.approveSponsor(id);
        return ResponseEntity.ok(new MessageResponse("Sponsor approved successfully"));
    }

    @PutMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectSponsor(@PathVariable Long id) {
        sponsorService.rejectSponsor(id);
        return ResponseEntity.ok(new MessageResponse("Sponsor rejected successfully"));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSponsor(@PathVariable Long id) {
        sponsorService.deleteSponsor(id);
        return ResponseEntity.ok(new MessageResponse("Sponsor deleted successfully"));
    }
}
