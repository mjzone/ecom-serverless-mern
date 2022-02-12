const User = require("../models/User");
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// PUT USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString();
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(1)
            : await User.find();

        const usersWithoutPasswords = users.map(u => {
            return {
                name: u.username,
                email: u.email,
                isAdmin: u.isAdmin
            }
        })
        res.status(200).json(usersWithoutPasswords);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE USER
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    try {
        const date = new Date();
        const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

        const data = await User.aggregate([
            {
                // First get all users matching the below query
                $match: {
                    createdAt: { $gte: lastYear }
                }
            },
            {
                // Project only following attributes. Attributes could be already exising values or computed value like below. E.g. month variable
                $project: {
                    month: { $month: "$createdAt" }
                }
            },
            {
                // Group the items and return aggregated results
                $group: {
                    _id: "$month", // group by month variable we created above
                    total: { $sum: 1 } // calculate every registered user in each month
                }
            }
        ]);
        res.status(200).json(data);

    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;