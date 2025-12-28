using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StationeryApi.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Role { get; set; } = null!; // Waxay noqon doontaa "Owner" ama "Staff"
}