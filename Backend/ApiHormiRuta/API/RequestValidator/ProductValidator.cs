using Core.Dto.Product;
using FluentValidation;

namespace API.RequestValidator
{
    public class ProductValidator
    {
    }

    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotNull().WithMessage("El nombre no puede estar vacío.")
                .NotEmpty().WithMessage("El nombre no puede estar vacío.");

            RuleFor(x => x.ShortDescription)
                .NotNull().WithMessage("La descripción corta no puede estar vacía.")
                .NotEmpty().WithMessage("La descripción corta no puede estar vacía.");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("El Id de la categoría debe ser mayor a 0.")
                .NotNull().WithMessage("El Id de la categoría no puede estar vacío.")
                .NotEmpty().WithMessage("El Id de la categoría no puede estar vacío.");

            RuleFor(x => x.MunicipalityId)
                .GreaterThan(0).WithMessage("El Id del municipio debe ser mayor a 0.")
                .NotNull().WithMessage("El Id del municipio no puede estar vacío.")
                .NotEmpty().WithMessage("El Id del municipio no puede estar vacío.");
        }
    }

    public class UpdateProductValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductValidator()
        {
            RuleFor(x => x.Name)
                .NotNull().WithMessage("El nombre no puede estar vacío.")
                .NotEmpty().WithMessage("El nombre no puede estar vacío.");

            RuleFor(x => x.ShortDescription)
                .NotNull().WithMessage("La descripción corta no puede estar vacía.")
                .NotEmpty().WithMessage("La descripción corta no puede estar vacía.");

            RuleFor(x => x.CategoryId)
                .GreaterThan(0).WithMessage("El Id de la categoría debe ser mayor a 0.")
                .NotNull().WithMessage("El Id de la categoría no puede estar vacío.")
                .NotEmpty().WithMessage("El Id de la categoría no puede estar vacío.");

            RuleFor(x => x.MunicipalityId)
                .GreaterThan(0).WithMessage("El Id del municipio debe ser mayor a 0.")
                .NotNull().WithMessage("El Id del municipio no puede estar vacío.")
                .NotEmpty().WithMessage("El Id del municipio no puede estar vacío.");
        }
    }

    public class WishListValidator : AbstractValidator<CreateWishListDto>
    {
        public WishListValidator()
        {
            RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("El Id del producto debe ser mayor a 0.")
                .NotNull().WithMessage("El Id del producto no puede estar vacío.")
                .NotEmpty().WithMessage("El Id del producto no puede estar vacío.");

            RuleFor(x=> x.IsFavorite)
                .NotNull().WithMessage("El campo IsFavorite no puede estar vacío.")
                .NotEmpty().WithMessage("El campo IsFavorite no puede estar vacío.");
        }
    }
}
