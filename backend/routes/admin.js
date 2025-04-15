// const express = require("express");
// const Payment = require("../models/payment");
// const user = require("../models/userdata");
// const router = express.Router();
// router.get("/defaulters/:month", async (req, res) => {
//     try {
//         const { month } = req.params;
        
//         const allUsersData= await user.find();
//         const allUsers = allUsersData.map(user => user.username);
//         const paidUsers = await Payment.find({ month });
//         console.log(month);
//         console.log(allUsers);
//         console.log(paidUsers);
//             const paid = paidUsers.map(payment => ( {
//                 username: payment.username,
//                 amount:payment.amount,
//                 time : "paid on" + payment.date

//             }));
//         const paidNames = paidUsers.map(payment => payment.username);
//         const defaulters = allUsers.filter(user => !paidNames.includes(user));

//         res.json({ defaulters , paid });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;


// // const express = require("express");
// // const Payment = require("../models/payment");
// // const User = require("../models/userdata");
// // const router = express.Router();

// // router.get("/defaulters/:month", async (req, res) => {
// //     try {
// //         const { month } = req.params;
        
// //         // ✅ Fetch all users
// //         const allUsersData = await User.find();
// //         const allUsers = allUsersData.map(user => user.username);

// //         // ✅ Fetch paid users for the selected month
// //         const paidUsers = await Payment.find({ month });

// //         const paid = paidUsers.map(payment => ({
// //             username: payment.username,
// //             amount: payment.amount,
// //             time: "Paid on " + payment.date
// //         }));

// //         // ✅ Identify defaulters
// //         const paidNames = paidUsers.map(payment => payment.username);
// //         const defaulters = allUsers.filter(user => !paidNames.includes(user));

// //         res.json({ defaulters, paid });
// //     } catch (err) {
// //         console.error("Error fetching defaulters:", err); // ✅ Improved Debugging
// //         res.status(500).json({ error: err.message });
// //     }
// // });

// // module.exports = router;


// // // const express = require("express");
// // // const Payment = require("../models/Payment");
// // // const User = require("../models/userdata");  // Corrected variable name (capital 'U' for model)
// // // const router = express.Router();

// // // router.get("/defaulters/:month", async (req, res) => {
// // //     try {
// // //         const { month } = req.params;

// // //         // ✅ Fetch all users from the database
// // //         const allUsersData = await User.find(); 
// // //         const allUsers = allUsersData.map(user => user.username); // Extract usernames
        
// // //         // ✅ Fetch paid users for the given month
// // //         const paidUsers = await Payment.find({ month });

// // //         // ✅ Create list of paid users with amount and date
// // //         const paid = paidUsers.map(payment => ({
// // //             username: payment.username,
// // //             amount: payment.amount,
// // //             time: "Paid on " + payment.date
// // //         }));

// // //         console.log(paid); // Debugging: This will now print the correct data

// // //         // ✅ Find defaulters (users who haven't paid)
// // //         const paidNames = paidUsers.map(payment => payment.username);
// // //         const defaulters = allUsers.filter(user => !paidNames.includes(user));

// // //         res.json({ defaulters, paid }); // Return both defaulters and paid users
// // //     } catch (err) {
// // //         res.status(500).json({ error: err.message });
// // //     }
// // // });

// // // module.exports = router;

const express = require("express");
const Payment = require("../models/payment");
const User = require("../models/userdata");
const router = express.Router();

router.get("/defaulters/:month", async (req, res) => {
    const cors = require("cors");
    app.use(cors({ origin: "http://localhost:3000", credentials: true }));
    try {
        const { month } = req.params;

        const allUsersData = await User.find();
        if (!allUsersData || allUsersData.length === 0) {
            return res.status(404).json({ error: "No users found in database" });
        }

        const allUsers = allUsersData.map(user => user.username);

        const paidUsers = await Payment.find({ month });
        if (!paidUsers || paidUsers.length === 0) {
            return res.status(404).json({ error: "No payments found for this month" });
        }

        console.log("Month:", month);
        console.log("All Users:", allUsers);
        console.log("Paid Users:", paidUsers);

        const paid = paidUsers.map(payment => ({
            username: payment.username,
            amount: payment.amount,
            time: "Paid on " + payment.date
        }));

        const paidNames = paidUsers.map(payment => payment.username);
        const defaulters = allUsers.filter(user => !paidNames.includes(user));

        res.json({ defaulters, paid ,paidNames});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;