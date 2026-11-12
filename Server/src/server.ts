import express, {type Response , type Request} from "express"
import { config } from "dotenv"
import authRoutes from "./routes/authRoutes.js"
import docRoute from "./routes/documentRoutes.js"
import connectDb from "./config/dbConfig.js"
import chatRoutes from "./routes/chatRoutes.js"
import cors from "cors";
import dns from 'node:dns';

config()

dns.setServers(['8.8.8.8', '8.8.4.4']);


const app = express()


app.use(
  cors({
    origin: ["http://localhost:3000",
      "https://docu-mentor-ai-one.vercel.app"
    ],
    credentials: true,
  })
);

app.use(express.json());

// db connection 
connectDb()
// Body parsing middleware — routes se pehle
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/",(req : Request, res : Response) =>{
    res.send("Wellcome to Doc-Talk")
})

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
     console.log(`server is running at ${PORT}`);
})


// auth routes 
app.use("/api/auth",authRoutes)

// file upload 
app.use("/api/file",docRoute )

// chat route 

app.use("/api/question", chatRoutes)