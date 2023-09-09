import { Server } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "npm:redis@^4.5";

const client = createClient({
    url: "redis://redis:6379",
});

client.on("error", (error) => {
  console.error(error);
});

await client.connect();

const server = new Server({
  handler: async (req) => {
    const value = await client.get("counter");
    return new Response(`Counter Value: ${value}`);
  },
  port: 8001,
});

server.listenAndServe();
