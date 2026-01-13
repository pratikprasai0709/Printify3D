import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

export async function register(req, res) {
  try {
    const { username, password } = req.body;

    // check if user exists
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    //SEND RESPONSE HERE
    return res.status(201).json({
      message: "User registered successfully",
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server error",
      error: e.message,
    });
  }
}
  export async function login(req, res) {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user) return res.status(401).send("user not found");

        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).send("Invalid password");

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});
        res.json({message: "Login Sucessfull", user, token});
    }catch(e){
        console.log(e);
        
        return res.status(500).send(e);
    }
  }