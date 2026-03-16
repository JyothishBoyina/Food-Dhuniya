package com.fooddhuniya.utils;

import java.util.UUID;

public class QrCodeGenerator {

    // In a real production app, this would use ZXing or similar to generate a
    // physical image byte array
    // For this prototype, we generate a unique hash that can be encoded by the
    // frontend into a QR Code.
    public static String generateUniqueQrHash(Long userId, String ticketType) {
        return "FD-" + ticketType + "-" + userId + "-" + UUID.randomUUID().toString();
    }
}
