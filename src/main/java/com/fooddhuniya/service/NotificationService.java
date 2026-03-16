package com.fooddhuniya.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendEmail(String toAddress, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toAddress);
            message.setSubject(subject);
            message.setText(body);
            // Optionally set the from address if your SMTP requires it:
            // message.setFrom("your-email@gmail.com");

            mailSender.send(message);

            System.out.println("=========================================");
            System.out.println("[ASYNC EVENT] SUCCESS: Real Email Sent to: " + toAddress);
            System.out.println("=========================================");
        } catch (Exception e) {
            System.err.println("=========================================");
            System.err.println("[ASYNC EVENT] ERROR: Failed to send real email to " + toAddress);
            System.err.println("Cause: " + e.getMessage());
            System.err.println("Have you configured your SMTP settings in application.properties?");
            System.err.println("=========================================");
        }
    }

    @Async
    public void sendSms(String phoneNumber, String message) {
        // In a real application, use Twilio SDK or SMS gateway here.
        System.out.println("=========================================");
        System.out.println("[ASYNC EVENT] Sending SMS to: " + phoneNumber);
        System.out.println("Message: " + message);
        System.out.println("=========================================");
    }
}
