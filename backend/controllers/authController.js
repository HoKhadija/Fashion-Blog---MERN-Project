const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");

/**-------------------------------------------
 *  @desc     Register New User
 *  @route   /api/auth/register
 *  @method   POST
 *  @access   public
---------------------------------------------*/
module.exports.registerUserCTRL = asyncHandler(async (req, res) => {
    // validation
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    // isUser already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "User Already Exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // new user and save it to DB
    user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
    })
    await user.save();

    // @TODO - Sending email (verify account)

    // Send a response to client
    res.status(201).json({ message: "you Registered Successfully, Please Login" });
})

/**-------------------------------------------
 *  @desc     Login User
 *  @route    /api/auth/login
 *  @method   POST
 *  @access   public
---------------------------------------------*/
module.exports.loginUserCtrl = asyncHandler (async (req, res) => {
    // validation
    
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }

    // isUser exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // check if password is correct
    const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // @TODO - Sending email (verify account if not verified)

    // Generate Token (jwt)
    const token = user.generateAuthToken();

    // Send a response to client
    res.status(200).json({ 
        _id: user._id,
        isAdmin: user.isAdmin,
        profilePhoto: user.profilePhoto,
        token,
        username: user.username,
    });
})