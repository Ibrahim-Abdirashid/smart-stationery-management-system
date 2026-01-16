using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StationeryApi.Models;
using StationeryApi.Services;

namespace StationeryApi.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DebtsController : ControllerBase
{
    private readonly DebtService _debtService;
    private readonly ProductService _productService;

    public DebtsController(DebtService debtService, ProductService productService)
    {
        _debtService = debtService;
        _productService = productService;
    }

    // 1. Get all debtors
    [HttpGet]
    public async Task<ActionResult<List<Debtor>>> Get() 
    {
        try 
        {
            return await _debtService.GetAsync();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Internal Server Error", error = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    // 2. Get single debtor details
    [HttpGet("{id}")]
    public async Task<ActionResult<Debtor>> Get(string id)
    {
        var debtor = await _debtService.GetAsync(id);

        if (debtor is null)
        {
            return NotFound();
        }

        return debtor;
    }

    // 3. Register a new debtor (Customer)
    [Authorize(Roles = "Owner,Staff")]
    [HttpPost]
    public async Task<IActionResult> Post(Debtor newDebtor)
    {
        await _debtService.CreateAsync(newDebtor);
        return CreatedAtAction(nameof(Get), new { id = newDebtor.Id }, newDebtor);
    }

    // 4. Add debt to a customer (with stock deduction)
    // 4. Add debt to a customer (with stock deduction)
    [Authorize(Roles = "Owner,Staff")]
    [HttpPost("{id}/add")]
    public async Task<IActionResult> AddDebt(string id, [FromBody] DebtRecord debtRecord)
    {
        var debtor = await _debtService.GetAsync(id);
        if (debtor is null) return NotFound(new { message = "Customer not found" });

        // If ProductId is provided, validate and update stock
        if (!string.IsNullOrEmpty(debtRecord.ProductId))
        {
            // 1. Get Product
            var products = await _productService.GetAsync();
            var product = products.FirstOrDefault(p => p.Id == debtRecord.ProductId);

            if (product is null)
            {
                return BadRequest(new { message = "Product not found" });
            }

            if (product.Quantity < debtRecord.Quantity)
            {
                 return BadRequest(new { message = $"Insufficient stock. Only {product.Quantity} left." });
            }

            // 2. Auto-fill details if missing
            if (string.IsNullOrEmpty(debtRecord.ProductName)) debtRecord.ProductName = product.Name;
            
            // Calculate total amount if not set (Price * Quantity)
            if (debtRecord.Amount == 0) 
            {
                debtRecord.Amount = product.Price * debtRecord.Quantity;
            }

            // 3. Deduct Stock (Decrease by the specific quantity)
            await _productService.UpdateStockAsync(product.Id, debtRecord.Quantity);
        }

        await _debtService.AddDebtAsync(id, debtRecord);
        return NoContent();
    }
    
    // 5. Pay debt (Optional utility)
    [Authorize(Roles = "Owner,Staff")]
    [HttpPost("{id}/pay")]
    public async Task<IActionResult> PayDebt(string id, [FromBody] decimal amount)
    {
        var debtor = await _debtService.GetAsync(id);
        if (debtor is null) return NotFound();

        await _debtService.PayDebtAsync(id, amount);
        return NoContent();
    }

    // 6. Delete a debt record (and reverse stock if product)
    [Authorize(Roles = "Owner,Staff")]
    [HttpDelete("{id}/records/{recordId}")]
    public async Task<IActionResult> DeleteRecord(string id, string recordId)
    {
        var debtor = await _debtService.GetAsync(id);
        if (debtor == null) return NotFound();

        var record = debtor.DebtHistory.FirstOrDefault(r => r.RecordId == recordId);
        if (record == null) return NotFound();

        // If it was a product debt, reverse the stock deduction (Increase stock back)
        if (!string.IsNullOrEmpty(record.ProductId) && record.Quantity > 0)
        {
            // Note: UpdateStockAsync usually takes 'quantitySold'. To INCREASE stock, we pass negative?
            // Checking ProductService... it does: product.Quantity -= quantitySold;
            // So to INCREASE, we pass negative quantity.
            await _productService.UpdateStockAsync(record.ProductId, -record.Quantity);
        }

        await _debtService.DeleteRecordAsync(id, recordId);
        return NoContent();
    }
}
