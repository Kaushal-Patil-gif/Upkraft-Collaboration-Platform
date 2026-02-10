package com.esports.repository;

import com.esports.entity.Project;
import com.esports.entity.Review;
import com.esports.entity.Service;
import com.esports.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByServiceOrderByCreatedAtDesc(Service service);

    Optional<Review> findByServiceAndUser(Service service, User user);

    Optional<Review> findByProjectAndUser(Project project, User user);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.service = :service")
    Double getAverageRatingByService(@Param("service") Service service);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.service = :service")
    Long getReviewCountByService(@Param("service") Service service);

    @Query("SELECT AVG(r.rating) FROM Review r JOIN r.service s WHERE s.freelancer = :freelancer")
    Double getAverageRatingByFreelancer(@Param("freelancer") User freelancer);

    @Query("SELECT AVG(r.rating) FROM Review r JOIN r.project p WHERE p.freelancer = :freelancer")
    Double findAverageRatingByFreelancer(@Param("freelancer") User freelancer);
}