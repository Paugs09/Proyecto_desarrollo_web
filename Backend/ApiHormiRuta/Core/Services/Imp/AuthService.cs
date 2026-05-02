using Core.Dto.Auth;
using Core.Entities;
using Core.Exceptions;
using Core.Infraestructure;
using Core.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Supabase.Gotrue;
using System.Net;

namespace Core.Services.Imp
{
    public class AuthService(Supabase.Client supabaseClient,
                             IRoleService roleService,
                             IStorageService storageService,
                             IGenericRepository<UserProfile> genericUserProfileRepository) : IAuthService
    {
        private readonly Supabase.Client _supabaseClient = supabaseClient;
        private readonly IRoleService _roleService = roleService;
        private readonly IStorageService _storageService = storageService;
        private readonly IGenericRepository<UserProfile> _genericUserProfileRepository = genericUserProfileRepository;

        public async Task<string> RegisterAsync(UserRegister userRegister)
        {
            // Al registrarse, pasamos los metadatos que el TRIGGER de la BD usará
            var metadata = new Dictionary<string, object>
            {
                { "first_name", userRegister.FirstName },
                { "last_name", userRegister.LastName },
                { "phone", userRegister.Phone ?? string.Empty },
                { "shipping_address", userRegister.ShippingAddress ?? string.Empty },
                { "avatar", userRegister.Avatar ?? string.Empty }
            };

            var session = await _supabaseClient.Auth.SignUp(userRegister.Email, userRegister.Password, new SignUpOptions { Data = metadata });
            return session?.AccessToken ?? throw new BusinessException(HttpStatusCode.BadRequest, "No se registro al usuario", "Error al registrar usuario");
        }

        public async Task UserUpdate(Guid userId, UserUpdateDto userUpdateDto)
        {
            var user = await _genericUserProfileRepository.FirstOrDefaultAsyncWithIncludes(x => x.Id == userId) ?? throw new BusinessException(HttpStatusCode.BadRequest, "No se encuentra al usuario", "Error al actualizar el usuario");

            user.FirstName = userUpdateDto.FirstName;
            user.LastName = userUpdateDto.LastName;
            user.PhoneNumber = userUpdateDto.PhoneNumber;
            user.ShippingAddress = userUpdateDto.ShippingAddress;
            user.Avatar = userUpdateDto.Avatar;

            _genericUserProfileRepository.Update(user);
            await _genericUserProfileRepository.SaveAsync();
        }

        public async Task<AuthInfoDto> LoginAsync(string email, string password)
        {
            var session = await _supabaseClient.Auth.SignIn(email, password);

            var userId = Guid.Parse(session?.User?.Id ?? string.Empty);
            var isAdmin = await _roleService.IsAdmin(userId);

            return new AuthInfoDto
            {
                AccessToken = session?.AccessToken ?? throw new Exception("Credenciales inválidas"),
                RefreshToken = session?.RefreshToken ?? throw new Exception("Credenciales inválidas"),
                ExpiresIn = session?.ExpiresIn ?? throw new Exception("Credenciales inválidas"),
                IsAdmin = isAdmin
            };
        }

        public async Task<AuthInfoDto> RefreshTokenAsync(string accessToken, string refreshToken)
        {
            // Rehidratamos la sesión en el cliente para que sepa qué token debe refrescar
            await _supabaseClient.Auth.SetSession(accessToken, refreshToken);

            // Internamente busca la sesión que acabamos de setear.
            var session = await _supabaseClient.Auth.RefreshSession();

            if (session?.AccessToken == null)
            {
                throw new BusinessException(HttpStatusCode.BadRequest, "No se refrescó la sesión", "No se pudo refrescar la sesión.");
            }

            var userId = Guid.Parse(session.User?.Id ?? string.Empty);
            var isAdmin = await _roleService.IsAdmin(userId);

            return new AuthInfoDto
            {
                AccessToken = session.AccessToken,
                RefreshToken = session.RefreshToken ?? string.Empty,
                IsAdmin = isAdmin
            };
        }

        public async Task<UserInfoDto> GetUserInfo(Guid userId)
        {
            return await _genericUserProfileRepository
                .GetQueryable()
                .AsNoTracking()
                .Where(x => x.Id == userId)
                .Select(x => new UserInfoDto
                {
                    UserId = x.Id,
                    FirstName = x.FirstName,
                    LastName = x.LastName,
                    Phone = x.PhoneNumber,
                    Email = x.Email,
                    ShippingAddress = x.ShippingAddress,
                    Role = x.Role.Name,
                    RoleId = x.RoleId,
                    Avatar = x.Avatar
                })
                .FirstOrDefaultAsync() ?? throw new BusinessException(HttpStatusCode.NotFound, "Usuario no encontrado", "El usuario no fue encontrado");
        }

        public async Task<string> UploadImagesForAvatar(IFormFile formFile)
        {
            var imagePath = await _storageService.UploadImageAsync(formFile, "user-avatars");
            return imagePath;
        }
    }
}
