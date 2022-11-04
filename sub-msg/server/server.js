import { createServer } from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import express from "express";
import { expressjwt } from "express-jwt";
import { readFile } from "fs/promises";
import jwt from "jsonwebtoken";
import { User } from "./db.js";
import { resolvers } from "./resolvers.js";

const PORT = 9000;
const JWT_SECRET = Buffer.from("+Z3zPGXY7v/0MoMm1p8QuHDGGVrhELGd", "base64");

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
  const { userId, password } = req.body;
  const user = await User.findOne((user) => user.id === userId);
  if (user && user.password === password) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

function getContext({ req }) {
  console.log(``);

  if (req.auth) {
    return { userId: req.auth.sub };
  }
  return {};
}

async function startGQLServer() {
  const typeDefs = await readFile("./schema.graphql", "utf8");

  const httpServer = createServer(app);

  const gqlServer = new ApolloServer({
    resolvers,
    typeDefs,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await gqlServer.start();

  app.use(
    "/api",
    expressMiddleware(gqlServer, {
      context: getContext,
    })
  );

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`Server running on port ${PORT}`);
  console.log(`💻 GraphQL endpoint: http://localhost:${PORT}/api`);
}

startGQLServer();
