import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    TextField, Button, Alert, CircularProgress, Paper, Typography,
    Grid, MenuItem, Select, FormControl, InputLabel, FormHelperText, Box, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Upload, Store, ChefHat, FileText, Phone, Mail, User, Image } from 'lucide-react';
import api from '../../lib/api';

const STALL_TYPES = ['Food Cart', 'Small Stall', 'Medium Stall', 'Large Stall', 'Premium Booth'];
const CUISINE_TYPES = [
    'North Indian', 'South Indian', 'Chinese', 'Italian', 'Mexican', 'Thai',
    'Fast Food', 'Bakery & Desserts', 'Beverages', 'Street Food', 'Continental', 'Other'
];

const VendorRegistration = ({ onComplete }) => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [fssaiFile, setFssaiFile] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const stallType = watch('stallType');

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFssaiChange = (e) => {
        const file = e.target.files[0];
        if (file) setFssaiFile(file);
    };

    const onSubmit = async (data) => {
        try {
            setIsLoading(true);
            setServerError('');

            const requestData = {
                userId: user.id,
                businessName: data.businessName,
                contactPerson: data.contactPerson,
                phone: data.phone,
                email: data.email,
                cuisineType: data.cuisineType,
                menuItems: data.menuItems,
                stallType: data.stallType,
                fssaiLicense: fssaiFile ? fssaiFile.name : data.fssaiLicenseNumber,
                // logoUrl could be handled with file upload in a real scenario
                logoUrl: logoFile ? `logo_${user.id}_${logoFile.name}` : null,
            };

            await api.post('/vendors/register', requestData);

            setSuccessMessage('Application submitted! Our team will review your registration shortly.');
            if (onComplete) {
                setTimeout(onComplete, 1500);
            } else {
                setTimeout(() => navigate('/vendor/dashboard'), 2000);
            }
        } catch (error) {
            setServerError(error.response?.data?.message || 'Failed to submit application. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (successMessage) {
        return (
            <div className="flex flex-col justify-center items-center py-12 bg-slate-50 px-4 min-h-[80vh]">
                <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <Typography variant="h5" className="font-black text-secondary-main mb-3">Application Submitted!</Typography>
                    <Typography className="text-gray-500">{successMessage}</Typography>
                </div>
            </div>
        );
    }

    return (
        <div className="py-12 bg-gradient-to-b from-slate-50 to-white px-4 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-main/10 rounded-2xl mb-4">
                        <Store className="w-8 h-8 text-primary-main" />
                    </div>
                    <Typography variant="h3" className="font-black text-secondary-main mb-2 tracking-tight">
                        Register Your Stall
                    </Typography>
                    <Typography className="text-gray-500 text-lg max-w-xl mx-auto">
                        Fill out the form below to apply for a vendor stall at the Food Dhuniya festival.
                    </Typography>
                </div>

                {serverError && <Alert severity="error" className="mb-6 rounded-xl">{serverError}</Alert>}

                <Paper elevation={0} className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Business Info */}
                        <div className="p-8 border-b border-gray-50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-secondary-main rounded-lg flex items-center justify-center text-white text-sm font-black">1</div>
                                <Typography variant="h6" className="font-black text-secondary-main">Business Information</Typography>
                            </div>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Business Name *" variant="outlined"
                                        {...register('businessName', { required: 'Business name is required' })}
                                        error={!!errors.businessName} helperText={errors.businessName?.message}
                                        InputProps={{ startAdornment: <Store className="w-4 h-4 text-gray-400 mr-2" /> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Contact Person *" variant="outlined"
                                        {...register('contactPerson', { required: 'Contact person is required' })}
                                        error={!!errors.contactPerson} helperText={errors.contactPerson?.message}
                                        InputProps={{ startAdornment: <User className="w-4 h-4 text-gray-400 mr-2" /> }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth label="Phone Number *" variant="outlined"
                                        {...register('phone', { required: 'Phone number is required', pattern: { value: /^[0-9]{10}$/, message: 'Enter valid 10-digit phone' } })}
                                        error={!!errors.phone} helperText={errors.phone?.message}
                                        InputProps={{ startAdornment: <Phone className="w-4 h-4 text-gray-400 mr-2" /> }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth label="Email Address *" variant="outlined" type="email"
                                        {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } })}
                                        error={!!errors.email} helperText={errors.email?.message}
                                        InputProps={{ startAdornment: <Mail className="w-4 h-4 text-gray-400 mr-2" /> }}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        {/* Stall Info */}
                        <div className="p-8 border-b border-gray-50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-secondary-main rounded-lg flex items-center justify-center text-white text-sm font-black">2</div>
                                <Typography variant="h6" className="font-black text-secondary-main">Stall & Cuisine Details</Typography>
                            </div>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.cuisineType}>
                                        <InputLabel>Cuisine Type *</InputLabel>
                                        <Select label="Cuisine Type *" defaultValue=""
                                            {...register('cuisineType', { required: 'Cuisine type is required' })}>
                                            {CUISINE_TYPES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                        </Select>
                                        {errors.cuisineType && <FormHelperText>{errors.cuisineType.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={!!errors.stallType}>
                                        <InputLabel>Stall Type *</InputLabel>
                                        <Select label="Stall Type *" defaultValue=""
                                            {...register('stallType', { required: 'Stall type is required' })}>
                                            {STALL_TYPES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                        </Select>
                                        {errors.stallType && <FormHelperText>{errors.stallType.message}</FormHelperText>}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth multiline rows={4}
                                        label="Menu Items & Specialties *"
                                        placeholder="List your signature dishes, specialties, and price range..."
                                        variant="outlined"
                                        {...register('menuItems', { required: 'Please list your menu items' })}
                                        error={!!errors.menuItems} helperText={errors.menuItems?.message}
                                    />
                                </Grid>
                            </Grid>
                        </div>

                        {/* Documents */}
                        <div className="p-8 border-b border-gray-50">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 bg-secondary-main rounded-lg flex items-center justify-center text-white text-sm font-black">3</div>
                                <Typography variant="h6" className="font-black text-secondary-main">Documents & Branding</Typography>
                            </div>
                            <Grid container spacing={3}>
                                {/* Logo Upload */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" className="text-gray-600 font-bold mb-2">Vendor Logo</Typography>
                                    <label htmlFor="logo-upload" className="cursor-pointer">
                                        <Box className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all hover:border-primary-main hover:bg-primary-main/5 ${logoPreview ? 'border-primary-main bg-primary-main/5' : 'border-gray-200'}`}>
                                            {logoPreview ? (
                                                <div>
                                                    <img src={logoPreview} alt="Logo preview" className="h-20 object-contain mx-auto mb-2 rounded-xl" />
                                                    <Typography variant="caption" className="text-primary-main font-bold">Logo selected ✓</Typography>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                                    <Typography variant="body2" className="text-gray-400">Click to upload logo</Typography>
                                                    <Typography variant="caption" className="text-gray-300">PNG, JPG (max 2MB)</Typography>
                                                </div>
                                            )}
                                        </Box>
                                        <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                                    </label>
                                </Grid>

                                {/* FSSAI Upload */}
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="body2" className="text-gray-600 font-bold mb-2">FSSAI License *</Typography>
                                    <label htmlFor="fssai-upload" className="cursor-pointer">
                                        <Box className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all hover:border-secondary-main hover:bg-slate-50 ${fssaiFile ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}>
                                            {fssaiFile ? (
                                                <div>
                                                    <FileText className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                                    <Typography variant="caption" className="text-green-600 font-bold">{fssaiFile.name}</Typography>
                                                </div>
                                            ) : (
                                                <div>
                                                    <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                                    <Typography variant="body2" className="text-gray-400">Upload FSSAI License</Typography>
                                                    <Typography variant="caption" className="text-gray-300">PDF, JPG (max 5MB)</Typography>
                                                </div>
                                            )}
                                        </Box>
                                        <input id="fssai-upload" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleFssaiChange} />
                                    </label>
                                    {!fssaiFile && (
                                        <TextField
                                            fullWidth className="mt-3" label="Or enter FSSAI License Number"
                                            variant="outlined" size="small"
                                            {...register('fssaiLicenseNumber')}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                        </div>

                        {/* Submit */}
                        <div className="p-8 bg-gray-50">
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6 flex gap-3">
                                <span className="text-amber-400 text-xl">ℹ️</span>
                                <Typography variant="body2" className="text-amber-800 font-medium">
                                    Your application will be reviewed by our admin team. Once approved, you'll receive your stall number and payment details through your Vendor Dashboard.
                                </Typography>
                            </div>
                            <Button
                                type="submit" fullWidth variant="contained" size="large"
                                disabled={isLoading}
                                className="h-14 font-black text-base rounded-2xl bg-secondary-main hover:bg-slate-800"
                                sx={{ mt: 0 }}
                            >
                                {isLoading ? <CircularProgress size={24} color="inherit" /> : '🚀 Submit Application'}
                            </Button>
                        </div>
                    </form>
                </Paper>
            </div>
        </div>
    );
};

export default VendorRegistration;
