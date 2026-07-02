const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Служим статические файлы
app.use(express.static(__dirname));

// Маршрут для генерации PDF
app.get('/generate-pdf', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Открываем HTML файл
    await page.goto(`file://${path.join(__dirname, 'index.html')}`, {
      waitUntil: 'networkidle2'
    });

    // Скрываем элементы которые не нужны в PDF
    await page.evaluate(() => {
      const topbar = document.querySelector('.topbar');
      const footer = document.querySelector('footer');
      if (topbar) topbar.style.display = 'none';
      if (footer) footer.style.display = 'none';
    });

    // Генерируем PDF
    const pdf = await page.pdf({
      format: 'A4',
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      printBackground: true,
      displayHeaderFooter: false
    });

    await browser.close();

    res.contentType('application/pdf');
    res.send(pdf);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).send('Error generating PDF');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Generate PDF: http://localhost:${PORT}/generate-pdf`);
});
