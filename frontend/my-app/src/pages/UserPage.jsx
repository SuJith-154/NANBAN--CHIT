import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';

export default function UserPage() {
  const { name } = useParams();
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [txnId, setTxnId] = useState('');
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(false);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const currentMonthIndex = new Date().getMonth();
  const validMonths = months.slice(0, currentMonthIndex + 1);

  const API_BASE = 'http://localhost:3000/user';

  const handlePay = async () => {
    if (!month || !txnId || !amount) {
      alert('Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/${name}/pay`, {
        month:month.toLowerCase(),
        amount: Number(amount),
        T_ID: txnId
      });

      if (res.data.success) {
        alert(res.data.message || 'Payment recorded successfully');
        fetchPayments();
        setMonth('');
        setAmount('');
        setTxnId('');
      } else {
        alert(res.data.error || 'Payment failed');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert(err.response?.data?.error || 'Server error! Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/${name}/paid`);
      console.log("API Response:", res.data);
      setPaymentData(res.data.payments || {});
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
  };

  useEffect(() => {
    if (name) fetchPayments();
  }, [name]);


  const firstColumnMonths = months.slice(0, Math.ceil(months.length / 2));
  const secondColumnMonths = months.slice(Math.ceil(months.length / 2));
  const year = new Date().getFullYear(); 

  return (
    <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center" color="primary">
        NANBAN CHIT
      </Typography>

      <Typography variant="h6" gutterBottom align="center">
        Payment DashBoard for {name}
      </Typography>

      <Grid container spacing={4}>
        {/* Left Side - Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Month</InputLabel>
                <Select value={month} onChange={(e) => setMonth(e.target.value)} label="Month">
                  {validMonths.map((m) => (
                    <MenuItem key={m} value={m}>{m}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Amount"
                fullWidth
                margin="normal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <TextField
                label="Transaction ID"
                fullWidth
                margin="normal"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handlePay}
                disabled={loading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'PAY'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Side - Payment Status */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Status for year : {year}
              </Typography>

              <Grid container spacing={4} alignItems="stretch">
                {/* First Column */}
                <Grid item xs={12} md={6}>
                  {firstColumnMonths.map((m) => {
                    const monthData = paymentData[m.toLowerCase()] || { status: 'not paid' };
                    const isPaid = monthData.status === 'paid';
                    return (
                      <Box
                        key={m}
                        sx={{
                          backgroundColor: isPaid ? '#e8f5e9' : '#ffebee',
                          p: 1.5,
                          mb: 1,
                          borderRadius: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography>{m}: {isPaid ? 'Paid' : 'Pending'}</Typography>
                        {isPaid && monthData.date && (
                          <Typography variant="body2" color="textSecondary">
                            {new Date(monthData.date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Grid>

                <Grid item xs={12} md={6}>
                  {secondColumnMonths.map((m) => {
                    const monthData = paymentData[m.toLowerCase()] || { status: 'not paid' };
                    const isPaid = monthData.status === 'paid';
                    return (
                      <Box
                        key={m}
                        sx={{
                          backgroundColor: isPaid ? '#e8f5e9' : '#ffebee',
                          p: 1.5,
                          mb: 1,
                          borderRadius: 1,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography>{m}: {isPaid ? 'Paid' : 'Pending'}</Typography>
                        {isPaid && monthData.date && (
                          <Typography variant="body2" color="textSecondary">
                            {new Date(monthData.date).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    );
                  })}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()}  All rights reserved @nanban.
          Crafted with passion by Sujith 
      </Typography>

    </Box>
  );
}