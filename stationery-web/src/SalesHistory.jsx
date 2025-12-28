import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SalesHistory = ({ sales }) => {
  const generatePDF = (sale) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo 600
    doc.text("SmartStationery", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text("Official Invoice", 14, 30);

    // Details using autoTable
    autoTable(doc, {
      startY: 40,
      head: [['Field', 'Details']],
      body: [
        ['Item Name', sale.productName],
        ['Amount Paid', `$${sale.price}`],
        ['Transaction Date', new Date(sale.saleDate).toLocaleString()],
        ['Transaction ID', Math.random().toString(36).substr(2, 9).toUpperCase()] // Fake Transaction ID
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
    });

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your business!", 14, doc.lastAutoTable.finalY + 20);

    doc.save(`invoice_${sale.productName}.pdf`);
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-2xl shadow-md border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Recent Sales (Invoices)
        </h2>
        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
          Total Sales: {sales.length}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-100">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 px-6">Item Name</th>
              <th className="py-4 px-6">Amount</th>
              <th className="py-4 px-6 text-right">Transaction Date</th>
              <th className="py-4 px-6 text-center">Invoice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="py-12 text-center text-slate-400 text-sm font-medium"
                >
                  No transactions found. Start selling!
                </td>
              </tr>
            ) : (
              sales.slice().reverse().map((sale, index) => (
                <tr
                  key={index}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  <td className="py-4 px-6 font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                    {sale.productName}
                  </td>
                  <td className="py-4 px-6 text-emerald-600 font-black">
                    ${sale.price.toFixed(2)}
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-sm font-medium text-right font-mono">
                    {new Date(sale.saleDate).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button onClick={() => generatePDF(sale)} className="text-indigo-500 hover:text-indigo-700 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors flex items-center gap-1 mx-auto">
                      <span>⬇</span> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesHistory;
