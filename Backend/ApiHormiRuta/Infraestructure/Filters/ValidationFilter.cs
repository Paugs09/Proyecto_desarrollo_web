using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Infraestructure.Filters
{
    public class ValidationFilter : IAsyncActionFilter
    {
        private readonly IServiceProvider _serviceProvider;

        public ValidationFilter(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Buscamos si alguno de los parámetros de la acción tiene un validador registrado
            foreach (var argument in context.ActionArguments.Values)
            {
                if (argument == null) continue;

                // Buscamos dinámicamente el validador correspondiente (ej. IValidator<CreateProductDto>)
                var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
                var validator = _serviceProvider.GetService(validatorType) as IValidator;

                if (validator != null)
                {
                    var validationContext = new ValidationContext<object>(argument);
                    var validationResult = await validator.ValidateAsync(validationContext);

                    if (!validationResult.IsValid)
                    {
                        // Si falla, rompe el flujo y devuelve un 400 Bad Request estructurado
                        context.Result = new BadRequestObjectResult(validationResult.ToDictionary());
                        return;
                    }
                }
            }

            await next();
        }
    }
}
