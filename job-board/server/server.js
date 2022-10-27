import cors from "cors";
import express from "express";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { User } from "./db.js";

const PORT = 9000;
const JWT_SECRET = Buffer.from("Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt", "base64");

const app = express();
app.use(
  cors(),
  express.json(),
  expressjwt({
    algorithms: ["HS256"],
    credentialsRequired: false,
    secret: JWT_SECRET,
  })
);

app.get("/health", (req, res) => {
  res.send(
    `
    <div style="
           margin: 30px auto; 
           display: flex; 
           flex-direction: 
           column; 
           align-items: center"
      >
      <h1 style="
          line-height: 1; 
          margin: 5px 0;
          text-transform: capitalize;
          ">Welcome to JOB's Board GraphQl API</h1>
      <p>API working as expected</p>
    </div>
    `
  );
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne((user) => user.email === email);
  if (user && user.password === password) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

app.listen({ port: PORT }, () => {
  console.log(`Server running on http://localhost:${PORT}/health`);
});
