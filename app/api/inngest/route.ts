import { serve } from "inngest/next";
import { inngest } from "@/lib/ingest/client";
import { helloWorld } from "@/lib/ingest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    helloWorld
  ],
});