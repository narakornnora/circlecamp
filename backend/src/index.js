import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { router as chainRouter } from './routes/chain.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/', (req,res)=>{
  res.type('text').send('✅ Generator ready on ' + (process.env.PORT || 5050));
});

app.use('/api/chain', chainRouter);

const PORT = process.env.PORT || 5050;
app.listen(PORT, ()=> console.log(`🚀 Auto-chain backend listening on http://localhost:${PORT}`));
