package com.example.userservice.exception;

public class EmailAlreadyUsedException extends RuntimeException {
    public EmailAlreadyUsedException() {
        super("Email déjà utilisé");
    }
}
