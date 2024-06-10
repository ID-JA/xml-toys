var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddCors(options => { options.AddPolicy("CorsPolicy", builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()); });

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
