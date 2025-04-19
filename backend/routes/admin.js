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
        
// //         // Fetch all users
// //         const allUsersData = await User.find();
// //         const allUsers = allUsersData.map(user => user.username);

// //         //  Fetch paid users for the selected month
// //         const paidUsers = await Payment.find({ month });

// //         const paid = paidUsers.map(payment => ({
// //             username: payment.username,
// //             amount: payment.amount,
// //             time: "Paid on " + payment.date
// //         }));

// //         // Identify defaulters
// //         const paidNames = paidUsers.map(payment => payment.username);
// //         const defaulters = allUsers.filter(user => !paidNames.includes(user));

// //         res.json({ defaulters, paid });
// //     } catch (err) {
// //         console.error("Error fetching defaulters:", err); //  Improved Debugging
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

// // //         //  Fetch all users from the database
// // //         const allUsersData = await User.find(); 
// // //         const allUsers = allUsersData.map(user => user.username); // Extract usernames
        
// // //         //  Fetch paid users for the given month
// // //         const paidUsers = await Payment.find({ month });

// // //         //  Create list of paid users with amount and date
// // //         const paid = paidUsers.map(payment => ({
// // //             username: payment.username,
// // //             amount: payment.amount,
// // //             time: "Paid on " + payment.date
// // //         }));

// // //         console.log(paid); // Debugging: This will now print the correct data

// // //         // Find defaulters (users who haven't paid)
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
  try {
      const month = req.params.month.toLowerCase();
      const allUsersData = await User.find();
      if (!allUsersData || allUsersData.length === 0) {
          return res.status(404).json({ error: "No users found in database" });
      }

      const allUsers = allUsersData.map(user => user.username);
      const paidUsers = await Payment.find({ month, status: "paid" ,amount: { $gt: 0 } });

      let totalamount = 0;
      const paid = paidUsers.map(payment => {
          totalamount += payment.amount;
          return {
              username: payment.username,
              amount: payment.amount,
              time: "Paid on " + new Date(payment.date).toDateString()
          };
      });

      const paidNames = paidUsers.map(p => p.username);
      const defaulters = allUsers.filter(user => !paidNames.includes(user));
      console.log("Defaulters:", defaulters);
      console.log("Paid Users:", paid);
      res.json({ defaulters, paid, totalamount });

  } catch (err) {
      console.error("Error in /defaulters/:month:", err);
      res.status(500).json({ error: err.message });
  }
});


router.get("/allusers", async (req, res) => {
    try {
        const allUsersData = await User.find();
        if (!allUsersData || allUsersData.length === 0) {
            return res.status(404).json({ error: "No users found in database" });
        }
        const allUsers = allUsersData.map(user => user.username);
        res.json({ allUsers });
    } catch (err) {
        console.error("Error fetching dashboard data:", err);   
        res.status(500).json({ error: err.message });
    }
});
const nodemailer = require('nodemailer');

router.post("/sendmail", async (req, res) => {
  try {
    const { month, defaulters } = req.body;

    const monthName = new Date(month).toLocaleString('default', { month: 'long' });
    const subject = `Payment Reminder for ${monthName} from NANBAN-CHIT`;
    const message = `Dear User,\n\nThis is a reminder that you have not paid your dues for the month of ${monthName}.\n\nPlease make the payment at your earliest convenience.\n\nThank you !`;

    const users = await User.find({ username: { $in: defaulters } });

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found for the provided defaulters" });
    }

    // ✅ First initialize the emailMap
    const emailMap = {};
    users.forEach(user => {
      emailMap[user.username] = user.email;
    });

    // ✅ Then do the logging
    console.log("Received defaulters:", defaulters);
    console.log("Users fetched from DB:", users.map(u => u.username));
    console.log("Emails to be sent to:", Object.values(emailMap));

    const transporter = nodemailer.createTransport({
      secure: true,
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'sujipjk03@gmail.com',
        pass: 'uhkb wujp ztxi qgtw' // be careful, consider using environment variables
      }
    });

    const emailPromises = defaulters.map(async (username) => {
      const email = emailMap[username];
      if (!email) return;
      const mailOptions = {
        from: 'sujipjk03@gmail.com',
        to: email,
        subject: subject,
        text: message
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);
    res.json({ message: `Reminder emails sent successfully to ${defaulters.length} defaulters` });

  } catch (err) {
    console.error("Error sending emails:", err);
    res.status(500).json({ error: "Failed to send emails: " + err.message });
  }
});






module.exports = router;