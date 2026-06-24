const ExcelJS = require('exceljs');

const generateDeadStockExcel = async (records, period) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`Dead Stock - ${period}`);

  sheet.columns = [
    { header: 'Asset Name', key: 'assetName', width: 20 },
    { header: 'Asset Code', key: 'assetCode', width: 15 },
    { header: 'Category', key: 'category', width: 15 },
    { header: 'Quantity', key: 'quantity', width: 10 },
    { header: 'Purchase Date', key: 'purchaseDate', width: 18 },
    { header: 'Dead Stock Date', key: 'deadStockDate', width: 18 },
    { header: 'Reason', key: 'reason', width: 18 },
    { header: 'Status', key: 'status', width: 12 },
    { header: 'Remarks', key: 'remarks', width: 30 },
  ];

  sheet.getRow(1).eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E40AF' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  });

  records.forEach(r => sheet.addRow({
    assetName: r.assetName,
    assetCode: r.assetCode,
    category: r.category,
    quantity: r.quantity,
    purchaseDate: r.purchaseDate ? new Date(r.purchaseDate).toLocaleDateString('en-IN') : '',
    deadStockDate: new Date(r.deadStockDate).toLocaleDateString('en-IN'),
    reason: r.reason,
    status: r.status,
    remarks: r.remarks || '',
  }));

  return await workbook.xlsx.writeBuffer();
};

const generateDeadStockPDF = async (records, period) => {
  const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  page.drawText(`Dead Stock Report - ${period}`, {
    x: 50, y: height - 50,
    size: 16, font, color: rgb(0.12, 0.25, 0.69),
  });

  const headers = ['Asset Name', 'Code', 'Category', 'Qty', 'Reason', 'Status'];
  const colWidths = [120, 80, 100, 50, 120, 80];
  const headerY = height - 80;
  const headerHeight = 18;

  let xPos = 50;
  headers.forEach((h, i) => {
    page.drawRectangle({
      x: xPos, y: headerY - 5, width: colWidths[i], height: headerHeight,
      color: rgb(0.12, 0.25, 0.69),
    });
    page.drawText(h, {
      x: xPos + 4, y: headerY + 3, size: 9, font, color: rgb(1, 1, 1),
    });
    xPos += colWidths[i];
  });

  let yPos = headerY - 30;
  if (records.length === 0) {
    page.drawText('No records found for this period.', {
      x: 50, y: yPos, size: 12, font: regularFont, color: rgb(0.5, 0.5, 0.5),
    });
  } else {
    for (const r of records) {
      xPos = 50;
      const row = [r.assetName, r.assetCode, r.category, String(r.quantity), r.reason, r.status];
      row.forEach((val, i) => {
        page.drawText(val, { x: xPos + 4, y: yPos, size: 8, font: regularFont, color: rgb(0.12, 0.16, 0.24) });
        xPos += colWidths[i];
      });
      yPos -= 18;
      if (yPos < 50) break;
    }
  }

  return await pdfDoc.save();
};

module.exports = { generateDeadStockExcel, generateDeadStockPDF };
