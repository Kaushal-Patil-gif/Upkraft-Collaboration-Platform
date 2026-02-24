using Upkart1.DTO;
using Upkart1.Entities;

namespace Upkart1.Services
{
    public interface IUserService
    {
        AuthResponse Register(RegisterRequest request);
        AuthResponse Login(LoginRequest request);
        AuthResponse GoogleAuth(GoogleAuthRequest request);
        AuthResponse UpdateUserRole(UpdateRoleRequest request);
        UserResponseDTO GetCurrentUser(string email);
        UserResponseDTO UpdateUserProfile(string email, UserProfileUpdateDTO updateData);
        User? LoadUserByUsernameAsync(string email);
    }
}
