using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Google.Apis.Auth;
using Upkart1.Data;
using Upkart1.DTO;
using Upkart1.Entities;
using Upkart1.Entities.Enums;
using Upkart1.Security;

namespace Upkart1.Services
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly IPasswordHasher<User> _passwordEncoder;
        private readonly JwtUtil _jwtUtil;
        private readonly string _googleClientId;

        public UserService(
            ApplicationDbContext context,
            IPasswordHasher<User> passwordEncoder,
            JwtUtil jwtUtil,
            IConfiguration configuration)
        {
            _context = context;
            _passwordEncoder = passwordEncoder;
            _jwtUtil = jwtUtil;
            _googleClientId = configuration["Authentication:Google:ClientId"];
        }

        public AuthResponse Register(RegisterRequest request)
        {
            if (_context.Users.Any(u => u.Email == request.Email))
                throw new ArgumentException("Email already exists");

            var user = new User
            {
                Name = request.Name,
                Email = request.Email
            };

            user.Password = _passwordEncoder.HashPassword(user, request.Password);

            try
            {
                if (request.Email.Contains("@admin"))
                {
                    user.Role = Role.ADMIN;
                }
                else if (!string.IsNullOrWhiteSpace(request.Role))
                {
                    user.Role = Enum.Parse<Role>(request.Role.Trim());
                }
                else
                {
                    throw new ArgumentException("Role is required");
                }
            }
            catch (ArgumentException e) when (e.Message.Contains("Role is required"))
            {
                throw;
            }
            catch (ArgumentException)
            {
                throw new ArgumentException($"Invalid role: {request.Role}");
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            user.HasSelectedRole = true;
            _context.SaveChanges();

            var token = _jwtUtil.GenerateToken(user.Email, user.Role.ToString());

            return new AuthResponse(user.Id, user.Name, user.Email, user.Role, token, user.CreatedAt);
        }

        public AuthResponse Login(LoginRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email);
            if (user == null)
                throw new ArgumentException("No account found with this email address");

            if (user.GoogleId != null)
                throw new ArgumentException("Please use Google Sign-In for this account");

            if (user.Password == null || _passwordEncoder.VerifyHashedPassword(user, user.Password, request.Password) != PasswordVerificationResult.Success)
                throw new ArgumentException("Incorrect password");

            if (!user.Active)
                throw new ArgumentException("Account has been deactivated");

            var token = _jwtUtil.GenerateToken(user.Email, user.Role.ToString());

            return new AuthResponse(user.Id, user.Name, user.Email, user.Role, token, user.CreatedAt);
        }

        public AuthResponse GoogleAuth(GoogleAuthRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(_googleClientId))
                    throw new Exception("Google Client ID not configured");

                GoogleJsonWebSignature.Payload payload;
                try
                {
                    payload = GoogleJsonWebSignature.ValidateAsync(request.Token, new GoogleJsonWebSignature.ValidationSettings
                    {
                        Audience = new[] { _googleClientId }
                    }).Result;
                }
                catch (Exception ex)
                {
                    throw new Exception($"Google token validation failed: {ex.Message}");
                }

                if (payload == null)
                    throw new Exception("Invalid Google token - payload is null");

                var googleId = payload.Subject;
                var email = payload.Email;
                var name = payload.Name;

                var existingUser = _context.Users.FirstOrDefault(u => u.GoogleId == googleId);
                User user;

                if (existingUser != null)
                {
                    user = existingUser;
                    if (!user.Active)
                        throw new Exception("Account has been deactivated");
                }
                else
                {
                    var emailUser = _context.Users.FirstOrDefault(u => u.Email == email);
                    if (emailUser != null)
                    {
                        user = emailUser;
                        if (!user.Active)
                            throw new Exception("Account has been deactivated");
                        user.GoogleId = googleId;
                        _context.SaveChanges();
                    }
                    else
                    {
                        user = new User
                        {
                            Name = name,
                            Email = email,
                            GoogleId = googleId,
                            HasSelectedRole = false,
                            Active = true
                        };

                        if (email.Contains("@admin"))
                        {
                            user.Role = Role.ADMIN;
                            user.HasSelectedRole = true;
                        }
                        else
                        {
                            user.Role = Role.CREATOR;
                        }
                        _context.Users.Add(user);
                        _context.SaveChanges();
                    }
                }

                var token = _jwtUtil.GenerateToken(user.Email, user.Role.ToString());
                return new AuthResponse(user.Id, user.Name, user.Email, user.Role, token, user.CreatedAt, user.HasSelectedRole);
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public AuthResponse UpdateUserRole(UpdateRoleRequest request)
        {
            var user = _context.Users.FirstOrDefault(u => u.Id == request.UserId)
                ?? throw new KeyNotFoundException("User not found");

            if (user.GoogleId == null)
                throw new ArgumentException("Role update only allowed for Google users");

            try
            {
                user.Role = Enum.Parse<Role>(request.Role);
            }
            catch
            {
                throw new ArgumentException($"Invalid role: {request.Role}");
            }

            _context.SaveChanges();
            user.HasSelectedRole = true;
            _context.SaveChanges();

            var token = _jwtUtil.GenerateToken(user.Email, user.Role.ToString());

            return new AuthResponse(user.Id, user.Name, user.Email, user.Role, token, user.CreatedAt);
        }

        public UserResponseDTO GetCurrentUser(string email)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            var profile = _context.UserProfiles.FirstOrDefault(p => p.UserId == user.Id);

            return new UserResponseDTO(
                user.Id,
                user.Name,
                user.Email,
                user.Role.ToString(),
                user.CreatedAt,
                profile?.Bio ?? "",
                profile?.Location ?? "",
                profile?.Website ?? "",
                profile?.Skills ?? "",
                profile?.ProfessionalName ?? "",
                profile?.ChannelName ?? ""
            );
        }

        public UserResponseDTO UpdateUserProfile(string email, UserProfileUpdateDTO updateData)
        {
            var user = _context.Users.FirstOrDefault(u => u.Email == email)
                ?? throw new KeyNotFoundException("User not found");

            if (updateData.Name != null)
                user.Name = updateData.Name;

            if (updateData.Email != null && updateData.Email != user.Email)
            {
                if (user.Role == Entities.Enums.Role.ADMIN)
                {
                    if (_context.Users.Any(u => u.Email == updateData.Email))
                        throw new ArgumentException("Email already exists");
                    user.Email = updateData.Email;
                }
            }

            var updatedUser = user;
            _context.SaveChanges();

            var profile = _context.UserProfiles.FirstOrDefault(p => p.UserId == user.Id)
                ?? new UserProfile();

            if (profile.UserId == 0)
            {
                profile.UserId = user.Id;
                _context.UserProfiles.Add(profile);
            }

            if (updateData.Bio != null)
                profile.Bio = updateData.Bio;
            if (updateData.Location != null)
                profile.Location = updateData.Location;
            if (updateData.Website != null)
            {
                if (!string.IsNullOrWhiteSpace(updateData.Website) && !Uri.IsWellFormedUriString(updateData.Website, UriKind.Absolute))
                {
                    var validationException = new Upkart1.Exceptions.ValidationException("Validation failed");
                    validationException.ValidationErrors["website"] = "Website must be a valid URL";
                    throw validationException;
                }
                profile.Website = updateData.Website;
            }
            if (updateData.Skills != null)
                profile.Skills = updateData.Skills;
            if (updateData.ProfessionalName != null)
                profile.ProfessionalName = updateData.ProfessionalName;
            if (updateData.ChannelName != null)
                profile.ChannelName = updateData.ChannelName;

            _context.SaveChanges();

            return new UserResponseDTO(
                updatedUser.Id,
                updatedUser.Name,
                updatedUser.Email,
                updatedUser.Role.ToString(),
                updatedUser.CreatedAt,
                profile.Bio ?? "",
                profile.Location ?? "",
                profile.Website ?? "",
                profile.Skills ?? "",
                profile.ProfessionalName ?? "",
                profile.ChannelName ?? ""
            );
        }

        public User? LoadUserByUsernameAsync(string email)
        {
            return _context.Users.FirstOrDefault(u => u.Email == email);
        }
    }
}
