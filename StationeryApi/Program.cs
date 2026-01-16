using StationeryApi.Services; 
using StationeryApi.Models;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 1. DATABASE CONFIGURATION
builder.Services.Configure<StationeryDbSettings>(
    builder.Configuration.GetSection("StationeryDbSettings"));

// MongoDB Client
builder.Services.AddSingleton<IMongoClient>(s => {
    var connectionString = builder.Configuration.GetValue<string>("StationeryDbSettings:ConnectionString");
    return new MongoClient(connectionString);
});

// 2. REGISTER SERVICES
builder.Services.AddSingleton<ProductService>();
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<DebtService>();
builder.Services.AddSingleton<JwtService>();

// 3. AUTHENTICATION & JWT CONFIGURATION
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("SecretKey");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings.GetValue<string>("Issuer"),
        ValidAudience = jwtSettings.GetValue<string>("Audience"),
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

// 4. ADD CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174") 
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Removed to prevent startup crash if no HTTPS cert
app.UseCors("AllowReactApp");

// ORDER MATTERS: Auth -> Controller
app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers(); 

app.Run();