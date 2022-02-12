const Product = require("../models/Product");
const CryptoJS = require("crypto-js");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

// POST Product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);

    } catch (err) {
        res.status(500).json(err);
    }
});

// PUT Product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE Product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET ALL Products
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if (qNew) {
            products = Product.find().sort({ craetedAt: -1 }).limit(5);
        } else if (qCategory) {
            products = Product.find({
                categories: {
                    $in: [qCategory]
                }
            })
        } else {
            products = new Product.find();
        }
        res.status(200).json(products);

    } catch (err) {
        res.status(500).json(err);
    }
});



// // GET USER STATS
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//     try {
//         const date = new Date();
//         const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

//         const data = await User.aggregate([
//             {
//                 // First get all users matching the below query
//                 $match: {
//                     createdAt: { $gte: lastYear }
//                 }
//             },
//             {
//                 // Project only following attributes. Attributes could be already exising values or computed value like below. E.g. month variable
//                 $project: {
//                     month: { $month: "$createdAt" }
//                 }
//             },
//             {
//                 // Group the items and return aggregated results
//                 $group: {
//                     _id: "$month", // group by month variable we created above
//                     total: { $sum: 1 } // calculate every registered user in each month
//                 }
//             }
//         ]);
//         res.status(200).json(data);

//     } catch (err) {
//         res.status(500).json(err);
//     }
// });

module.exports = router;