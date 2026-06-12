// import "./types.js";
// import { app } from "./app.js";
// import { env } from "./config/env.js";

// app.listen(env.port, () => {
//   console.log(`Smart Shop API running on http://localhost:${env.port}`);
// });



import "./types.js";
import { app } from "./app.js";
import { env } from "./config/env.js";

app.listen(env.port, "0.0.0.0", () => {
  console.log(`Smart Shop API running on http://0.0.0.0:${env.port}`);
});