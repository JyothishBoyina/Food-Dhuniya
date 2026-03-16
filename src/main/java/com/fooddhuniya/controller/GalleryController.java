package com.fooddhuniya.controller;

import com.fooddhuniya.dto.MessageResponse;
import com.fooddhuniya.model.Gallery;
import com.fooddhuniya.repository.GalleryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/gallery")
public class GalleryController {

    @Autowired
    private GalleryRepository galleryRepository;

    @GetMapping("/")
    public ResponseEntity<Page<Gallery>> getGallery(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(galleryRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size)));
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Gallery> addMedia(@RequestBody Gallery gallery) {
        return ResponseEntity.ok(galleryRepository.save(gallery));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMedia(@PathVariable Long id) {
        if (!galleryRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Media not found"));
        }
        galleryRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Media deleted successfully"));
    }
}
