import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Alert, CircularProgress, Paper, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setServerError('');
            const res = await login(data.email, data.password);
            
            // Redirect based on role (Note: ROLE_ prefix is stripped in AuthContext)
            if (res.role === 'ADMIN' || res.role === 'ROLE_ADMIN') {
                navigate('/admin/dashboard');
            } else if (res.role === 'SPONSOR' || res.role === 'ROLE_SPONSOR') {
                navigate('/sponsor/dashboard');
            } else if (res.role === 'VENDOR' || res.role === 'ROLE_VENDOR') {
                navigate('/vendors');
            } else {
                navigate('/');
            }
        } catch (error) {
            setServerError(error.toString());
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] bg-slate-50 px-4">
            <Paper elevation={3} className="w-full max-w-md p-8 rounded-xl">
                <div className="text-center mb-6">
                    <Typography variant="h4" component="h1" className="font-bold text-gray-800">
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-2">
                        Sign in to access your Food Dhuniya account
                    </Typography>
                </div>

                {serverError && (
                    <Alert severity="error" className="mb-4">
                        {serverError}
                    </Alert>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            required: 'Password is required'
                        })}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />

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
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                </form>

                <div className="text-center mt-6">
                    <Typography variant="body2" className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary-main hover:text-primary-dark font-semibold">
                            Register here
                        </Link>
                    </Typography>
                </div>
            </Paper>
        </div>
    );
};

export default Login;
