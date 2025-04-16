import { useEffect, useState } from "react";
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
  Container
} from "@mui/material";

export default function AdminPage() {
  const [defaulters, setDefaulters] = useState([]);
  const [month, setMonth] = useState("January");

  const currentMonthIndex = new Date().getMonth();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const validMonths = months.slice(0, currentMonthIndex + 1);

  useEffect(() => {
    fetch(`http://localhost:3000/admin/defaulters/${month}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then(data => setDefaulters(data.defaulters || []))
      .catch(err => console.error("Error fetching defaulters:", err));
  }, [month]);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            Defaulters List - {month}
          </Typography>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Month</InputLabel>
            <Select
              value={month}
              label="Select Month"
              onChange={(e) => setMonth(e.target.value)}
            >
              {validMonths.map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {defaulters.length === 0 ? (
            <Typography color="success.main" align="center">
              ✅ No defaulters for {month}
            </Typography>
          ) : (
            <List>
            {defaulters
              .filter((user) => user !== 'admin')
              .map((user, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`${index + 1}. ${user}`}
                    primarytext={{ sx: { color: 'red' } }}
                  />
                </ListItem>
              ))}
          </List>
          
          )}
        </CardContent>
      </Card>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, mb: 2 }}>
     © {new Date().getFullYear()} All rights reserved @Nanban. Crafted with passion by Sujith
        </Typography>
    </Container>
  );
}
