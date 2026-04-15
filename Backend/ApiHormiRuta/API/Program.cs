using Amazon.S3;
using Core.Infraestructure;
using Core.Services.Imp;
using Core.Services.Interfaces;
using Infraestructure.Data;
using Infraestructure.Filters;
using Infraestructure.Persistence;
using Infraestructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Npgsql;
using Scalar.AspNetCore;
using Supabase;
using System.Text.Json.Serialization;
const string CORS_POLICY_NAME = "CorsPolicy";

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

// Add services to the container.

services.AddControllers(options =>
{
    options.Filters.Add<ValidateTokenFilter>();
    options.Filters.Add<GlobalExceptionFilter>();
})
.AddJsonOptions(options =>
{
    // Esto permite que el JSON acepte "Medio" y lo convierta autom�ticamente a tu Enum
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Components ??= new OpenApiComponents();
        document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();

        document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
        {
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            Description = "Pega tu token de Supabase aqu�"
        };

        document.Security ??= [];
        document.Security.Add(new OpenApiSecurityRequirement
        {
            [new OpenApiSecuritySchemeReference("Bearer")] = []
        });

        return Task.CompletedTask;
    });
});

configuration.SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json");

var connectionString = configuration.GetConnectionString("DefaultConnection");
var s3Config = configuration.GetSection("SupabaseS3");
var supabaseConfig = configuration.GetSection("Supabase");

services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString, npgsqlOptions => {
        npgsqlOptions.EnableRetryOnFailure(3); // Importante para latencia en Colombia
    }));

// Lista inyecci�n de dependencias
services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
builder.Services.AddSingleton<IAmazonS3>(sp =>
{
    var config = new AmazonS3Config
    {
        ServiceURL = s3Config["ServiceUrl"],
        ForcePathStyle = true // Obligatorio para Supabase
    };
    return new AmazonS3Client(s3Config["AccessKey"], s3Config["SecretKey"], config);
});

var supabaseUrl = supabaseConfig["Url"] ?? string.Empty;
var supabaseKey = supabaseConfig["Key"] ?? string.Empty;

builder.Services.AddSingleton(provider =>
    new Client(supabaseUrl, supabaseKey, new SupabaseOptions
    {
        AutoRefreshToken = true,
        AutoConnectRealtime = true
    })
);

//Services
services.AddScoped<ICommonService, CommonService>();
services.AddScoped<IStorageService, StorageService>();
services.AddScoped<IAuthService, AuthService>();
services.AddScoped<IProductService, ProductService>();
services.AddScoped<ICartService, CartService>();
services.AddScoped<IRoleService, RoleService>();
services.AddScoped<AdminOnlyFilter>();
services.AddScoped<ValidateTokenFilter>();

//Repositories
services.AddScoped<IUnitOfWork, UnitOfWork>();
services.AddScoped<ICommonRepository, CommonRepository>();
services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Se agrega politica de origen cruzado
services.AddCors(options => options.AddPolicy(CORS_POLICY_NAME, builder =>
{
    builder.AllowAnyOrigin();
    builder.AllowAnyMethod();
    builder.AllowAnyHeader();
    builder.WithExposedHeaders("Content-Disposition");
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.EnvironmentName == "Local")
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(CORS_POLICY_NAME);
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
