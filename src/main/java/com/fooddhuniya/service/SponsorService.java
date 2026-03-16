package com.fooddhuniya.service;

import com.fooddhuniya.dto.SponsorRegistrationRequest;
import com.fooddhuniya.model.Sponsor;
import com.fooddhuniya.model.SponsorStatus;
import com.fooddhuniya.model.User;
import com.fooddhuniya.repository.SponsorRepository;
import com.fooddhuniya.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SponsorService {

    @Autowired
    private SponsorRepository sponsorRepository;

    @Autowired
    private UserRepository userRepository;

    public Sponsor registerSponsor(SponsorRegistrationRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Sponsor sponsor = new Sponsor();
        sponsor.setUser(user);
        sponsor.setBusinessName(request.getBusinessName());
        sponsor.setContactPerson(request.getContactPerson());
        sponsor.setEmail(request.getEmail());
        sponsor.setCategory(request.getCategory());
        sponsor.setLogoUrl(request.getLogoUrl());
        sponsor.setBannerUrl(request.getBannerUrl());
        sponsor.setDescription(request.getDescription());
        sponsor.setStatus(SponsorStatus.PENDING);

        return sponsorRepository.save(sponsor);
    }

    public List<Sponsor> getApprovedSponsors() {
        return sponsorRepository.findByStatus(SponsorStatus.APPROVED);
    }

    public Page<Sponsor> searchSponsors(String search, Pageable pageable) {
        if (search != null && !search.isEmpty()) {
            return sponsorRepository.findByBusinessNameContainingIgnoreCase(search, pageable);
        }
        return sponsorRepository.findAll(pageable);
    }

    public Sponsor getSponsorById(Long id) {
        return sponsorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sponsor not found"));
    }

    public Sponsor approveSponsor(Long id) {
        Sponsor sponsor = getSponsorById(id);
        sponsor.setStatus(SponsorStatus.APPROVED);
        return sponsorRepository.save(sponsor);
    }

    public Sponsor rejectSponsor(Long id) {
        Sponsor sponsor = getSponsorById(id);
        sponsor.setStatus(SponsorStatus.REJECTED);
        return sponsorRepository.save(sponsor);
    }

    public List<Sponsor> getAllSponsorsByUserId(Long userId) {
        return sponsorRepository.findAllByUserId(userId);
    }

    public void deleteSponsor(Long id) {
        sponsorRepository.deleteById(id);
    }
}
