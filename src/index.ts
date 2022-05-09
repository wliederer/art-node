import 'dotenv/config'
import express,{Response,Request} from 'express'
import artRouter from './routes/art.routes';
import helmet from 'helmet';

const app = express();
const port = 8080;

app.use(helmet())
app.use(express.json())

app.use(artRouter)

app.get("/health",(req:Request,res:Response)=>{
  res.send('ok')
})

app.listen(port,()=>{
  console.log(`listening on port ${port}`)
})