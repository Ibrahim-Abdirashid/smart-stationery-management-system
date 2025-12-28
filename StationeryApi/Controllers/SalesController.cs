using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using Microsoft.AspNetCore.Authorization;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SalesController : ControllerBase
{
    private readonly IMongoCollection<Sale> _salesCollection;

    public SalesController(IMongoClient client)
    {
        var database = client.GetDatabase("StationeryDb");
        _salesCollection = database.GetCollection<Sale>("Sales");
    }

    [HttpGet] // Si React uu u soo akhriyo liiska iibka
    public async Task<List<Sale>> Get() => await _salesCollection.Find(_ => true).ToListAsync();

    [HttpPost] // Si React uu u soo diro iib cusub
    public async Task<IActionResult> Post(Sale sale)
    {
        await _salesCollection.InsertOneAsync(sale);
        return Ok(sale);
    }
}