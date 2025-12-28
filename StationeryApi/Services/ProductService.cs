using Microsoft.Extensions.Options;
using MongoDB.Driver;
using StationeryApi.Models;

namespace StationeryApi.Services;

public class ProductService
{
    private readonly IMongoCollection<Product> _productsCollection;

    public ProductService(IOptions<StationeryDbSettings> stationeryDbSettings)
{
    var mongoClient = new MongoClient(stationeryDbSettings.Value.ConnectionString);
    var mongoDatabase = mongoClient.GetDatabase(stationeryDbSettings.Value.DatabaseName);
    
    // Hubi in magaca collection-ka halkan uu yahay "Products" oo u qoran sidii Compass-ka
    _productsCollection = mongoDatabase.GetCollection<Product>("Products");
}

    // Liiska alaabta oo dhan
    public async Task<List<Product>> GetAsync() =>
        await _productsCollection.Find(_ => true).ToListAsync();

    // Ku darista alaab cusub (Requirement a)
    public async Task CreateAsync(Product newProduct) =>
        await _productsCollection.InsertOneAsync(newProduct);

    public async Task UpdateAsync(string id, Product updatedProduct) =>
        await _productsCollection.ReplaceOneAsync(x => x.Id == id, updatedProduct);

    public async Task RemoveAsync(string id) =>
        await _productsCollection.DeleteOneAsync(x => x.Id == id);

    public async Task UpdateStockAsync(string id, int quantitySold)
    {
        var product = await _productsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();
        if (product != null)
        {
            product.Quantity -= quantitySold;
            await UpdateAsync(id, product);
        }
    }
}