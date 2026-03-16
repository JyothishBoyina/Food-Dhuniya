package com.fooddhuniya.repository;

import com.fooddhuniya.model.EventSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventScheduleRepository extends JpaRepository<EventSchedule, Long> {
    List<EventSchedule> findAllByOrderByEventDateAscStartTimeAsc();
}
