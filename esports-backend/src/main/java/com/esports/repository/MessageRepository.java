package com.esports.repository;

import com.esports.entity.Message;
import com.esports.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByProjectOrderByCreatedAtAsc(Project project);
}