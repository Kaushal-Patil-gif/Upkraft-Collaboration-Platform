using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;
using Upkart1.Entities;

namespace Upkart1.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // -------------------- DbSets --------------------

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<UserVerification> UserVerifications { get; set; }
        public DbSet<Wallet> Wallets { get; set; }

        public DbSet<Service> Services { get; set; }
        public DbSet<Project> Projects { get; set; }

        public DbSet<Message> Messages { get; set; }
        public DbSet<ProjectFile> ProjectFiles { get; set; }
        public DbSet<MilestonePayment> MilestonePayments { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<WalletTransaction> WalletTransactions { get; set; }

        // -------------------- MODEL CONFIGURATION --------------------

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // =========================================================
            // ENUM → STRING (Spring @Enumerated(EnumType.STRING))
            // =========================================================

            modelBuilder.Entity<Project>()
                .Property(p => p.Status)
                .HasConversion<string>();

            modelBuilder.Entity<Project>()
                .Property(p => p.PaymentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<Project>()
                .Property(p => p.EscrowStatus)
                .HasConversion<string>();

            modelBuilder.Entity<MilestonePayment>()
                .Property(m => m.Status)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasConversion<string>();

            modelBuilder.Entity<UserVerification>()
                .Property(v => v.VerificationLevel)
                .HasConversion<string>();

            modelBuilder.Entity<UserVerification>()
                .Property(v => v.DocumentStatus)
                .HasConversion<string>();

            modelBuilder.Entity<WalletTransaction>()
                .Property(w => w.Type)
                .HasConversion<string>();

            modelBuilder.Entity<WalletTransaction>()
                .Property(w => w.Status)
                .HasConversion<string>();

            // =========================================================
            // USER RELATIONSHIPS
            // =========================================================

            // User ↔ UserProfile (1 ↔ 1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Profile)
                .WithOne(p => p.User)
                .HasForeignKey<UserProfile>(p => p.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User ↔ UserVerification (1 ↔ 1, shared PK)
            modelBuilder.Entity<UserVerification>()
                .HasKey(v => v.UserId);

            modelBuilder.Entity<User>()
                .HasOne(u => u.Verification)
                .WithOne(v => v.User)
                .HasForeignKey<UserVerification>(v => v.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // User ↔ Wallet (1 ↔ 1)
            modelBuilder.Entity<User>()
                .HasOne(u => u.Wallet)
                .WithOne(w => w.User)
                .HasForeignKey<Wallet>(w => w.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // =========================================================
            // PROJECT RELATIONSHIPS
            // =========================================================

            // User (Creator) ↔ Projects (1 ↔ N)
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Creator)
                .WithMany(u => u.CreatedProjects)
                .HasForeignKey(p => p.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            // User (Freelancer) ↔ Projects (1 ↔ N, optional)
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Freelancer)
                .WithMany(u => u.FreelanceProjects)
                .HasForeignKey(p => p.FreelancerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Service ↔ Projects (1 ↔ N)
            modelBuilder.Entity<Project>()
                .HasOne(p => p.Service)
                .WithMany(s => s.Projects)
                .HasForeignKey(p => p.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            // =========================================================
            // CHILD ENTITIES OF PROJECT
            // =========================================================

            modelBuilder.Entity<Message>()
                .HasOne(m => m.Project)
                .WithMany(p => p.Messages)
                .HasForeignKey(m => m.ProjectId);

            modelBuilder.Entity<ProjectFile>()
                .HasOne(f => f.Project)
                .WithMany(p => p.ProjectFiles)
                .HasForeignKey(f => f.ProjectId);

            modelBuilder.Entity<MilestonePayment>()
                .HasOne(m => m.Project)
                .WithMany(p => p.MilestonePayments)
                .HasForeignKey(m => m.ProjectId);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Project)
                .WithMany(p => p.Reviews)
                .HasForeignKey(r => r.ProjectId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<WalletTransaction>()
                .HasOne(wt => wt.Project)
                .WithMany(p => p.WalletTransactions)
                .HasForeignKey(wt => wt.ProjectId);

            // =========================================================
            // WALLET RELATIONSHIPS
            // =========================================================

            modelBuilder.Entity<WalletTransaction>()
                .HasOne(wt => wt.Wallet)
                .WithMany(w => w.WalletTransactions)
                .HasForeignKey(wt => wt.WalletId);

            // =========================================================
            // SERVICE RELATIONSHIPS
            // =========================================================

            modelBuilder.Entity<Service>()
                .HasOne(s => s.Freelancer)
                .WithMany(u => u.Services)
                .HasForeignKey(s => s.FreelancerId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Service)
                .WithMany(s => s.Reviews)
                .HasForeignKey(r => r.ServiceId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }

        // -------------------- LIFECYCLE HOOKS --------------------

        public override int SaveChanges()
        {
            var now = DateTime.UtcNow;

            foreach (var entry in ChangeTracker.Entries())
            {
                // Auto timestamps for UpdatedAt
                if (entry.State == EntityState.Modified)
                {
                    var updatedAtProp = entry.Entity.GetType().GetProperty("UpdatedAt");
                    if (updatedAtProp != null)
                    {
                        updatedAtProp.SetValue(entry.Entity, now);
                    }
                }

                // Auto timestamps for CreatedAt
                if (entry.State == EntityState.Added)
                {
                    var createdAtProp = entry.Entity.GetType().GetProperty("CreatedAt");
                    if (createdAtProp != null)
                    {
                        createdAtProp.SetValue(entry.Entity, now);
                    }
                }
            }

            return base.SaveChanges();
        }
    }
}
