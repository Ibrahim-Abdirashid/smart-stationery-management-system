using Microsoft.Extensions.Options;
using MongoDB.Driver;
using StationeryApi.Models;

namespace StationeryApi.Services;

public class DebtService
{
    private readonly IMongoCollection<Debtor> _debtorsCollection;

    public DebtService(IOptions<StationeryDbSettings> stationeryDbSettings)
    {
        var logPath = "debug_log.txt";
        File.AppendAllText(logPath, $"\n[{DateTime.Now}] DebtService Constructor Start\n");

        var settings = stationeryDbSettings.Value;
        
        File.AppendAllText(logPath, $"[{DateTime.Now}] Settings Value: {(settings == null ? "NULL" : "OK")}\n");

        if (settings != null)
        {
             File.AppendAllText(logPath, $"[{DateTime.Now}] ConnString: {settings.ConnectionString}\n");
             File.AppendAllText(logPath, $"[{DateTime.Now}] DbName: {settings.DatabaseName}\n");
             File.AppendAllText(logPath, $"[{DateTime.Now}] CollectionName (Raw): {settings.DebtsCollectionName}\n");
        }

        var connectionString = settings.ConnectionString;
        var databaseName = settings.DatabaseName;
        // Fallback to "Debts" if setting is missing to prevent 500 crashes
        var collectionName = !string.IsNullOrEmpty(settings.DebtsCollectionName) 
            ? settings.DebtsCollectionName 
            : "Debts";

        File.AppendAllText(logPath, $"[{DateTime.Now}] Using CollectionName: {collectionName}\n");

        try
        {
            var mongoClient = new MongoClient(connectionString);
            var mongoDatabase = mongoClient.GetDatabase(databaseName);
            _debtorsCollection = mongoDatabase.GetCollection<Debtor>(collectionName);
            File.AppendAllText(logPath, $"[{DateTime.Now}] DebtService Init Success\n");
        }
        catch (Exception ex)
        {
            File.AppendAllText(logPath, $"[{DateTime.Now}] EXCEPTION: {ex.Message}\n{ex.StackTrace}\n");
            throw;
        }
    }

    public async Task<List<Debtor>> GetAsync() =>
        await _debtorsCollection.Find(_ => true).ToListAsync();

    public async Task<Debtor?> GetAsync(string id) =>
        await _debtorsCollection.Find(x => x.Id == id).FirstOrDefaultAsync();

    public async Task CreateAsync(Debtor newDebtor) =>
        await _debtorsCollection.InsertOneAsync(newDebtor);

    public async Task AddDebtAsync(string id, DebtRecord debtRecord)
    {
        var filter = Builders<Debtor>.Filter.Eq(x => x.Id, id);
        
        // Use MongoDB update operators for atomic updates
        var update = Builders<Debtor>.Update
            .Push(x => x.DebtHistory, debtRecord)
            .Inc(x => x.TotalDebt, debtRecord.Amount);

        await _debtorsCollection.UpdateOneAsync(filter, update);
    }

    // Optional: Payment logic (reduce debt)
    public async Task PayDebtAsync(string id, decimal amount)
    {
         var filter = Builders<Debtor>.Filter.Eq(x => x.Id, id);
         
         var paymentRecord = new DebtRecord
         {
             Amount = -amount, // Negative amount for payment
             Description = "Payment Received",
             Date = DateTime.UtcNow
         };

         var update = Builders<Debtor>.Update
            .Push(x => x.DebtHistory, paymentRecord)
            .Inc(x => x.TotalDebt, -amount);

         await _debtorsCollection.UpdateOneAsync(filter, update);
    }

    public async Task DeleteRecordAsync(string debtorId, string recordId)
    {
         var debtor = await GetAsync(debtorId);
         if (debtor == null) return;

         var record = debtor.DebtHistory.FirstOrDefault(r => r.RecordId == recordId);
         if (record == null) return;

         // Reverse the debt amount (if it was debt (+), we subtract. If it was payment (-), we add back (subtract negative))
         var amountToReverse = record.Amount; // This is the amount that was ADDED to total debt.

         var filter = Builders<Debtor>.Filter.Eq(x => x.Id, debtorId);
         
         var update = Builders<Debtor>.Update
            .PullFilter(x => x.DebtHistory, r => r.RecordId == recordId)
            .Inc(x => x.TotalDebt, -amountToReverse); // Reverse impact on TotalDebt

         await _debtorsCollection.UpdateOneAsync(filter, update);
    }
}
