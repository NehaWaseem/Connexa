package com.connexa.contacts.controller;

import com.connexa.contacts.dto.ContactDto;
import com.connexa.contacts.dto.UserProfileDto;
import com.connexa.contacts.entity.User;
import com.connexa.contacts.repository.UserRepository;
import com.connexa.contacts.service.ContactService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService contactService;
    private final UserRepository userRepository;

    public ContactController(ContactService contactService, UserRepository userRepository) {
        this.contactService = contactService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<Page<ContactDto>> getContacts(Authentication auth,
                                                       @RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size,
                                                       @RequestParam(required = false) String search) {
        User user = getCurrentUser(auth);
        Page<ContactDto> contacts = contactService.getContacts(user, page, size, search);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getContact(Authentication auth, @PathVariable Long id) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(contactService.getContact(user, id));
    }

    @PostMapping
    public ResponseEntity<ContactDto> createContact(Authentication auth, @Valid @RequestBody ContactDto dto) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(contactService.createContact(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> updateContact(Authentication auth, @PathVariable Long id,
                                                    @Valid @RequestBody ContactDto dto) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(contactService.updateContact(user, id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(Authentication auth, @PathVariable Long id) {
        User user = getCurrentUser(auth);
        contactService.deleteContact(user, id);
        return ResponseEntity.ok().build();
    }

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmailOrPhone(auth.getName(), auth.getName())
                .orElseThrow();
    }
}
