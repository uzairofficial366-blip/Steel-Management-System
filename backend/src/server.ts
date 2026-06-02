import "./types.js";
import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, () => {
  console.log(`Smart Shop API running on http://localhost:${env.port}`);
});
