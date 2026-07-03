import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Служим статические файлы
app.use(express.static(__dirname));

// Маршрут для получения HTML для печати
app.get('/print', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Open browser: http://localhost:${PORT}`);
  console.log(`To generate PDF: Press Cmd+P (Mac) or Ctrl+P (Windows/Linux)`);
  console.log(`  1. Choose "Save as PDF"`);
  console.log(`  2. In "More settings" disable "Headers and footers"`);
  console.log(`  3. Click "Save"`);
});
