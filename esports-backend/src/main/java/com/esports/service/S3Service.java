package com.esports.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {
    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket}")
    private String bucket;

    public Map<String, String> upload(MultipartFile file, String folder)
            throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        // Allow larger files for project uploads (3GB limit)
        long maxSize = folder.startsWith("projects/") ? 3L * 1024 * 1024 * 1024 : 5L * 1024 * 1024;
        if (file.getSize() > maxSize) {
            String sizeLimit = folder.startsWith("projects/") ? "3GB" : "5MB";
            throw new IllegalArgumentException("Max file size is " + sizeLimit);
        }

        String safeFileName = UUID.randomUUID().toString() + "." + getFileExtension(file.getOriginalFilename());
        String key = folder + "/" + safeFileName;

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(
                request,
                RequestBody.fromInputStream(
                        file.getInputStream(),
                        file.getSize()
                )
        );

        return Map.of(
                "key", key,
                "url", key  // Store just the key, generate presigned URL when needed
        );
    }

    public String generateDownloadUrl(String s3Key) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(s3Key)
                .build();

        GetObjectPresignRequest presignRequest =
                GetObjectPresignRequest.builder()
                        .signatureDuration(Duration.ofMinutes(15))
                        .getObjectRequest(getObjectRequest)
                        .build();

        return s3Presigner
                .presignGetObject(presignRequest)
                .url()
                .toString();
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "jpg";
        }
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
}