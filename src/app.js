import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "2mb" }));
app.use("/api", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API corriendo en: ${port}`));
