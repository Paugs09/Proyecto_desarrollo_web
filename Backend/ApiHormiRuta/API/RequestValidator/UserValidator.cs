using API.Controllers;
using Core.Dto.Auth;
using FluentValidation;

namespace API.RequestValidator
{
    public class UserValidator { }

    public class UserRegisterValidator : AbstractValidator<UserRegister>
    {
        public UserRegisterValidator()
        {
            RuleFor(x => x.FirstName)
                .NotNull().WithMessage("El nombre no puede estar vacío.")
                .NotEmpty().WithMessage("El nombre no puede estar vacío.");

            RuleFor(x => x.Email)
                .NotNull().WithMessage("El correo electrónico no puede estar vacío.")
                .NotEmpty().WithMessage("El correo electrónico no puede estar vacío.")
                .EmailAddress().WithMessage("El correo electrónico no es válido.");
        }
    }

    public class UserUpdateValidator : AbstractValidator<UserUpdateDto>
    {
        public UserUpdateValidator()
        {
            RuleFor(x => x.FirstName)
                .NotNull().WithMessage("El nombre no puede estar vacío.")
                .NotEmpty().WithMessage("El nombre no puede estar vacío.");

            RuleFor(x => x.LastName)
                .NotNull().WithMessage("El apellido no puede estar vacío.")
                .NotEmpty().WithMessage("El apellido no puede estar vacío.");
        }
    }

    public class Loginalidator : AbstractValidator<LoginRequest>
    {
        public Loginalidator()
        {
            RuleFor(x => x.Email)
                .NotNull().WithMessage("El Email no puede estar vacío.")
                .NotEmpty().WithMessage("El Email no puede estar vacío.")
                 .EmailAddress().WithMessage("El correo electrónico no es válido.");

            RuleFor(x => x.Password)
                .NotNull().WithMessage("La contraseña no puede estar vacía.")
                .NotEmpty().WithMessage("La contraseña no puede estar vacía.");
        }
    }
}
