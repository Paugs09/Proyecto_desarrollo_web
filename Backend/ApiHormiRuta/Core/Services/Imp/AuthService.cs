using Core.Dto.Auth;
using Core.Services.Interfaces;
using Supabase.Gotrue;

namespace Core.Services.Imp
{
    public class AuthService(Supabase.Client supabaseClient) : IAuthService
    {
        private readonly Supabase.Client _supabaseClient = supabaseClient;

        public async Task<string> RegisterAsync(UserRegister userRegister)
        {
            // Al registrarse, pasamos los metadatos que el TRIGGER de la BD usará
            var metadata = new Dictionary<string, object>
            {
                { "first_name", userRegister.FirstName },
                { "last_name", userRegister.LastName },
                { "phone", userRegister.Phone ?? string.Empty },
                { "shipping_address", userRegister.ShippingAddress ?? string.Empty }
            };

            var session = await _supabaseClient.Auth.SignUp(userRegister.Email, userRegister.Password, new SignUpOptions { Data = metadata });
            return session?.AccessToken ?? throw new Exception("Error al registrar usuario");
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var session = await _supabaseClient.Auth.SignIn(email, password);
            return session?.AccessToken ?? throw new Exception("Credenciales inválidas");
        }
    }
}
