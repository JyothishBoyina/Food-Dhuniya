package com.fooddhuniya.service;

import com.fooddhuniya.model.Ticket;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.Date;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    public void sendTicketConfirmation(String toAddress, String name, Ticket ticketDetails) {
        try {
            System.out.println("=========================================");
            System.out.println("[ASYNC EVENT] Preparing to send Ticket Confirmation Email to: " + toAddress);

            // 1. Generate QR Code Image as Byte Array
            String qrData = String.format("{\"ticketId\":%d, \"event\":\"Food Dhuniya 2026\", \"user\":\"%s\", \"type\":\"%s\", \"qty\":%d}",
                    ticketDetails.getId(), name, ticketDetails.getTicketType(), ticketDetails.getQuantity());

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrData, BarcodeFormat.QR_CODE, 250, 250);

            ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", pngOutputStream);
            byte[] qrImageBytes = pngOutputStream.toByteArray();

            // 2. Create MimeMessage for HTML
            MimeMessage message = mailSender.createMimeMessage();
            // true = multipart message (required for inline images)
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("Food Dhuniya <reyyanna@gmail.com>");
            helper.setTo(toAddress);
            helper.setSubject("Food Dhuniya Ticket Confirmation 🎟️");

            // 3. Build HTML Email Body
            String htmlContent = String.format(
                "<html>" +
                "<body style='font-family: \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;'>" +
                "  <div style='background: linear-gradient(135deg, #fcd34d 0%%, #fbbf24 100%%); padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>" +
                "    <h1 style='margin: 0; color: #1e293b; font-size: 32px; letter-spacing: -0.025em; font-weight: 800;'>Food Dhuniya 2026</h1>" +
                "    <p style='margin: 8px 0 0 0; font-size: 18px; color: #475569; font-weight: 600;'>Your Ticket is Confirmed!</p>" +
                "  </div>" +
                "  <div style='background-color: #ffffff; padding: 40px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);'>" +
                "    <p style='font-size: 16px;'>Hello <span style='color: #fbbf24; font-weight: 700;'>%s</span>,</p>" +
                "    <p style='font-size: 16px; color: #64748b;'>Get ready for an unforgettable culinary experience! Your booking for Food Dhuniya 2026 is officially confirmed. Below are your ticket details and your entry QR code.</p>" +
                "    " +
                "    <div style='margin: 32px 0; padding: 24px; background-color: #fffbeb; border-radius: 12px; border: 1px solid #fef3c7;'>" +
                "      <h3 style='margin-top: 0; margin-bottom: 16px; color: #92400e; font-size: 18px; border-bottom: 1px solid #fde68a; padding-bottom: 8px;'>Ticket Information</h3>" +
                "      <table style='width: 100%%; border-collapse: collapse;'>" +
                "        <tr><td style='padding: 8px 0; color: #b45309; font-weight: 600; width: 40%%;'>Event</td><td style='padding: 8px 0; color: #1e293b;'>Food Dhuniya 2026</td></tr>" +
                "        <tr><td style='padding: 8px 0; color: #b45309; font-weight: 600;'>Ticket Type</td><td style='padding: 8px 0; color: #1e293b;'>%s Entry</td></tr>" +
                "        <tr><td style='padding: 8px 0; color: #b45309; font-weight: 600;'>Quantity</td><td style='padding: 8px 0; color: #1e293b;'>%d Tickets</td></tr>" +
                "        <tr><td style='padding: 8px 0; color: #b45309; font-weight: 600;'>Ticket ID</td><td style='padding: 8px 0; color: #1e293b; font-family: monospace;'>%s</td></tr>" +
                "        <tr><td style='padding: 8px 0; color: #b45309; font-weight: 600;'>Total Paid</td><td style='padding: 8px 0; color: #1e293b; font-weight: 700; font-size: 18px;'>₹%s</td></tr>" +
                "        <tr><td style='padding: 8px 0; color: #b45309; font-weight: 600;'>Booking Date</td><td style='padding: 8px 0; color: #1e293b;'>%s</td></tr>" +
                "      </table>" +
                "    </div>" +
                "    " +
                "    <div style='text-align: center; margin: 40px 0; padding: 32px; background-color: #ffffff; border-radius: 16px; border: 2px dashed #cbd5e1;'>" +
                "      <p style='margin-top: 0; margin-bottom: 20px; font-weight: 700; color: #1e293b; font-size: 18px;'>Your Entry QR Code</p>" +
                "      <div style='background: white; padding: 15px; display: inline-block; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);'>" +
                "        <img src='cid:qrImage' alt='Ticket QR Code' style='max-width: 200px; height: auto; display: block;' />" +
                "      </div>" +
                "      <p style='margin-top: 20px; margin-bottom: 0; font-size: 14px; color: #64748b; font-weight: 500;'>Please present this QR code at the entrance (mobile or print).</p>" +
                "    </div>" +
                "    " +
                "    <p style='font-size: 16px; color: #475569;'>We can't wait to see you there!</p>" +
                "    <div style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center;'>" +
                "      <p style='margin: 0; font-size: 14px; color: #94a3b8;'>&copy; 2026 Food Dhuniya Festival. All rights reserved.</p>" +
                "      <p style='margin: 8px 0 0 0; font-size: 14px; color: #64748b;'>Need help? <a href='#' style='color: #fbbf24; text-decoration: none; font-weight: 600;'>Contact Support</a></p>" +
                "    </div>" +
                "  </div>" +
                "</body>" +
                "</html>",
                name,
                ticketDetails.getTicketType(),
                ticketDetails.getQuantity(),
                (ticketDetails.getQrCode() != null ? ticketDetails.getQrCode() : "TKT-" + ticketDetails.getId()),
                ticketDetails.getTotalAmount(),
                new Date().toString()
            );

            helper.setText(htmlContent, true);

            // 4. Attach/Inline the QR Code Image
            helper.addInline("qrImage", new ByteArrayResource(qrImageBytes), "image/png");

            mailSender.send(message);

            System.out.println("=========================================");
            System.out.println("[ASYNC EVENT] SUCCESS: HTML Confirmation Email sent to: " + toAddress + " with embedded QR Code.");
            System.out.println("=========================================");

        } catch (Exception e) {
            System.err.println("=========================================");
            System.err.println("[ASYNC EVENT ERRROR] Failed to send Confirmation Email to " + toAddress);
            System.err.println("Cause: " + e.getMessage());
            System.err.println("Ensure you configured SMTP properly in application.properties!");
            System.err.println("=========================================");
            e.printStackTrace();
        }
    }
}
