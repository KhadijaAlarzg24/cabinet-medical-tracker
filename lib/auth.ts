import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { initializeUserBoard } from "./init-user-board";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const client = new MongoClient(mongoUri);

await client.connect();

const db = client.db("cabinet-medical-tracker");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  trustedOrigins: [
    "https://cabinet-medical-tracker.vercel.app",
    "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await initializeUserBoard(user.id);
        },
      },
    },
  },
  advanced: {
    cookies: {
      session_token: {
        attributes: {
          sameSite: "none",
          secure: true,
        },
      },
    },
  },
});