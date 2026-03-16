package com.fooddhuniya.repository;

import com.fooddhuniya.model.WebsiteContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WebsiteContentRepository extends JpaRepository<WebsiteContent, Long> {
    List<WebsiteContent> findByPageSection(String pageSection);
    Optional<WebsiteContent> findByPageSectionAndContentKey(String pageSection, String contentKey);
}
