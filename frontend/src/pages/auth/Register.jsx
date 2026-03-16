import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, CircularProgress, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setServerError('');

            // Send role directly as provided by backend RegisterDTO
            const requestData = {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role
            };

            await registerUser(requestData);

            setSuccessMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            setServerError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center py-12 bg-slate-50 px-4 min-h-[80vh]">
            <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
                <div className="text-center mb-6">
                    <Typography variant="h4" component="h1" className="font-bold text-gray-800">
                        Create Account
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-2">
                        Join Food Dhuniya to book tickets and explore
                    </Typography>
                </div>

                {serverError && (
                    <Alert severity="error" className="mb-4">
                        {serverError}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" className="mb-4">
                        {successMessage}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <TextField
                        fullWidth
                        label="Full Name"
                        variant="outlined"
                        {...register('name', { required: 'Name is required' })}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                    />



                    <TextField
                        fullWidth
                        label="Email Address"
                        variant="outlined"
                        type="email"
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address"
                            }
                        })}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />

                    <TextField
                        fullWidth
                        label="Password"
                        variant="outlined"
                        type="password"
                        {...register('password', {
                            required: 'Password is required',
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

                    <FormControl fullWidth error={!!errors.role}>
                        <InputLabel id="role-label">Account Type</InputLabel>
                        <Select
                            labelId="role-label"
                            label="Account Type"
                            defaultValue="VISITOR"
                            {...register('role', { required: 'Role is required' })}
                        >
                            <MenuItem value="VISITOR">Visitor (Buy Tickets)</MenuItem>
                            <MenuItem value="VENDOR">Vendor (Sell Food)</MenuItem>
                            <MenuItem value="SPONSOR">Sponsor (Advertise Product)</MenuItem>
                            <MenuItem value="ADMIN">Administrator (Management)</MenuItem>
                        </Select>
                        {errors.role && <p className="text-red-500 text-xs mt-1 px-3">{errors.role.message}</p>}
                    </FormControl>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={isLoading}
                        className="mt-6 bg-primary-main hover:bg-primary-dark h-12"
                        sx={{ mt: 2 }}
                    >
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                    </Button>
                </form>

                <div className="text-center mt-6">
                    <Typography variant="body2" className="text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-main hover:text-primary-dark font-semibold">
                            Sign in
                        </Link>
                    </Typography>
                </div>
            </Paper>
        </div>
    );
};

export default Register;
