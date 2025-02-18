import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from public directory
app.use(express.static(join(__dirname, '../public')));

// Serve the entire node_modules directory
app.use('/node_modules', express.static(join(__dirname, '../node_modules')));

app.listen(port, () => {
  console.log(`Solar System Simulator running at http://localhost:${port}`);
});
