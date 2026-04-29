import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    orgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      // required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },
    role: {
      type: Object,
      // required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["online", "offline", "away"],
      default: "offline",
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    // refreshToken: {
    //   type: String,
    //   default: null,
    // },
  },
  { timestamps: true },
);

// Index (important for login)
// userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
