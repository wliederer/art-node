import "dotenv/config";
import express, { Response, Request } from "express";
import artRouter from "./routes/art.routes";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import Strategy from "passport-auth-token";
import { publicCorsConfig } from "./constants/corsOptions";

const app = express();
const port = 8080;
app.use(morgan("combined"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

passport.use(
  "token",
  new Strategy(async (token, done) => {
    if (token && token === process.env.TOKEN) {
      return done(null, token);
    } else {
      return done(null, false);
    }
  })
);

app.use(artRouter);

app.get("/health", cors(publicCorsConfig), (req: Request, res: Response) => {
  res.send("ok");
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
