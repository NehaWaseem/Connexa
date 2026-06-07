package com.connexa.contacts.controller;

import com.connexa.contacts.dto.UserProfileDto;
import com.connexa.contacts.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> profile(Authentication authentication) {
        UserProfileDto profile = userService.getProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }
}
