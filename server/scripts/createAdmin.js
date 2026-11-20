
require("dotenv").config();

const dns = require("dns");

// Use Google DNS for MongoDB Atlas SRV lookup
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    const {
      MONGO_URI,
      ADMIN_NAME,
      ADMIN_EMAIL,
      ADMIN_PASSWORD,
    } = process.env;

    if (!MONGO_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Required environment variables are missing.");
    }

    if (ADMIN_PASSWORD.length < 12) {
      throw new Error("Admin password must be at least 12 characters.");
    }

    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB Connected!");

    const normalizedEmail = ADMIN_EMAIL.toLowerCase().trim();

    // Check existing account
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log("Admin account already exists.");
      } else {
        throw new Error(
          "This email already belongs to a customer. Use another admin email."
        );
      }

      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin
    await User.create({
      fullName: ADMIN_NAME.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully!");
    console.log(`Admin Email: ${normalizedEmail}`);

  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;

  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

createAdmin();
