import mongoose from "mongoose";

const LogSchema = new mongoose.Schema({
  level: String,
  message: String,
  resourceId: String,
  timestamp: String,
  traceId: String,
  commit: String,
  metaData: {
    parentResourceId: String,
  },
});

export default mongoose.model("Log", LogSchema);
