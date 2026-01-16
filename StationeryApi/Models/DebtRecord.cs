namespace StationeryApi.Models;

public class DebtRecord
{
    public string RecordId { get; set; } = Guid.NewGuid().ToString();
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty; // e.g., "Paid", "Borrowed Notebook"
    public string? ProductName { get; set; }
    public string? ProductId { get; set; } // Link to the product
    public int Quantity { get; set; } = 1;
}
