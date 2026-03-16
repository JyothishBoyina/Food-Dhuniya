import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
    TextField, Button, Alert, CircularProgress, 
    Paper, Typography, FormControl, InputLabel, 
    Select, MenuItem, Box, Grid, Card, CardContent 
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const SponsorDashboard = () => {
    const { user, token } = useAuth();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [sponsorData, setSponsorData] = useState(null);

    useEffect(() => {
        fetchSponsorData();
    }, []);

    const fetchSponsorData = async () => {
        try {
            setIsFetching(true);
            const response = await axios.get('http://localhost:8080/api/sponsors/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data;
            setSponsorData(data);
            // Pre-fill form
            setValue('name', data.businessName);
            setValue('logoUrl', data.logoUrl);
            setValue('website', data.website || '');
            setValue('category', data.category);
        } catch (error) {
            console.error('Error fetching sponsor data:', error);
            if (error.response?.status !== 404) {
                setMessage({ type: 'error', text: 'Failed to load sponsor profile.' });
            }
        } finally {
            setIsFetching(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setMessage({ type: '', text: '' });

            // Map data to SponsorRegistrationRequest DTO or your custom endpoint
            const requestData = {
                userId: user.id,
                businessName: data.name,
                contactPerson: user.name, // Derived from auth user
                email: user.email,         // Derived from auth user
                category: data.category,
                logoUrl: data.logoUrl,
                bannerUrl: data.website // Mapping website to bannerUrl or ignore it
            };

            const endpoint = 'http://localhost:8080/api/sponsors/register';
            const response = await axios.post(endpoint, requestData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSponsorData(response.data);
            setMessage({ type: 'success', text: 'Sponsor Profile updated successfully!' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile.' });
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return (
            <Box className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Typography variant="h4" className="font-bold text-gray-800 mb-8">
                Sponsor Dashboard
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} className="p-8 rounded-xl">
                        <Typography variant="h6" className="font-semibold mb-6">
                            Manage Your Sponsorship Profile
                        </Typography>

                        {message.text && (
                            <Alert severity={message.type} className="mb-6">
                                {message.text}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <TextField
                                fullWidth
                                label="Business / Sponsor Name"
                                {...register('name', { required: 'Name is required' })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />

                            <TextField
                                fullWidth
                                label="Logo URL"
                                {...register('logoUrl')}
                                placeholder="https://example.com/logo.png"
                            />

                            <TextField
                                fullWidth
                                label="Website URL"
                                {...register('website')}
                                placeholder="https://example.com"
                            />

                            <FormControl fullWidth>
                                <InputLabel id="category-label">Sponsorship Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    label="Sponsorship Category"
                                    defaultValue="ASSOCIATE"
                                    {...register('category', { required: 'Category is required' })}
                                >
                                    <MenuItem value="TITLE">Title Sponsor</MenuItem>
                                    <MenuItem value="CO_SPONSOR">Co-Sponsor</MenuItem>
                                    <MenuItem value="ASSOCIATE">Associate Sponsor</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isLoading}
                                className="bg-primary-main hover:bg-primary-dark h-12 px-8"
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : (sponsorData ? 'Update Profile' : 'Create Profile')}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card elevation={2} className="rounded-xl h-full">
                        <CardContent className="p-6">
                            <Typography variant="h6" className="font-semibold mb-4 text-primary-main">
                                Welcome, {user?.name}!
                            </Typography>
                            <Typography variant="body2" className="text-gray-600 mb-6">
                                Provide your business details here to advertise your product on our platform. Your information will be visible in our Sponsors section.
                            </Typography>
                            
                            {sponsorData && (
                                <Box className="mt-8 pt-8 border-t border-gray-100">
                                    <Typography variant="subtitle2" className="font-bold text-gray-800 mb-4">
                                        Current Public Profile
                                    </Typography>
                                    <Box className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
                                        {sponsorData.logoUrl ? (
                                            <img src={sponsorData.logoUrl} alt={sponsorData.name} className="h-20 w-auto mb-4 object-contain" />
                                        ) : (
                                            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                                No Logo
                                            </div>
                                        )}
                                        <Typography variant="h6" className="font-bold text-center">{sponsorData.name}</Typography>
                                        <Typography variant="body2" className="text-primary-main mt-1 uppercase text-xs font-black tracking-widest">
                                            {sponsorData.category}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default SponsorDashboard;
