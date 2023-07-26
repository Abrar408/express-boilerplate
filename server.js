const env = require("dotenv");
const path = require("path");

if (process.env.NODE_ENV === "development") {
  env.config({ path: path.join(__dirname, ".env.development") });
} else if (process.env.NODE_ENV === "staging") {
  env.config({ path: path.join(__dirname, ".env.staging") });
} else if (process.env.NODE_ENV === "test") {
  env.config({ path: path.join(__dirname, ".env.test") });
} else {
  env.config();
}

const app = require("./app");

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});
