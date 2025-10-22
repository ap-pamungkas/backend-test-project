import express from 'express';
import cookie from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import { router } from './routes.js';
import { errorHandler } from './middlewares/errorHandler.js';

if (process.env.NODE_ENV !== 'production') {
  import('dotenv').then(dotenv => dotenv.config());
}

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();
await connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookie());



/* API */
app.use('/api', router);


/* Vue SPA */
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/', (_, res) =>
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html')
));

// 404 handler
app.use(( req, res )=>{
  res.status(404).sendFile(path.resolve(__dirname, '..', 'public', '404.html'));
});


app.use(errorHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));