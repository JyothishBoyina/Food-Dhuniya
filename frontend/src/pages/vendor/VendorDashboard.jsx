import { useState, useEffect } from 'react';
import { 
    Container, Typography, Grid, Chip, CircularProgress, Alert,
    Card, CardContent, Button, Box, Divider, Paper, Step, StepLabel, Stepper
} from '@mui/material';
import { Store, MapPin, CreditCard, Utensils, Info, Award, ClipboardList, PlusCircle, CheckCircle, Clock, XCircle, User, Phone, Mail, AlertTriangle } from 'lucide-react';
import api from '../../lib/api';
import VendorRegistration from './VendorRegistration';

const STATUS_CONFIG = {
    PENDING: {
        label: 'Under Review', color: 'warning',
        icon: <Clock className="w-4 h-4" />,
        classes: 'bg-amber-50 border-amber-200 text-amber-700'
    },
    APPROVED: {
        label: 'Approved', color: 'success',
        icon: <CheckCircle className="w-4 h-4" />,
        classes: 'bg-emerald-50 border-emerald-200 text-emerald-700'
    },
    REJECTED: {
        label: 'Rejected', color: 'error',
        icon: <XCircle className="w-4 h-4" />,
        classes: 'bg-red-50 border-red-200 text-red-700'
    }
};

const VendorDashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [applyingNew, setApplyingNew] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/vendors/me');
            // API now returns List<Vendor>
            setApplications(Array.isArray(response.data) ? response.data : [response.data].filter(Boolean));
        } catch (err) {
            if (err.response?.status !== 404) {
                setError('Failed to load your applications.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    const handleNewApplicationComplete = () => {
        setApplyingNew(false);
        fetchApplications();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress />
            </div>
        );
    }

    // No applications yet — show the registration form directly
    if (applications.length === 0 && !applyingNew) {
        return <VendorRegistration onComplete={handleNewApplicationComplete} />;
    }

    // Showing new application form
    if (applyingNew) {
        return (
            <div>
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <Typography variant="h6" className="font-black text-secondary-main">New Vendor Application</Typography>
                        <Typography variant="caption" className="text-gray-400">Your existing {applications.length} application(s) will remain unchanged.</Typography>
                    </div>
                    <Button variant="outlined" size="small" onClick={() => setApplyingNew(false)} className="rounded-xl">
                        ← Back to Dashboard
                    </Button>
                </div>
                <VendorRegistration onComplete={handleNewApplicationComplete} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10">
            <Container maxWidth="lg">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                        <Typography variant="h4" className="font-black text-secondary-main tracking-tight">
                            Vendor Dashboard
                        </Typography>
                        <Typography className="text-gray-400 font-medium">
                            {applications.length} application{applications.length !== 1 ? 's' : ''} submitted
                        </Typography>
                    </div>
                    <Button
                        variant="contained" size="large"
                        startIcon={<PlusCircle className="w-5 h-5" />}
                        onClick={() => setApplyingNew(true)}
                        className="bg-secondary-main hover:bg-slate-800 rounded-2xl font-bold px-6"
                    >
                        Apply Again
                    </Button>
                </div>

                {error && <Alert severity="error" className="mb-6 rounded-xl">{error}</Alert>}

                {/* Application Cards — one per application */}
                <div className="space-y-6">
                    {applications.map((vendor, index) => (
                        <ApplicationCard key={vendor.id} vendor={vendor} index={index} total={applications.length} />
                    ))}
                </div>
            </Container>
        </div>
    );
};

const ApplicationCard = ({ vendor, index, total }) => {
    const statusCfg = STATUS_CONFIG[vendor.status] || STATUS_CONFIG.PENDING;

    const steps = ['Submitted', 'Under Review', 'Stall Assigned', 'Ready'];
    const activeStep = vendor.status === 'REJECTED' ? 1
        : vendor.status === 'APPROVED' ? (vendor.paymentStatus === 'PAID' ? 4 : 2)
        : 1;

    return (
        <Paper elevation={0} className="rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-8 py-5 bg-slate-50 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary-main rounded-xl flex items-center justify-center text-white font-black text-lg shrink-0">
                        {vendor.logoUrl
                            ? <img src={vendor.logoUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                            : vendor.businessName?.slice(0, 2).toUpperCase()
                        }
                    </div>
                    <div>
                        <Typography variant="h6" className="font-black text-secondary-main leading-tight">{vendor.businessName}</Typography>
                        <Typography variant="caption" className="text-gray-400 font-medium">Application #{total - index} • {new Date(vendor.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Typography>
                    </div>
                </div>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${statusCfg.classes}`}>
                    {statusCfg.icon}
                    {statusCfg.label}
                </div>
            </div>

            <div className="p-8">
                {/* Progress Stepper */}
                <Box className="mb-8">
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label, i) => (
                            <Step key={label} completed={i < activeStep && !(vendor.status === 'REJECTED' && i === 1)}>
                                <StepLabel error={vendor.status === 'REJECTED' && i === 1}>
                                    <span className="text-xs font-bold">{vendor.status === 'REJECTED' && i === 1 ? 'Rejected' : label}</span>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Status message */}
                    {vendor.status === 'PENDING' && (
                        <div className="mt-4 text-center text-sm text-amber-700 bg-amber-50 rounded-xl py-2 px-4 border border-amber-100">
                            ⏳ Under review — we'll notify you once approved.
                        </div>
                    )}
                    {vendor.status === 'REJECTED' && (
                        <div className="mt-4 flex items-start gap-2 text-sm text-red-700 bg-red-50 rounded-xl py-3 px-4 border border-red-200">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            Application not approved. Use the <strong>"Apply Again"</strong> button above to submit a new application.
                        </div>
                    )}
                </Box>

                {/* Approved Stall Banner */}
                {vendor.status === 'APPROVED' && (
                    <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 text-white p-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <div>
                                <Typography variant="caption" className="opacity-60 uppercase tracking-widest font-bold text-xs block">Stall Number</Typography>
                                <Typography variant="h4" className="font-black tracking-tighter leading-none">
                                    {vendor.stallNumber || 'Pending Assignment'}
                                </Typography>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm border ${
                            vendor.paymentStatus === 'PAID' ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                            : 'bg-orange-500/20 border-orange-400/40 text-orange-300'
                        }`}>
                            <CreditCard className="w-4 h-4" />
                            {vendor.paymentStatus}
                        </div>
                    </div>
                )}

                {/* Stall Details Grid */}
                <Grid container spacing={3}>
                    <Grid item xs={6} sm={3}>
                        <InfoField icon={<Utensils className="w-4 h-4" />} label="Cuisine" value={vendor.cuisineType} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <InfoField icon={<Info className="w-4 h-4" />} label="Stall Type" value={vendor.stallType} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <InfoField icon={<User className="w-4 h-4" />} label="Contact" value={vendor.contactPerson} />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <InfoField icon={<Phone className="w-4 h-4" />} label="Phone" value={vendor.phone} />
                    </Grid>
                    {vendor.menuItems && (
                        <Grid item xs={12}>
                            <Divider className="my-1" />
                            <Typography variant="caption" className="text-gray-400 uppercase font-black tracking-widest block mb-2 mt-2">Menu Items</Typography>
                            <Typography className="text-gray-700 bg-slate-50 p-3 rounded-xl text-sm border border-slate-100 whitespace-pre-wrap">
                                {vendor.menuItems}
                            </Typography>
                        </Grid>
                    )}
                    {vendor.fssaiLicense && (
                        <Grid item xs={12} sm={6}>
                            <InfoField icon={<Award className="w-4 h-4" />} label="FSSAI License" value={vendor.fssaiLicense} mono />
                        </Grid>
                    )}
                </Grid>
            </div>
        </Paper>
    );
};

const InfoField = ({ icon, label, value, mono = false }) => (
    <div>
        <div className="flex items-center gap-1.5 text-gray-400 mb-1">
            {icon}
            <Typography variant="caption" className="uppercase font-black tracking-widest leading-none">{label}</Typography>
        </div>
        <Typography className={`font-bold text-gray-800 truncate ${mono ? 'font-mono text-sm' : ''}`}>
            {value || '—'}
        </Typography>
    </div>
);

export default VendorDashboard;
