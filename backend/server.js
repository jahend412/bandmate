require("dotenv").config();
const app = require("./app.js");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
