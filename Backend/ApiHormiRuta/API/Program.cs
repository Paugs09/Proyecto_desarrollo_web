using Core.Enumerations;
using Core.Infraestructure;
using Core.Services.Imp;
using Core.Services.Interfaces;
using Infraestructure.Data;
using Infraestructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Scalar.AspNetCore;
using System.Text.Json.Serialization;
const string CORS_POLICY_NAME = "CorsPolicy";

NpgsqlConnection.GlobalTypeMapper.MapEnum<DifficultyLevel>("difficulty_level");

var builder = WebApplication.CreateBuilder(args);

var services = builder.Services;
var configuration = builder.Configuration;

// Add services to the container.

services.AddControllers().AddJsonOptions(options =>
{
    // Esto permite que el JSON acepte "Medio" y lo convierta automáticamente a tu Enum
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
}); ;

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
services.AddOpenApi();

configuration.SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile($"appsettings.json");

var connectionString = configuration.GetConnectionString("DefaultConnection");

// 1. Crear el DataSourceBuilder y mapear el enum
var dataSourceBuilder = new NpgsqlDataSourceBuilder(connectionString);
// El nombre entre comillas debe ser EXACTO al de la DB (image_f44ba6.png)
dataSourceBuilder.MapEnum<DifficultyLevel>("difficulty_level");
dataSourceBuilder.EnableUnmappedTypes();
var dataSource = dataSourceBuilder.Build();

services.AddDbContext<AppDbContext>(options => options.UseNpgsql(dataSource));

// Lista inyección de dependencias
services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

//Services
services.AddTransient<ICommonService, CommonService>();
services.AddTransient<IAdventureService, AdventureService>();

//Repositories
services.AddTransient<ICommonRepository, CommonRepository>();
services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

// Se agrega politica de origen cruzado
services.AddCors(options => options.AddPolicy(CORS_POLICY_NAME, builder =>
{
    builder.WithOrigins();
    builder.AllowAnyMethod();
    builder.AllowAnyHeader();
    builder.WithExposedHeaders("Content-Disposition");
}));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseCors(CORS_POLICY_NAME);
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();
