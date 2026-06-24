const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

const generateFeeReceiptPDF = async (receiptData) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  page.drawText(process.env.INSTITUTE_NAME || 'Typing Institute', {
    x: 50, y: height - 60,
    size: 18, font, color: rgb(0.12, 0.25, 0.69),
  });

  page.drawText(process.env.INSTITUTE_ADDRESS || '', {
    x: 50, y: height - 80,
    size: 10, font: regularFont, color: rgb(0.39, 0.45, 0.54),
  });

  page.drawText(`Contact: ${process.env.INSTITUTE_CONTACT || ''}`, {
    x: 50, y: height - 95,
    size: 10, font: regularFont, color: rgb(0.39, 0.45, 0.54),
  });

  page.drawText('FEE RECEIPT', {
    x: width / 2 - 50, y: height - 140,
    size: 16, font, color: rgb(0.12, 0.25, 0.69),
  });

  page.drawLine({
    start: { x: 50, y: height - 150 },
    end: { x: width - 50, y: height - 150 },
    thickness: 1, color: rgb(0.87, 0.89, 0.93),
  });

  const fields = [
    ['Receipt No', receiptData.receiptNumber || ''],
    ['Student Name', receiptData.studentName || ''],
    ['Course Name', receiptData.courseName || ''],
    ['Duration', `${receiptData.startDate || ''} to ${receiptData.endDate || ''}`],
    ['Payment Date', receiptData.paymentDate || ''],
    ['Amount Paid', `Rs. ${receiptData.amountPaid || 0}/-`],
    ['Payment Mode', receiptData.paymentMode || ''],
  ];

  fields.forEach(([label, value], i) => {
    const yPos = height - 190 - i * 30;
    page.drawText(`${label}:`, {
      x: 50, y: yPos, size: 10, font, color: rgb(0.39, 0.45, 0.54),
    });
    page.drawText(value, {
      x: 200, y: yPos, size: 10, font: regularFont, color: rgb(0.12, 0.16, 0.24),
    });
  });

  page.drawText('Authorized Signature', {
    x: width - 200, y: 100,
    size: 10, font: regularFont, color: rgb(0.39, 0.45, 0.54),
  });

  page.drawLine({
    start: { x: width - 220, y: 120 },
    end: { x: width - 50, y: 120 },
    thickness: 1, color: rgb(0.12, 0.16, 0.24),
  });

  return await pdfDoc.save();
};

module.exports = { generateFeeReceiptPDF };
