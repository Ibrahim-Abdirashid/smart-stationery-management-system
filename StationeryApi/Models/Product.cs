using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StationeryApi.Models;

public class Product
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
}