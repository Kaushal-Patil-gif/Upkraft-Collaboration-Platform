package com.esports.controller;

import com.esports.dto.MessageDTO;
import com.esports.service.ProjectService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class WebSocketController {

    private final ProjectService projectService;

    public WebSocketController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload MessageDTO messageData, Authentication auth) {
        try {
            if (messageData.getProjectId() == null || messageData.getContent() == null) {
                return; // Invalid message data
            }
            
            Map<String, Object> messageMap = Map.of(
                "projectId", messageData.getProjectId().toString(),
                "content", messageData.getContent()
            );
            
            projectService.sendMessage(auth.getName(), messageData.getProjectId(), messageMap);
        } catch (Exception e) {
            // WebSocket error handling - message will not be sent
        }
    }
}