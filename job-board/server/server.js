import { readFile } from "fs/promises";
import { createServer } from "http";
import cors from "cors";
import express, { json } from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { expressjwt } from "express-jwt";
import jwt from "jsonwebtoken";
import { User } from "./db.js";
import { resolvers } from "./resolvers/jb-resolvers.js";

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

/// Setup GraphQL Server
async function startApolloServer() {
  /// Load GQL Schema
  const typeDefs = await readFile("./schemas/schema.graphql", "utf8");

  /// Start & Create GQL Server
  const httpServer = createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  /// Setup api route
  app.use(
    "/api",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        if (!req.auth) return { id: null };

        return { id: req.auth.sub };
      },
    })
  );

  /// Listen to server
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  /// Show logs
  console.info(`\n🧑‍⚕️Server health check on http://localhost:${PORT}/health`);
  console.info(` 💻  GraphQl server running on http://localhost:${PORT}/api\n`);
}

startApolloServer();
