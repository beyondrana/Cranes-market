import User from "../Models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, products } = req.body;

    // Check required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All required fields are mandatory" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Create and save user (password is hashed via pre-save hook)
    const user = new User({
      name,
      email,
      phone,
      password,
      role,       // Optional, defaults to 'customer' if not provided
      products    // Optional
    });

    await user.save();

    // Generate access token
    const token = user.generateAccessToken();

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        products: user.products,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Check password
      const isMatch = await user.isPasswordCorrect(password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      // Generate token
      const token = user.generateAccessToken();
      const loggedInUser = await User.findById(user._id).select("-password");

        //allows secure transfer of cookies, and only accessible by the server only
        const options = {
            httpOnly: true, 
            secure: true
        }

        // Send response
        return res.status(200)
        .cookie("token", token, options)
        .json({ message: "User Login successful", token, user: loggedInUser });
  
      
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  const logoutUser = (req, res) => {
    try {
      // Clear the cookie by setting it with an expired date
      res.clearCookie("token", {
        httpOnly: true,
        secure: true, 
      });
  
      // Send response
      return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      console.error("Logout Error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  

export {registerUser,loginUser,logoutUser};
