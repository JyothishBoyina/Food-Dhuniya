import { useState } from 'react';
import { Container, Typography, Paper, Grid, TextField, Button, Box, Alert, MenuItem, alpha } from '@mui/material';
import { Upload, Building2, User, Mail, FileText, CheckCircle } from 'lucide-react';
import api from '../../lib/api';

const CATEGORIES = [
    { value: 'TITLE_SPONSOR', label: 'Title Sponsor' },
    { value: 'POWERED_BY', label: 'Powered By' },
    { value: 'CO_SPONSOR', label: 'Co-Sponsor' },
    { value: 'ASSOCIATE_SPONSOR', label: 'Associate Sponsor' }
];

const SponsorRegistration = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        contactPerson: '',
        email: '',
        category: '',
        logoUrl: '',
        bannerUrl: '',
        description: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;

        // In a real app, upload to Cloudinary/S3 here
        // For now, create a fake URL or use a local object URL
        const fakeUrl = URL.createObjectURL(file);
        setFormData(prev => ({ ...prev, [field]: fakeUrl }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            await api.post('/sponsors/register', { ...formData, userId: user.id });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit registration. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
                <Paper elevation={0} className="max-w-md w-full p-8 text-center rounded-3xl border border-slate-200">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <Typography variant="h5" className="font-black text-secondary-main mb-3">Application Submitted!</Typography>
                    <Typography className="text-slate-500 mb-8">
                        Thank you for applying to be a {CATEGORIES.find(c => c.value === formData.category)?.label || 'Sponsor'}. 
                        Our team will review your application and contact you shortly.
                    </Typography>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={() => setSuccess(false)}
                        className="bg-secondary-main hover:bg-slate-800 rounded-xl py-3 font-bold shadow-none"
                    >
                        Submit Another Application
                    </Button>
                </Paper>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <Container maxWidth="md">
                <div className="text-center mb-10">
                    <Typography variant="h3" className="font-black text-secondary-main tracking-tight mb-4">
                        Become a Sponsor
                    </Typography>
                    <Typography variant="h6" className="text-slate-500 font-medium max-w-2xl mx-auto">
                        Showcase your brand at Food Dhuniya. Fill out the application below to get started. 
                    </Typography>
                </div>

                <Paper elevation={0} className="p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm bg-white">
                    {error && (
                        <Alert severity="error" className="mb-8 rounded-xl">{error}</Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Business/Brand Name"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    required
                                    InputProps={{ startAdornment: <Building2 className="w-5 h-5 text-slate-400 mr-2" /> }}
                                    className="bg-slate-50/50"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Contact Person"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                    InputProps={{ startAdornment: <User className="w-5 h-5 text-slate-400 mr-2" /> }}
                                    className="bg-slate-50/50"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    InputProps={{ startAdornment: <Mail className="w-5 h-5 text-slate-400 mr-2" /> }}
                                    className="bg-slate-50/50"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Sponsorship Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="bg-slate-50/50"
                                >
                                    {CATEGORIES.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Brand Description (Optional)"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    InputProps={{ startAdornment: <Box className="mt-1"><FileText className="w-5 h-5 text-slate-400 mr-2" /></Box> }}
                                    className="bg-slate-50/50"
                                    helperText="Tell us briefly about your brand or products."
                                />
                            </Grid>

                            {/* File Uploads */}
                            <Grid item xs={12} md={6}>
                                <Box className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors bg-white relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required
                                    />
                                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <Typography variant="subtitle2" className="font-bold text-slate-700">Upload Brand Logo *</Typography>
                                    <Typography variant="caption" className="text-slate-400">PNG or JPG (Max 2MB)</Typography>
                                    
                                    {formData.logoUrl && (
                                        <div className="mt-4 p-2 bg-slate-100 rounded-xl relative h-20 flex items-center justify-center overflow-hidden">
                                            <img src={formData.logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                                        </div>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors bg-white relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileUpload(e, 'bannerUrl')}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <Typography variant="subtitle2" className="font-bold text-slate-700">Upload Banner Image</Typography>
                                    <Typography variant="caption" className="text-slate-400">Optional • 1200x400px recommended</Typography>
                                    
                                    {formData.bannerUrl && (
                                        <div className="mt-4 p-2 bg-slate-100 rounded-xl relative h-20 flex items-center justify-center overflow-hidden">
                                            <img src={formData.bannerUrl} alt="Banner Preview" className="max-h-full max-w-full object-cover" />
                                        </div>
                                    )}
                                </Box>
                            </Grid>

                            <Grid item xs={12} className="mt-4">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    fullWidth
                                    disabled={loading}
                                    className="py-4 shadow-none hover:shadow-md rounded-xl font-bold text-lg"
                                    sx={{ 
                                        bgcolor: 'primary.main', 
                                        '&:hover': { bgcolor: alpha('#ff4757', 0.9) }
                                    }}
                                >
                                    {loading ? 'Submitting Application...' : 'Submit Sponsorship Application'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </div>
    );
};

export default SponsorRegistration;
