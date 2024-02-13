const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const logbookSchema = new Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: true,
  },
  entries: [mongoose.SchemaTypes.ObjectId],
});

module.exports = Logbook = mongoose.model("Logbook", logbookSchema);
