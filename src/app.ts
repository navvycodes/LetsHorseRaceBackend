import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import routes from "./routes";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Use Helmet to secure Express apps by setting various HTTP headers
app.use(helmet());
// Enable CORS for all routes
app.use(cors());
// Use Morgan for logging HTTP requests
app.use(morgan("dev"));

app.use("/horse-racing", routes);

export default app;
