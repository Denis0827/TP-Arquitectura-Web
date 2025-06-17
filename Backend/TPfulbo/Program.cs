using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TPfulbo.Managers;
using TPfulbo.Repositories;
using TPfulbo.Repositories.Interfaces;
using TPfulbo.Controllers;
using TPfulbo.Validators;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add CORS for Angular dev servers
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDevServer",
        builder => builder
            .WithOrigins(
                "http://localhost:4200",
                "http://localhost:63275"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
}
);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repositories
builder.Services.AddSingleton<IPlayerRepository, PlayerRepository>();
builder.Services.AddSingleton<ICoachRepository, CoachRepository>();
builder.Services.AddSingleton<IFieldRepository, FieldRepository>();
builder.Services.AddSingleton<ICategoryRepository, CategoryRepository>();
builder.Services.AddSingleton<ITeamRepository, TeamRepository>();
builder.Services.AddSingleton<IMatchConfirmedRepository, MatchConfirmedRepository>();
builder.Services.AddSingleton<IMatchTentativeRepository, MatchTentativeRepository>();

// Validators
builder.Services.AddSingleton<UserValidator>();
builder.Services.AddSingleton<CreateMatchTentativeValidator>();
builder.Services.AddSingleton<MatchConfirmedValidator>();
builder.Services.AddSingleton<ConfirmMatchValidator>();
builder.Services.AddSingleton<CreateTeamValidator>();

// Managers
builder.Services.AddSingleton<UserManager>();
builder.Services.AddSingleton<TeamManager>();
builder.Services.AddSingleton<FieldManager>();
builder.Services.AddSingleton<CategoryManager>();
builder.Services.AddSingleton<MatchTentativeManager>();
builder.Services.AddSingleton<MatchConfirmedManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Ensure Kestrel listens on the PORT environment variable provided by Render
var port = Environment.GetEnvironmentVariable("PORT") ?? "80";
app.Urls.Add($"http://+:{port}");

// Use CORS
app.UseCors("AllowAngularDevServer");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
