using Microsoft.AspNetCore.Mvc;
using StationeryApi.Models;
using StationeryApi.Services;
using Microsoft.AspNetCore.Authorization;

namespace StationeryApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductsController(ProductService productService) =>
        _productService = productService;

    // 1. Soo qaado dhammaan alaabta
    [HttpGet]
    public async Task<List<Product>> Get() => await _productService.GetAsync();

    // 2. Diiwaangeli alaab cusub (Requirement a)
    [Authorize(Roles = "Owner")]
    [HttpPost]
    public async Task<IActionResult> Post(Product newProduct)
    {
        await _productService.CreateAsync(newProduct);
        return CreatedAtAction(nameof(Get), new { id = newProduct.Id }, newProduct);
    }

    // 3. Iibinta alaabta & cusboonaysiinta stock-ka (Requirement c)
    [HttpPost("sell/{id}")]
    public async Task<IActionResult> SellProduct(string id, [FromBody] int quantity)
    {
        await _productService.UpdateStockAsync(id, quantity);
        return Ok(new { message = "Stock updated successfully after sale" });
    }

    // 4. Update Product (Owner Only)
    [Authorize(Roles = "Owner")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Product updatedProduct)
    {
        var product = (await _productService.GetAsync()).FirstOrDefault(p => p.Id == id);

        if (product is null)
            return NotFound();

        updatedProduct.Id = product.Id; // Ensure Id is not changed
        await _productService.UpdateAsync(id, updatedProduct);

        return NoContent();
    }

    // 5. Delete Product (Owner Only)
    [Authorize(Roles = "Owner")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var product = (await _productService.GetAsync()).FirstOrDefault(p => p.Id == id);

        if (product is null)
            return NotFound();

        await _productService.RemoveAsync(id);

        return NoContent();
    }
}