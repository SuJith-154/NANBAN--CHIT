import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  TextField,
  Typography,
  Link,
} from '@mui/material';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
  });

  const handleAuth = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    if (isSignup && (!email.trim() || !phone.trim())) {
      setError('Email and phone number are required');
      return;
    }

  
    if (username === 'admin' && password === 'admin123') {
      navigate('/Admin');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const payload = {
        username: username.trim(),
        password: password.trim(),
        ...(isSignup && { email: email.trim(), phone: phone.trim() }),
      };

      const response = await api.post(endpoint, payload);

      if (response.data && response.data.success) {
        const redirectPath = `/user/${username.trim()}`;
        navigate(redirectPath);
      } else {
        setError(response.data?.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(
        err.response?.data?.error ||
        err.message ||
        'Connection error. Check your network.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <Card elevation={5} sx={{ width: '100%', borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" align="center" color="primary" fontWeight="bold" gutterBottom>
              NANBAN CHIT
            </Typography>

            <Typography variant="h6" align="center" sx={{ mb: 3 }}>
              {isSignup ? 'Create Account' : 'Login to Continue'}
            </Typography>

            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <form onSubmit={handleAuth}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                margin="normal"
                required
                autoFocus
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
              />

              {isSignup && (
                <>
                  <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                  <TextField
                    label="Phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                  />
                </>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, py: 1.2 }}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : isSignup ? 'Sign Up' : 'Login'}
              </Button>
            </form>

            <Box textAlign="center" mt={3}>
              <Typography variant="body2">
                {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Link
                  component="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                    setEmail('');
                    setPhone('');
                  }}
                  underline="hover"
                >
                  {isSignup ? 'Login here' : 'Sign up here'}
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4, mb: 2 }}>
        © {new Date().getFullYear()} All rights reserved @Nanban. Crafted with passion by Sujith
      </Typography>
    </Container>
  );
}
