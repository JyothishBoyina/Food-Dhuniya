package com.fooddhuniya.controller;

import com.fooddhuniya.dto.MessageResponse;
import com.fooddhuniya.model.WebsiteContent;
import com.fooddhuniya.repository.WebsiteContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/content")
public class WebsiteContentController {

    @Autowired
    private WebsiteContentRepository contentRepository;

    @GetMapping("/{section}")
    public ResponseEntity<List<WebsiteContent>> getContentBySection(@PathVariable String section) {
        return ResponseEntity.ok(contentRepository.findByPageSection(section));
    }

    @GetMapping("/{section}/{key}")
    public ResponseEntity<?> getContentByKey(@PathVariable String section, @PathVariable String key) {
        Optional<WebsiteContent> content = contentRepository.findByPageSectionAndContentKey(section, key);
        if (content.isPresent()) {
            return ResponseEntity.ok(content.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateContent(@RequestBody WebsiteContent content) {
        Optional<WebsiteContent> existing = contentRepository.findByPageSectionAndContentKey(
                content.getPageSection(), content.getContentKey());
        
        if (existing.isPresent()) {
            WebsiteContent updated = existing.get();
            updated.setContentValue(content.getContentValue());
            return ResponseEntity.ok(contentRepository.save(updated));
        } else {
            return ResponseEntity.ok(contentRepository.save(content));
        }
    }

    @PostMapping("/bulk-update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> bulkUpdate(@RequestBody List<WebsiteContent> contents) {
        for (WebsiteContent content : contents) {
            Optional<WebsiteContent> existing = contentRepository.findByPageSectionAndContentKey(
                    content.getPageSection(), content.getContentKey());
            if (existing.isPresent()) {
                WebsiteContent updated = existing.get();
                updated.setContentValue(content.getContentValue());
                contentRepository.save(updated);
            } else {
                contentRepository.save(content);
            }
        }
        return ResponseEntity.ok(new MessageResponse("Bulk update successful"));
    }
}
