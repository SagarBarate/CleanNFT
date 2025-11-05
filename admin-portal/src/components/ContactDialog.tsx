import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Send, Email } from '@mui/icons-material';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactDialog: React.FC<ContactDialogProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const getApiBaseUrl = (): string => {
    // Check for environment variable
    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    if (apiUrl) {
      return apiUrl;
    }
    // Fallback to localhost for development
    return 'http://localhost:3001';
  };

  const handleChange = (field: keyof ContactFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      setError('Message must be at least 10 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/v1/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim() || undefined,
          email: formData.email.trim(),
          subject: formData.subject.trim() || undefined,
          message: formData.message.trim(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message');
      }

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      // Close dialog after 2 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Email sx={{ color: '#00A86B' }} />
          <Typography variant="h6">Contact Us</Typography>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your message has been sent successfully! We'll get back to you soon.
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Name (optional)"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange('name')}
            disabled={loading || success}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            required
            variant="outlined"
            value={formData.email}
            onChange={handleChange('email')}
            disabled={loading || success}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Subject (optional)"
            fullWidth
            variant="outlined"
            value={formData.subject}
            onChange={handleChange('subject')}
            disabled={loading || success}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="Message"
            fullWidth
            required
            multiline
            rows={6}
            variant="outlined"
            value={formData.message}
            onChange={handleChange('message')}
            disabled={loading || success}
            placeholder="Tell us how we can help..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success}
            startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            sx={{
              bgcolor: '#00A86B',
              '&:hover': {
                bgcolor: '#008a5a',
              },
            }}
          >
            {loading ? 'Sending...' : success ? 'Sent!' : 'Send Message'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactDialog;


