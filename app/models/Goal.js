import mongoose from "mongoose"

const GoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: [true, "Goal text is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["daily", "weekly"],
      required: [true, "Goal type is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Check if the model already exists to prevent overwriting
const Goal = mongoose.models.Goal || mongoose.model("Goal", GoalSchema)

export default Goal
