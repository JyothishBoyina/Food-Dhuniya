package com.fooddhuniya.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "website_contents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WebsiteContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "page_section", nullable = false)
    private String pageSection;

    @Column(name = "content_key", nullable = false)
    private String contentKey;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String contentValue;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
