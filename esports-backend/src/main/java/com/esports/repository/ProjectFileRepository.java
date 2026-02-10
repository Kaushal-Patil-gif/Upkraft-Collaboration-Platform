package com.esports.repository;

import com.esports.entity.Project;
import com.esports.entity.ProjectFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, Long> {
    List<ProjectFile> findByProjectOrderByUploadedAtDesc(Project project);
}