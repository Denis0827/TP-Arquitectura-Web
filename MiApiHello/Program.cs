var builder = WebApplication.CreateBuilder(args);

// 🚨 AGREGAR ESTO para habilitar controllers
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 🚨 AGREGAR ESTO para mapear los controllers
app.MapControllers();

app.Run();
