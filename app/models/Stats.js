import mongoose from "mongoose"

const StatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completed: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    completedByCategory: {
      type: Map,
      of: Number,
      default: {},
    },
    completedByPriority: {
      type: Map,
      of: Number,
      default: {},
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastCompletedDate: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
)

// Check if the model already exists to prevent overwriting
const Stats = mongoose.models.Stats || mongoose.model("Stats", StatsSchema)

export default Stats
