import 'dotenv/config'
import express,{Response,Request} from 'express'
import artRouter from './routes/art.routes';
import helmet from 'helmet';
import cors from 'cors'
import { publicCorsConfig } from './constants/corsOptions';

const app = express();
const port = 8080;

app.use(helmet())
app.use(express.json())
app.use(cors())

app.use(artRouter)

app.get("/health",cors(publicCorsConfig),(req:Request,res:Response)=>{
  res.send('ok')
})

app.listen(port,()=>{
  console.log(`listening on port ${port}`)
})