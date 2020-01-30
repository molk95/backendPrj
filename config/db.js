const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
// mongoose.set("useUnifiedTopology", true);

const connnectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log("MongoDB Connected....");
  } catch (err) {
    console.error(err.msg);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connnectDB;
