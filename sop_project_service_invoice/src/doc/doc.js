const PDFDocument = require('pdfkit')
const path = require('path');
const fs = require('fs').promises; 
async function createDoc (savedInvoice, dataCallback, endCallback){   
    const maxAddressWidth = 200; 
        const addressText = `ADDRESS: ${savedInvoice.customer_details.address}`;
        const addressLines = [];
        let currentLine = '';
        console.log("INVOICE CREATE!!")
        const doc = new PDFDocument({size:'A4'})
        const fontData = await fs.readFile(path.join(__dirname, 'font', 'leelawad.ttf'))
        doc.registerFont('myfont', fontData);
        doc.font('myfont')
        doc.on('data', dataCallback)
        doc.on('end', endCallback);
        // doc.text(content, 50, 50)
        // Draw the table headers
        doc.fontSize(30).text("Adorable Store",40, 50)
        // Draw the table data
        doc.lineCap('butt')
        .moveTo(40, 85)
        .lineTo(550, 85)
        .stroke()
        doc.fontSize(15).text("INVOICE TO", 40, 100)
        doc.fontSize(11).text(`${savedInvoice.customer_details.name_on_invoice.toLocaleUpperCase()}`, 40, 130);
        doc.fillColor('blue').fontSize(11).text(`AMOUT`,480, 130)
        doc.fillColor('blue').fontSize(11).text(`DATE ISUSUE`,370,130)
        doc.fillColor('black').fontSize(11).text(`${savedInvoice.total_cost}`,480,150)
        doc.fillColor('black').fontSize(11).text(`${savedInvoice.created_at}`,370,150)

        for (let word of addressText.split(' ')) {
            const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
            const lineWidth = doc.widthOfString(testLine, { font: 'myfont', fontSize: 11 });
          
            if (lineWidth < maxAddressWidth) {
              currentLine = testLine;
            } else {
              addressLines.push(currentLine);
              currentLine = word;
            }
          }
          
          // Add the last line if it exists
          if (currentLine.length > 0) {
            addressLines.push(currentLine);
          }
          
          // Display each line of the address
          addressLines.forEach((line, index) => {
            const lineY = 150 + index * 12; // Adjust the vertical position as needed
            doc.fillColor('black').fontSize(11).text(line, 40, lineY, { align: 'left' });
          });


        doc.fillColor('blue').fontSize(11).text(`INVOICE NO`,370,170)
        doc.fillColor('black').fontSize(11).text(`${savedInvoice.id}`,370,190)
        doc.fillColor('blue').lineCap('butt')
        .moveTo(40, 230)
        .lineTo(550, 230)
        .stroke()
        doc.fillColor('blue').fontSize(11).text("NAME",40 ,240)
        doc.fillColor('blue').fontSize(11).text("PRICE",370 ,240)
        const startY = 260; 
        const padding = 10; 
        const columnWidths = [330, 200];
        const lineHeight = 12;
        const tableData = savedInvoice.product_details.map(product => [
            product.name,
            product.price,
        ]);
        tableData.push(["",""])
        tableData.push(["", `TOTAL                           ${savedInvoice.total_cost}`])
        tableData.forEach((row, rowIndex) => {
            const rowY = startY + (rowIndex + 1) * (lineHeight + padding);
            row.forEach((cell, columnIndex) => {
                if (rowIndex === tableData.length - 2) {
                    doc.moveTo(350, rowY+5)
                       .lineTo(550,  rowY+5)
                       .stroke();
                }
              const columnX = columnWidths.slice(0, columnIndex).reduce((acc, width) => acc + width,40);
              doc.fillColor('black').text(cell, columnX, rowY, { width: columnWidths[columnIndex], align: 'left' })
            });
        });
        doc.fillColor('blue').text("NOTE",40, 700)
        doc.fillColor('black').text("THANK YOU FOR BUSINESS!",40, 720)
        doc.end()
}

module.exports = {createDoc}