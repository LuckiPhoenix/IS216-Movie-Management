package com.movie.server.repository;

import com.movie.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.deletedAt IS NULL ORDER BY u.createdAt DESC")
    List<User> findAllActive();
    
    @Query("SELECT u FROM User u WHERE u.id = :id AND u.deletedAt IS NULL")
    Optional<User> findByIdAndDeletedAtIsNull(@Param("id") Long id);
}
