const express = require("express");
const app = express();
const UserRoutes=require("./Routes/user");
const ResumeRoutes=require("./Routes/resume");
const PORT = 4000;

require("./conn");
app.use(express.json());
app.use("/api/user",UserRoutes);
app.use("api/resume",ResumeRoutes);

app.listen(PORT, () => {
  console.log("app is running on", PORT);
});
