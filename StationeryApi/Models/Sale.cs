public class Sale {
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string ProductName { get; set; }
    public double Price { get; set; }
    public DateTime SaleDate { get; set; } = DateTime.Now;
}