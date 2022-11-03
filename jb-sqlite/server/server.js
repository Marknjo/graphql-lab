import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { expressjwt } from "express-jwt";
import { readFile } from "fs/promises";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { createCompanyLoader, db } from "./db.js";
import { resolvers } from "./resolvers.js";

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

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.select().from("users").where("email", email).first();
  if (user && user.password === password) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

async function startGQLServer() {
  const typeDefs = await readFile("./schema.graphql", "utf-8");
  const httpServer = createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  const context = async ({ req }) => {
    const companyLoader = createCompanyLoader();

    if (req.auth) {
      const user = await db
        .select()
        .from("users")
        .where("id", req.auth.sub)
        .first();
      return { user, companyLoader };
    }
    return { companyLoader };
  };

  app.use("/api", expressMiddleware(server, { context }));

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`Server running on port ${PORT}`);
  console.log(`💻 GraphQL endpoint: http://localhost:${PORT}/api`);
}

startGQLServer();
