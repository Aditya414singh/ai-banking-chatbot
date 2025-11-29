import express from "express";
import cors from "cors";
import docsRouter from "./routes/doc.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // your React app
  })
);
app.use("/api", docsRouter);
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});
app.listen(5002, () => console.log("Server running at 5002"));
