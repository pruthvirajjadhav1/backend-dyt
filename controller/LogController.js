import Log from "../models/LogModel.js";

export const create = async (req, res) => {
  try {
    const logData = new Log(req.body);

    if (!logData) {
      return res.status(400).json({ error: "Invalid log data" });
    }

    await logData.save();

    io.emit("logIngested", logData);

    res.status(201).json({ msg: "Log ingested successfully", log: logData });
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getAll = async (req, res) => {
  try {
    const logData = await Log.find();

    if (!logData || logData.length === 0) {
      return res.status(404).json({ msg: "Log data not found" });
    }

    res.status(200).json(logData);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getOne = async (req, res) => {
  try {
    const {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      parentResourceId,
    } = req.query;

    const pipeline = [];

    const matchStage = {};
    if (level) matchStage.level = level;
    if (message) matchStage.message = { $regex: message, $options: "i" };
    if (resourceId) matchStage.resourceId = resourceId;
    if (timestamp) matchStage.timestamp = timestamp;
    if (traceId) matchStage.traceId = traceId;
    if (spanId) matchStage.spanId = spanId;
    if (commit) matchStage.commit = commit;
    if (parentResourceId)
      matchStage["metaData.parentResourceId"] = parentResourceId;

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    const logs = await Log.aggregate(pipeline);

    if (!logs || logs.length === 0) {
      return res.status(404).json({ msg: "No matching logs found" });
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error filtering logs:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};
