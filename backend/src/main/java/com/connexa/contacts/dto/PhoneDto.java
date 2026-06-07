package com.connexa.contacts.dto;

import jakarta.validation.constraints.NotBlank;

public class PhoneDto {
    private Long id;

    @NotBlank
    private String label;

    @NotBlank
    private String number;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }
}
