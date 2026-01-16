using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace StationeryApi.Models;

public class Debtor
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string Name { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    
    public decimal TotalDebt { get; set; } = 0;

    public List<DebtRecord> DebtHistory { get; set; } = new();
}
