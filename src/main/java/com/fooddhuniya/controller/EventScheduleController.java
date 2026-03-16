package com.fooddhuniya.controller;

import com.fooddhuniya.dto.MessageResponse;
import com.fooddhuniya.model.EventSchedule;
import com.fooddhuniya.repository.EventScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/schedules")
public class EventScheduleController {

    @Autowired
    private EventScheduleRepository eventScheduleRepository;

    @GetMapping("/")
    public ResponseEntity<List<EventSchedule>> getSchedule() {
        return ResponseEntity.ok(eventScheduleRepository.findAllByOrderByEventDateAscStartTimeAsc());
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventSchedule> addScheduleItem(@RequestBody EventSchedule eventSchedule) {
        return ResponseEntity.ok(eventScheduleRepository.save(eventSchedule));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteScheduleItem(@PathVariable Long id) {
        if (!eventScheduleRepository.existsById(id)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Schedule item not found"));
        }
        eventScheduleRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Schedule item deleted successfully"));
    }
}
