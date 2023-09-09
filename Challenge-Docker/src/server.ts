import { Server } from "https://deno.land/std@0.201.0/http/server.ts";
import { createClient } from "npm:redis@^4.5";

// make a connection to the local instance of redis
const client = createClient({
    url: "redis://redis:6379",
})

client.on("error", (error) => {
  console.error(error);
});

await client.connect();

let value = await client.get("counter");
if (value === null) {
    value = "0";
    await client.set("counter", value);
    console.log("counter initialized");
}

const server = new Server({
  handler: async (req) => {
    if (req.url === "http://localhost:8000/") {  // Check if the request is for the root path
        let value = await client.get("counter");
        value = String(Number(value) + 1);
        await client.set("counter", value);

        const logEntry = `${new Date().toISOString()} - Current Value: ${value} \n`;
        await Deno.writeTextFile("/logs/access.log", logEntry, { append: true });

        return new Response(`Counter Value: ${value}`);
      } else {
        return new Response("Not Found", { status: 404 });
      }
  },

  port: 8000,
});

server.listenAndServe();

// Deno.serve((_req) => new Response("Hello Docker!"));