import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import app from './app.js'; 
if (process.env.NODE_ENV !== 'production') dotenv.config();
await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
