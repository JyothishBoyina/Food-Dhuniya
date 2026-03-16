import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, CircularProgress, Paper, Typography, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const BookTicket = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            generalQuantity: 0,
            vipQuantity: 0
        }
    });
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const generalQuantity = watch('generalQuantity', 0);
    const vipQuantity = watch('vipQuantity', 0);

    const totalAmount = (parseInt(generalQuantity || 0) * 299) + (parseInt(vipQuantity || 0) * 799);

    const isProceedDisabled = totalAmount === 0 || isLoading;

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setServerError('');

            if (totalAmount === 0) {
                setServerError('Please select at least one ticket to proceed.');
                setIsLoading(false);
                return;
            }

            // Simulate Mock Online Payment Flow
            setSuccessMessage('Initiating payment gateway...');
            await new Promise(resolve => setTimeout(resolve, 1500)); 

            const requestData = {
                userId: user.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                generalQuantity: parseInt(data.generalQuantity || 0),
                vipQuantity: parseInt(data.vipQuantity || 0)
            };

            await api.post('/tickets/book', requestData);

            setSuccessMessage('Payment successful! Generating QR code and sending confirmation email...');
            
            setTimeout(() => {
                navigate('/tickets/my');
            }, 2500);

        } catch (error) {
            console.error(error);
            const serverMsgs = error.response?.data?.errors ? JSON.stringify(error.response.data.errors) : null;
            const fallbackMsg = error.response?.data ? JSON.stringify(error.response.data) : 'Failed to book ticket. Please try again.';
            setServerError(error.response?.data?.message || serverMsgs || fallbackMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12 bg-slate-50 px-4 min-h-[80vh]">
            <Paper elevation={3} className="w-full max-w-3xl p-8 md:p-10 rounded-2xl">
                <div className="text-center mb-10">
                    <Typography variant="h4" component="h1" className="font-extrabold text-secondary-main">
                        Ticket Booking
                    </Typography>
                    <Typography variant="body1" className="text-gray-500 mt-2">
                        Secure your spot at Food Dhuniya 2026
                    </Typography>
                </div>

                {serverError && (
                    <Alert severity="error" className="mb-6 rounded-xl">
                        {serverError}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" className="mb-6 rounded-xl">
                        {successMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Attendee Details */}
                    <div>
                        <Typography variant="h6" className="font-bold text-gray-800 mb-4">Attendee Details</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    variant="outlined"
                                    {...register('name', { required: 'Name is required' })}
                                    error={!!errors.name}
                                    helperText={errors.name?.message}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    variant="outlined"
                                    type="email"
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number (Optional)"
                                    variant="outlined"
                                    {...register('phone')}
                                />
                            </Grid>
                        </Grid>
                    </div>

                    <Divider />

                    {/* Ticket Selection */}
                    <div>
                        <Typography variant="h6" className="font-bold text-gray-800 mb-4">Select Tickets</Typography>
                        <Grid container spacing={4} alignItems="center">
                            
                            {/* General */}
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h6" className="font-bold text-gray-800">
                                    General Entry — ₹299
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                    Access to all food zones and live entertainment areas.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    variant="outlined"
                                    type="number"
                                    InputProps={{ inputProps: { min: 0, max: 20 } }}
                                    {...register('generalQuantity', { min: 0, max: 20 })}
                                />
                            </Grid>

                            {/* VIP */}
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h6" className="font-bold border-t pt-4 text-primary-dark mt-2">
                                    VIP Entry — ₹799
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                    Skip-the-line access, exclusive seating, and complimentary welcome drink.
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} className="mt-2 text-primary-dark border-t pt-4">
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    variant="outlined"
                                    type="number"
                                    InputProps={{ inputProps: { min: 0, max: 10 } }}
                                    {...register('vipQuantity', { min: 0, max: 10 })}
                                />
                            </Grid>

                        </Grid>
                    </div>

                    <Divider />

                    {/* Total & Submit */}
                    <div className="bg-orange-50 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center mt-6">
                        <div className="mb-4 sm:mb-0 text-center sm:text-left">
                            <Typography variant="body1" className="text-gray-600 font-medium">Total Amount</Typography>
                            <Typography variant="h4" className="font-black text-primary-main">
                                ₹{totalAmount.toLocaleString('en-IN')}
                            </Typography>
                        </div>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            disabled={isProceedDisabled}
                            className={`h-14 px-8 font-bold text-lg rounded-xl shadow-lg transition-transform ${!isProceedDisabled ? 'hover:scale-105 bg-primary-main hover:bg-primary-dark text-white' : 'bg-gray-300'}`}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Proceed to Pay'}
                        </Button>
                    </div>
                </form>
            </Paper>
        </div>
    );
};

export default BookTicket;
