package com.connexa.contacts.repository;

import com.connexa.contacts.entity.Contact;
import com.connexa.contacts.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    Page<Contact> findByUser(User user, Pageable pageable);
    Page<Contact> findByUserAndFirstNameContainingIgnoreCaseOrUserAndLastNameContainingIgnoreCase(User user, String firstName, User sameUser, String lastName, Pageable pageable);
}
