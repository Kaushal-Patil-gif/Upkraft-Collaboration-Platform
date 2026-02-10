package com.esports.repository;

import com.esports.entity.Project;
import com.esports.entity.Project.ProjectStatus;
import com.esports.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByCreator(User creator);
    List<Project> findByFreelancer(User freelancer);
    List<Project> findByCreatorOrderByCreatedAtDesc(User creator);
    List<Project> findByFreelancerOrderByCreatedAtDesc(User freelancer);
    long countByStatus(ProjectStatus status);
    
    @Query("SELECT SUM(p.price) FROM Project p WHERE p.paymentStatus = :paymentStatus")
    Double sumPriceByPaymentStatus(@Param("paymentStatus") Project.PaymentStatus paymentStatus);

    List<Project> findByCreatorAndPaymentStatusOrderByPaymentDateDesc(User creator, Project.PaymentStatus paymentStatus);
    List<Project> findByFreelancerAndPaymentStatusOrderByPaymentDateDesc(User freelancer, Project.PaymentStatus paymentStatus);
}