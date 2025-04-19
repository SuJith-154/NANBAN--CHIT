import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Container,
  Divider,
  Button
} from "@mui/material";

export default function AdminPage() {
  const [allUsers, setAllUsers] = useState([]);
  const [totalamt, setTotalamt] = useState(0);
  const [defaulters, setDefaulters] = useState([]);
  const [month, setMonth] = useState("January");

  const currentMonthIndex = new Date().getMonth();
  const months = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  const validMonths = months.slice(0, currentMonthIndex + 1);

  const fetchData = async (selectedMonth) => {
    try {
      const res = await axios.get(`http://localhost:3000/admin/defaulters/${selectedMonth}`);
      console.log("API Response:", res.data);
      setDefaulters(res.data.defaulters || []);
      setTotalamt(res.data.totalamount || 0);
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/admin/allusers");
      console.log("All users response:", res.data);
      setAllUsers(res.data.allUsers || []);
    } catch (err) {
      console.error("Error fetching all users:", err.message);
    }
  };

  const sendmail = async () => {
    try {
      const res = await axios.post("http://localhost:3000/admin/sendmail", {
        month,
        defaulters
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      alert(res.data.message || "Email sent successfully!");
    } catch (err) {
      console.error("Error sending email:", err.message);
      alert("Failed to send email. Please try again.");
    }
  };

  useEffect(() => {
    fetchData(month);
    fetchAllUsers();
  }, [month]);


  const filteredDefaulters = defaulters.filter((user) => user !== "admin");

  return (
    <Box sx={{ display: "flex" }}>
      
      <Box sx={{ width: 250, p: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Typography variant="h6" gutterBottom align="center">
          All Users
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          {allUsers.filter(user => user !== "admin").map((user, index) => (
            <ListItem key={index}>
              <ListItemText primary={`${index + 1}. ${user}`} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ p: 4 }}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
                Payment Info - {month}
              </Typography>

              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Month</InputLabel>
                <Select
                  value={month}
                  label="Select Month"
                  onChange={(e) => setMonth(e.target.value)}
                >
                  {validMonths.map((m) => (
                    <MenuItem key={m} value={m}>
                      {m}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography variant="h6" color="success.main" gutterBottom>
                Total amount collected for {month}: ₹{totalamt}
              </Typography>

              {/* Defaulters Section */}
              <Typography variant="h6" color="error.main" gutterBottom>
                Defaulters for {month}:
              </Typography>

              {filteredDefaulters.length === 0 ? (
                <Typography align="center">No defaulters for {month}</Typography>
              ) : (
                <List>
                  {filteredDefaulters.map((user, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`${index + 1}. ${user}`}
                        sx={{ color: "red" }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={sendmail}
                  disabled={filteredDefaulters.length === 0}
                >
                  Send Reminder
                </Button>
              </Box>
     

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 4, mb: 2 }}
        >
          © {new Date().getFullYear()} All rights reserved @Nanban. Crafted with passion by Sujith
        </Typography>
      </Container>
    </Box>
  );
}