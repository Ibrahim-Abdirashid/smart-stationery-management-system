namespace StationeryApi.Models;

public class StationeryDbSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public string ProductsCollectionName { get; set; } = null!;
    public string SalesCollectionName { get; set; } = null!;
    public string UsersCollectionName { get; set; } = null!;
    public string DebtsCollectionName { get; set; } = null!;
}