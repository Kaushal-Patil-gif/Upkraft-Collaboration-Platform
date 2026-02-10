package com.esports.repository;

import com.esports.entity.Service;
import com.esports.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByFreelancer(User freelancer);
    List<Service> findByActiveTrue();
}