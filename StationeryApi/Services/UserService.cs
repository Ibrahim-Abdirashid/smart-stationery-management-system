using Microsoft.Extensions.Options;
using MongoDB.Driver;
using StationeryApi.Models;

namespace StationeryApi.Services;

public class UserService
{
    private readonly IMongoCollection<User> _usersCollection;
    private readonly JwtService _jwtService;

    public UserService(IOptions<StationeryDbSettings> dbSettings, IMongoClient mongoClient, JwtService jwtService)
    {
        var database = mongoClient.GetDatabase(dbSettings.Value.DatabaseName);
        _usersCollection = database.GetCollection<User>(dbSettings.Value.UsersCollectionName);
        _jwtService = jwtService;
    }

    public async Task<User?> RegisterAsync(User user)
    {
        // Simple check to ensure username is unique
        var existingUser = await _usersCollection.Find(u => u.Username == user.Username).FirstOrDefaultAsync();
        if (existingUser != null)
        {
            return null; // User already exists
        }

        // In a real app, hash the password! For this demo, we store as plain text per previous context, 
        // but robustly we should use BCrypt. 
        // user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password); 

        await _usersCollection.InsertOneAsync(user);
        return user;
    }

    public async Task<string?> LoginAsync(string username, string password)
    {
        var user = await _usersCollection.Find(u => u.Username == username && u.Password == password).FirstOrDefaultAsync();
        
        if (user == null)
        {
            return null;
        }

        return _jwtService.GenerateToken(user);
    }
    
    // Create Staff (Owner Only) logic could be here or just use RegisterAsync
}
