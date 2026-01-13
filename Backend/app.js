import express from 'express';
import authRoutes from'./routes/auth.route.js';
import userroutes from './routes/user.route.js';
import dotenv from 'dotenv';
import cors from 'cors';
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}

))



app.use(express.json());
dotenv.config();
app.use('/api/auth', authRoutes);
app.use('/api/user', userroutes);


// test route
app.get("/", (req, res) => {
  res.send("API is running");
});

export default app;
