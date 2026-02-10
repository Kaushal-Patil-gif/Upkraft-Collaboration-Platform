package com.esports.controller;

import com.esports.dto.MarketplaceServiceDTO;
import com.esports.service.MarketplaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MarketplaceController {

    @Autowired
    private MarketplaceService marketplaceService;

    @GetMapping("/services")
    public ResponseEntity<?> getAllServices() {
        try {
            List<MarketplaceServiceDTO> services = marketplaceService.getAllActiveServices();
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to get services"));
        }
    }
}