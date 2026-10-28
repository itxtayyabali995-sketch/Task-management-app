import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";
import connectDB from "./utils/db.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
app.use(cors({
 origin: "http://localhost:5173",
 credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter); 

const PORT = process.env.PORT || 8000;

connectDB(); 

app.listen(PORT, () => {    
    console.log(`Server running on port ${PORT}`);
});