package com.esports.service;

import com.esports.dto.PaymentHistoryDTO;
import com.esports.entity.*;
import com.esports.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    @Autowired
    private ProjectRepository projectRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private WalletTransactionRepository transactionRepository;
    
    @Autowired
    private MilestonePaymentRepository milestonePaymentRepository;

    public List<PaymentHistoryDTO> getPaymentHistory(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        if (user.getRole() == User.Role.CREATOR) {
            return getCreatorPaymentHistory(user);
        } else if (user.getRole() == User.Role.FREELANCER) {
            return getFreelancerPaymentHistory(user);
        }
        
        return List.of();
    }
    
    private List<PaymentHistoryDTO> getCreatorPaymentHistory(User creator) {
        List<Project> projects = projectRepository.findByCreatorAndPaymentStatusOrderByPaymentDateDesc(
            creator, Project.PaymentStatus.COMPLETED);
        
        return projects.stream().map(project -> {
            String freelancerName = project.getFreelancer() != null ? project.getFreelancer().getName() : "Unknown";
            return new PaymentHistoryDTO(
                project.getId(),
                project.getTitle(),
                project.getPrice(),
                project.getPaymentDate(),
                project.getPaymentId(),
                project.getStatus().toString(),
                "PAYMENT_MADE",
                "Payment to " + freelancerName + " for " + project.getTitle(),
                freelancerName,
                null, null, null
            );
        }).collect(Collectors.toList());
    }
    
    private List<PaymentHistoryDTO> getFreelancerPaymentHistory(User freelancer) {
        Wallet wallet = walletRepository.findByUser(freelancer).orElse(null);
        if (wallet == null) return List.of();
        
        List<WalletTransaction> transactions = transactionRepository.findByWalletOrderByCreatedAtDesc(wallet);
        
        return transactions.stream().map(transaction -> {
            String title = "";
            String description = "";
            String creatorName = null;
            String bankAccount = null;
            String ifscCode = null;
            
            if (transaction.getType() == WalletTransaction.TransactionType.ESCROW_RELEASE) {
                title = transaction.getProject() != null ? transaction.getProject().getTitle() : "Project Payment";
                creatorName = transaction.getProject() != null ? transaction.getProject().getCreator().getName() : "Unknown";
                description = "Payment received for " + title;
            } else if (transaction.getType() == WalletTransaction.TransactionType.WITHDRAWAL) {
                title = "Withdrawal Request";
                bankAccount = transaction.getBankAccount();
                ifscCode = transaction.getIfscCode();
                description = "Withdrawal to bank account ****" + 
                    (bankAccount != null ? bankAccount.substring(Math.max(0, bankAccount.length() - 4)) : "");
            }
            
            return new PaymentHistoryDTO(
                transaction.getId(),
                title,
                transaction.getAmount(),
                transaction.getCreatedAt(),
                null,
                transaction.getStatus().toString(),
                transaction.getType().toString(),
                description,
                null,
                creatorName,
                bankAccount,
                ifscCode
            );
        }).collect(Collectors.toList());
    }

    public Map<String, Object> generateInvoice(String email, Long projectId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        if (!project.getCreator().getId().equals(user.getId()) && 
            !project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        Double totalAmount = project.getPrice();
        Double platformFee = totalAmount * 0.30;
        Double freelancerAmount = totalAmount - platformFee;
        
        Map<String, Object> invoice = new HashMap<>();
        invoice.put("invoiceNumber", "INV-" + project.getId() + "-" + System.currentTimeMillis());
        invoice.put("projectTitle", project.getTitle());
        invoice.put("totalAmount", totalAmount);
        invoice.put("platformFee", platformFee);
        invoice.put("freelancerAmount", freelancerAmount);
        invoice.put("platformFeePercentage", 30.0);
        invoice.put("paymentDate", project.getPaymentDate() != null ? project.getPaymentDate() : LocalDateTime.now());
        invoice.put("paymentId", project.getPaymentId() != null ? project.getPaymentId() : "");
        invoice.put("creatorName", project.getCreator().getName());
        invoice.put("freelancerName", project.getFreelancer() != null ? project.getFreelancer().getName() : "Unknown");
        invoice.put("status", project.getStatus().toString());
        invoice.put("escrowStatus", project.getEscrowStatus() != null ? project.getEscrowStatus().toString() : "PENDING");
        invoice.put("generatedAt", LocalDateTime.now());
        invoice.put("companyName", "Upkraft Platform");
        invoice.put("companyAddress", "Upkraft HQ, RCP Ghansoli, Navi Mumbai - 400701");
        invoice.put("companyEmail", "upkraft.connect@gmail.com");
        invoice.put("companyPhone", "+91 0987654321");
        return invoice;
    }

    @Transactional
    public synchronized Map<String, Object> releaseMilestonePayment(String email, Long projectId, Map<String, Object> data) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        if (!project.getCreator().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        if (data.get("milestoneIndex") == null || data.get("amount") == null || data.get("milestoneTitle") == null) {
            throw new IllegalArgumentException("Missing required milestone data");
        }
        
        Integer milestoneIndex = (Integer) data.get("milestoneIndex");
        Double amount = ((Number) data.get("amount")).doubleValue();
        String milestoneTitle = (String) data.get("milestoneTitle");
        
        if (amount <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
        
        MilestonePayment existingPayment = milestonePaymentRepository
            .findByProjectAndMilestoneIndex(project, milestoneIndex).orElse(null);
        
        if (existingPayment != null && existingPayment.getStatus() == MilestonePayment.PaymentStatus.RELEASED) {
            throw new IllegalArgumentException("Milestone payment already released");
        }
        
        Wallet freelancerWallet = walletRepository.findByUser(project.getFreelancer())
            .orElseGet(() -> {
                Wallet wallet = new Wallet();
                wallet.setUser(project.getFreelancer());
                return walletRepository.save(wallet);
            });
        
        Double platformFee = amount * 0.30;
        Double freelancerAmount = amount - platformFee;
        
        synchronized (freelancerWallet) {
            if (freelancerWallet.getEscrowBalance() < amount) {
                throw new IllegalArgumentException("Insufficient escrow balance");
            }
            freelancerWallet.setEscrowBalance(freelancerWallet.getEscrowBalance() - amount);
            freelancerWallet.setAvailableBalance(freelancerWallet.getAvailableBalance() + freelancerAmount);
            walletRepository.save(freelancerWallet);
        }
        
        MilestonePayment milestonePayment = existingPayment != null ? existingPayment : new MilestonePayment();
        milestonePayment.setProject(project);
        milestonePayment.setMilestoneIndex(milestoneIndex);
        milestonePayment.setMilestoneTitle(milestoneTitle);
        milestonePayment.setAmount(amount);
        milestonePayment.setStatus(MilestonePayment.PaymentStatus.RELEASED);
        milestonePayment.setReleasedAt(LocalDateTime.now());
        milestonePaymentRepository.save(milestonePayment);
        
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(freelancerWallet);
        transaction.setProject(project);
        transaction.setAmount(freelancerAmount);
        transaction.setType(WalletTransaction.TransactionType.MILESTONE_PAYMENT);
        transaction.setStatus(WalletTransaction.TransactionStatus.COMPLETED);
        transactionRepository.save(transaction);
        
        return Map.of(
            "message", "Milestone payment released successfully",
            "amount", amount,
            "freelancerAmount", freelancerAmount,
            "platformFee", platformFee,
            "milestoneIndex", milestoneIndex
        );
    }

    public List<MilestonePayment> getMilestonePayments(String email, Long projectId) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));
        
        if (!project.getCreator().getId().equals(user.getId()) && 
            !project.getFreelancer().getId().equals(user.getId())) {
            throw new SecurityException("Access denied");
        }
        
        return milestonePaymentRepository.findByProjectOrderByMilestoneIndex(project);
    }
}