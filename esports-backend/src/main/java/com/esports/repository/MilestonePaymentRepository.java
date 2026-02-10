package com.esports.repository;

import com.esports.entity.MilestonePayment;
import com.esports.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MilestonePaymentRepository extends JpaRepository<MilestonePayment, Long> {
    List<MilestonePayment> findByProjectOrderByMilestoneIndex(Project project);
    Optional<MilestonePayment> findByProjectAndMilestoneIndex(Project project, Integer milestoneIndex);
}