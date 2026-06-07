package com.connexa.contacts.service;

import com.connexa.contacts.dto.ContactDto;
import com.connexa.contacts.dto.EmailDto;
import com.connexa.contacts.dto.PhoneDto;
import com.connexa.contacts.entity.Contact;
import com.connexa.contacts.entity.EmailAddress;
import com.connexa.contacts.entity.PhoneNumber;
import com.connexa.contacts.entity.User;
import com.connexa.contacts.exception.ResourceNotFoundException;
import com.connexa.contacts.repository.ContactRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class ContactService {
    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public Page<ContactDto> getContacts(User user, int page, int size, String search) {
        Page<Contact> results;
        if (search == null || search.isBlank()) {
            results = contactRepository.findByUser(user, PageRequest.of(page, size));
        } else {
            results = contactRepository.findByUserAndFirstNameContainingIgnoreCaseOrUserAndLastNameContainingIgnoreCase(
                    user, search, user, search, PageRequest.of(page, size)
            );
        }
        return results.map(this::mapToDto);
    }

    public ContactDto getContact(User user, Long id) {
        return contactRepository.findById(id)
                .filter(contact -> contact.getUser().getId().equals(user.getId()))
                .map(this::mapToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
    }

    public ContactDto createContact(User user, ContactDto dto) {
        Contact contact = new Contact();
        contact.setUser(user);
        updateContactFromDto(contact, dto);
        Contact saved = contactRepository.save(contact);
        return mapToDto(saved);
    }

    public ContactDto updateContact(User user, Long id, ContactDto dto) {
        Contact contact = contactRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        updateContactFromDto(contact, dto);
        Contact saved = contactRepository.save(contact);
        return mapToDto(saved);
    }

    public void deleteContact(User user, Long id) {
        Contact contact = contactRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()))
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));
        contactRepository.delete(contact);
    }

    private ContactDto mapToDto(Contact contact) {
        ContactDto dto = new ContactDto();
        dto.setId(contact.getId());
        dto.setFirstName(contact.getFirstName());
        dto.setLastName(contact.getLastName());
        dto.setTitle(contact.getTitle());
        dto.setEmails(contact.getEmails().stream().map(email -> {
            EmailDto emailDto = new EmailDto();
            emailDto.setId(email.getId());
            emailDto.setLabel(email.getLabel());
            emailDto.setEmail(email.getEmail());
            return emailDto;
        }).collect(Collectors.toList()));
        dto.setPhones(contact.getPhones().stream().map(phone -> {
            PhoneDto phoneDto = new PhoneDto();
            phoneDto.setId(phone.getId());
            phoneDto.setLabel(phone.getLabel());
            phoneDto.setNumber(phone.getNumber());
            return phoneDto;
        }).collect(Collectors.toList()));
        return dto;
    }

    private void updateContactFromDto(Contact contact, ContactDto dto) {
        contact.setFirstName(dto.getFirstName());
        contact.setLastName(dto.getLastName());
        contact.setTitle(dto.getTitle());
        contact.getEmails().clear();
        contact.getPhones().clear();

        if (dto.getEmails() != null) {
            dto.getEmails().forEach(emailDto -> {
                EmailAddress email = new EmailAddress();
                email.setLabel(emailDto.getLabel());
                email.setEmail(emailDto.getEmail());
                email.setContact(contact);
                contact.getEmails().add(email);
            });
        }
        if (dto.getPhones() != null) {
            dto.getPhones().forEach(phoneDto -> {
                PhoneNumber phone = new PhoneNumber();
                phone.setLabel(phoneDto.getLabel());
                phone.setNumber(phoneDto.getNumber());
                phone.setContact(contact);
                contact.getPhones().add(phone);
            });
        }
    }
}
