package com.esports.service;

import com.esports.dto.WalletResponseDTO;
import com.esports.dto.WithdrawalRequestDTO;
import com.esports.entity.*;
import com.esports.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;
    
    @Autowired
    private WalletTransactionRepository transactionRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProjectRepository projectRepository;

    @Transactional
    public Map<String, Object> holdEscrow(String userEmail, Long projectId, String razorpayPaymentId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));

        Wallet freelancerWallet = walletRepository.findByUser(project.getFreelancer())
            .orElseGet(() -> {
                Wallet wallet = new Wallet();
                wallet.setUser(project.getFreelancer());
                return walletRepository.save(wallet);
            });

        Double currentEscrow = freelancerWallet.getEscrowBalance() != null ? freelancerWallet.getEscrowBalance() : 0.0;
        freelancerWallet.setEscrowBalance(currentEscrow + project.getPrice());
        freelancerWallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(freelancerWallet);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(freelancerWallet);
        transaction.setProject(project);
        transaction.setAmount(project.getPrice());
        transaction.setType(WalletTransaction.TransactionType.ESCROW_HOLD);
        transaction.setStatus(WalletTransaction.TransactionStatus.COMPLETED);
        transaction.setRazorpayPaymentId(razorpayPaymentId);
        transactionRepository.save(transaction);

        return Map.of("message", "Payment held in escrow successfully");
    }

    @Transactional
    public Map<String, Object> releaseEscrow(String userEmail, Long projectId) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new NoSuchElementException("Project not found"));

        if (!project.getCreator().getId().equals(user.getId())) {
            throw new SecurityException("Only project creator can release payment");
        }

        Wallet freelancerWallet = walletRepository.findByUser(project.getFreelancer())
            .orElseThrow(() -> new NoSuchElementException("Freelancer wallet not found"));

        Double currentEscrow = freelancerWallet.getEscrowBalance() != null ? freelancerWallet.getEscrowBalance() : 0.0;
        if (currentEscrow < project.getPrice()) {
            throw new IllegalArgumentException("Insufficient escrow balance");
        }

        Double platformFee = project.getPrice() * 0.30;
        Double freelancerAmount = project.getPrice() - platformFee;
        
        Double currentAvailable = freelancerWallet.getAvailableBalance() != null ? freelancerWallet.getAvailableBalance() : 0.0;
        freelancerWallet.setEscrowBalance(currentEscrow - project.getPrice());
        freelancerWallet.setAvailableBalance(currentAvailable + freelancerAmount);
        freelancerWallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(freelancerWallet);

        project.setEscrowStatus(Project.EscrowStatus.RELEASED);
        project.setStatus(Project.ProjectStatus.COMPLETED);
        project.setUpdatedAt(LocalDateTime.now());
        projectRepository.save(project);

        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(freelancerWallet);
        transaction.setProject(project);
        transaction.setAmount(freelancerAmount);
        transaction.setType(WalletTransaction.TransactionType.ESCROW_RELEASE);
        transaction.setStatus(WalletTransaction.TransactionStatus.COMPLETED);
        transactionRepository.save(transaction);

        return Map.of(
            "message", "Payment released successfully",
            "totalAmount", project.getPrice(),
            "freelancerAmount", freelancerAmount,
            "platformFee", platformFee
        );
    }

    public WalletResponseDTO getWalletBalance(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        Wallet wallet = walletRepository.findByUser(user).orElseGet(() -> {
            Wallet newWallet = new Wallet();
            newWallet.setUser(user);
            return walletRepository.save(newWallet);
        });

        Double available = wallet.getAvailableBalance() != null ? wallet.getAvailableBalance() : 0.0;
        Double escrow = wallet.getEscrowBalance() != null ? wallet.getEscrowBalance() : 0.0;
        
        return new WalletResponseDTO(available, escrow, available + escrow);
    }
    
    @Transactional
    public Map<String, Object> requestWithdrawal(String userEmail, WithdrawalRequestDTO request) {
        if (request.getAmount() == null || request.getAmount() <= 0) {
            throw new IllegalArgumentException("Invalid withdrawal amount");
        }
        
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        Wallet wallet = walletRepository.findByUser(user)
            .orElseThrow(() -> new NoSuchElementException("Wallet not found"));
        
        Double currentAvailable = wallet.getAvailableBalance() != null ? wallet.getAvailableBalance() : 0.0;
        if (currentAvailable < request.getAmount()) {
            throw new IllegalArgumentException("Insufficient balance");
        }
        
        wallet.setAvailableBalance(currentAvailable - request.getAmount());
        walletRepository.save(wallet);
        
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(request.getAmount());
        transaction.setType(WalletTransaction.TransactionType.WITHDRAWAL);
        transaction.setStatus(WalletTransaction.TransactionStatus.PENDING);
        transaction.setBankAccount(request.getBankAccount());
        transaction.setIfscCode(request.getIfscCode());
        transactionRepository.save(transaction);
        
        return Map.of("message", "Withdrawal request submitted. Processing within 24-48 hours.");
    }
    
    public List<WalletTransaction> getTransactions(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
            .orElseThrow(() -> new NoSuchElementException("User not found"));
        
        Wallet wallet = walletRepository.findByUser(user).orElse(null);
        if (wallet == null) {
            return List.of();
        }
        
        return transactionRepository.findByWalletOrderByCreatedAtDesc(wallet);
    }
}