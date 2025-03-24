import express from "express";
import mongoose from "mongoose";
import Reading from "../models/Reading.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// @route   POST api/readings
// @desc    Create a new reading
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { heartRate, avgHeartRate, spo2, timestamp } = req.body;

    const newReading = new Reading({
      userId: req.user.id,
      heartRate,
      avgHeartRate,
      spo2,
      timestamp: timestamp || Date.now(),
    });

    const reading = await newReading.save();
    res.json(reading);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/readings
// @desc    Get all readings for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const readings = await Reading.find({ userId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(100);

    res.json(readings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/readings/latest
// @desc    Get latest reading for a user
// @access  Private
router.get("/latest", auth, async (req, res) => {
  try {
    const reading = await Reading.findOne({ userId: req.user.id }).sort({
      timestamp: -1,
    });

    if (!reading) {
      return res.status(404).json({ message: "No readings found" });
    }

    res.json(reading);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/readings/stats
// @desc    Get reading statistics for a user
// @access  Private
router.get("/stats", auth, async (req, res) => {
  try {
    // Get average heart rate and SpO2 for the last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const stats = await Reading.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user.id),
          timestamp: { $gte: oneDayAgo },
        },
      },
      {
        $group: {
          _id: null,
          avgHeartRate: { $avg: "$heartRate" },
          avgSpO2: { $avg: "$spo2" },
          minHeartRate: { $min: "$heartRate" },
          maxHeartRate: { $max: "$heartRate" },
          minSpO2: { $min: "$spo2" },
          maxSpO2: { $max: "$spo2" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return res
        .status(404)
        .json({ message: "No readings found in the last 24 hours" });
    }

    res.json(stats[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

export default router;