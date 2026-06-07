package com.connexa.contacts.service;

import com.connexa.contacts.dto.UserProfileDto;
import com.connexa.contacts.entity.User;
import com.connexa.contacts.exception.ResourceNotFoundException;
import com.connexa.contacts.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserProfileDto getProfile(String username) {
        User user = userRepository.findByEmailOrPhone(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        return dto;
    }
}
