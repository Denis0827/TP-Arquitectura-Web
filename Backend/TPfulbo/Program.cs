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
                "http://localhost:57767"
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
builder.Services.AddSingleton<IConfirmDateRepository, ConfirmDateRepository>();
builder.Services.AddSingleton<IMatchRepository, MatchRepository>();

// Validators
builder.Services.AddSingleton<MatchValidator>();
builder.Services.AddSingleton<ConfirmDateValidator>();
builder.Services.AddSingleton<UserValidator>();

// Managers
builder.Services.AddSingleton<UserManager>();
builder.Services.AddSingleton<TeamManager>();
builder.Services.AddSingleton<ConfirmDateManager>();
builder.Services.AddSingleton<MatchManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS
app.UseCors("AllowAngularDevServer");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
