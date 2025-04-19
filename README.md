
 # NANBAN CHIT

#  Chit Fund Payment Tracker

A web application to manage and track chit fund payments made by users each month. Built using **MERN Stack (MongoDB, Express.js, React, Node.js)**.

---

## 📌 Features

- Admin login to view **defaulters** for each month
- User login to:
  - View monthly payment history
  - Pay via transaction id 
- Payment tracking with timestamps
- Defaulters calculation and total amount collected per month

---

## ⚙️ Tech Stack

- **Frontend**: React.js, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Others**: Mongoose, Axios

---

## 🚀 How to Run

### 🔧 Backend Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/chit-fund-tracker.git
   cd chit-fund-tracker/backend


User Routes:
  - POST /signup – Register a new user
  - POST /login – Login as user or admin
  - POST /user/username/Pay - pay for that user / register payment for the user
  - GET /user/username/paid– Get monthly payment history

Admin Routes:
  - GET /defaulters/:month – Get list of defaulters and total collection
  - GET /allusers – Get all usernames
  - POST /sendmail - To Make a Remainder for due




![Screenshot 2025-04-19 114006](https://github.com/user-attachments/assets/3a35ec29-dbf9-4254-9d47-738cf46f224a)
![Screenshot 2025-04-19 113955](https://github.com/user-attachments/assets/56488869-b57f-4a38-a0bd-6028824e1344)
![Screenshot 2025-04-19 114026](https://github.com/user-attachments/assets/2135bb73-a16c-481c-8588-7e2befde7d3f)
![Screenshot 2025-04-19 113944](https://github.com/user-attachments/assets/4a2b5040-9dbe-4368-8a5f-1abe3a243b39)



👨‍💻 Developer
Made with passion by Sujith Senthilraj



