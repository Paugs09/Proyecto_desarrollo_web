using Core.Services.Interfaces;
using Supabase.Gotrue;

namespace Core.Services.Imp
{
    public class AuthService(Supabase.Client supabaseClient) : IAuthService
    {
        private readonly Supabase.Client _supabaseClient = supabaseClient;

        public async Task<string> RegisterAsync(string email, string password, string firstName, string lastName)
        {
            // Al registrarse, pasamos los metadatos que el TRIGGER de la BD usará
            var metadata = new Dictionary<string, object>
            {
                { "first_name", firstName },
                { "last_name", lastName }
            };

            var session = await _supabaseClient.Auth.SignUp(email, password, new SignUpOptions { Data = metadata });

            return session?.AccessToken ?? throw new Exception("Error al registrar usuario");
        }

        public async Task<string> LoginAsync(string email, string password)
        {
            var session = await _supabaseClient.Auth.SignIn(email, password);
            return session?.AccessToken ?? throw new Exception("Credenciales inválidas");
        }
    }
}
