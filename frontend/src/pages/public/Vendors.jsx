import { useState, useEffect } from 'react';
import { 
    Card, CardContent, Typography, Grid, CircularProgress, 
    Alert, Container, Chip, Button, Paper, Avatar, Box 
} from '@mui/material';
import { MapPin, ChefHat, Utensils, Search } from 'lucide-react';
import { TextField, InputAdornment } from '@mui/material';
import api from '../../lib/api';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await api.get('/vendors/');
                setVendors(response.data.content || []);
            } catch (err) {
                setError('Failed to fetch vendors. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    const filtered = vendors.filter(v =>
        v.businessName?.toLowerCase().includes(search.toLowerCase()) ||
        v.cuisineType?.toLowerCase().includes(search.toLowerCase())
    );

    const CUISINE_COLORS = {
        'North Indian': 'bg-orange-100 text-orange-700 border-orange-200',
        'South Indian': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Chinese': 'bg-red-100 text-red-700 border-red-200',
        'Italian': 'bg-green-100 text-green-700 border-green-200',
        'Fast Food': 'bg-blue-100 text-blue-700 border-blue-200',
        'Bakery & Desserts': 'bg-pink-100 text-pink-700 border-pink-200',
        'default': 'bg-purple-100 text-purple-700 border-purple-200',
    };

    const getCuisineColor = (cuisine) => CUISINE_COLORS[cuisine] || CUISINE_COLORS['default'];

    const getMenuHighlights = (menuItems) => {
        if (!menuItems) return [];
        return menuItems.split(/[\n,]+/).map(i => i.trim()).filter(Boolean).slice(0, 3);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress className="text-primary-main" />
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-br from-secondary-main via-slate-800 to-primary-dark py-24 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 25% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 75% 50%, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
                <Container maxWidth="lg" className="relative z-10 flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6 text-sm font-bold tracking-widest uppercase mx-auto">
                        <ChefHat className="w-4 h-4" />
                        Our Hand-Selected Vendors
                    </div>
                    <Typography variant="h2" align="center" className="font-black mb-4 tracking-tight text-5xl text-center">
                        World Class Cuisines
                    </Typography>
                    <Typography variant="h6" align="center" className="max-w-2xl mx-auto font-light opacity-90 leading-relaxed mb-10 text-center">
                        From spicy street food to fine dining appetizers — every vendor is hand-picked for their passion and quality.
                    </Typography>
                    <div className="max-w-md mx-auto">
                        <TextField
                            fullWidth variant="outlined" size="medium"
                            placeholder="Search by name or cuisine..."
                            value={search} onChange={e => setSearch(e.target.value)}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search className="w-5 h-5 text-gray-400" /></InputAdornment>,
                                className: 'bg-white rounded-2xl',
                            }}
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '1rem' } }}
                        />
                    </div>
                </Container>
            </div>

            <Container maxWidth="lg" className="py-20">
                {error && <Alert severity="error" className="mb-8 rounded-xl">{error}</Alert>}

                {/* Stats row */}
                <div className="flex gap-6 mb-12 justify-center flex-wrap">
                    {[
                        { label: 'Approved Vendors', value: vendors.length },
                        { label: 'Cuisine Types', value: [...new Set(vendors.map(v => v.cuisineType))].length },
                    ].map(stat => (
                        <Paper key={stat.label} elevation={0} className="px-8 py-4 rounded-2xl border border-gray-100 text-center">
                            <Typography variant="h4" className="font-black text-primary-main">{stat.value}</Typography>
                            <Typography variant="body2" className="text-gray-400 font-medium">{stat.label}</Typography>
                        </Paper>
                    ))}
                </div>

                {filtered.length === 0 && !error ? (
                    <Paper elevation={0} className="p-16 text-center rounded-3xl border border-dashed border-gray-200 bg-slate-50">
                        <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                        <Typography variant="h5" className="text-gray-400 font-black italic">
                            {search ? 'No vendors match your search.' : 'Vendor applications are still flowing in. Stay tuned!'}
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={5}>
                        {filtered.map((vendor) => {
                            const highlights = getMenuHighlights(vendor.menuItems);
                            return (
                                <Grid item xs={12} sm={6} md={4} key={vendor.id}>
                                    <VendorCard vendor={vendor} highlights={highlights} cuisineColor={getCuisineColor(vendor.cuisineType)} />
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Container>
        </div>
    );
};

const VendorCard = ({ vendor, highlights, cuisineColor }) => {
    const initials = vendor.businessName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'VD';

    return (
        <Card className="group h-full flex flex-col hover:shadow-2xl transition-all duration-500 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm bg-white hover:-translate-y-1">
            {/* Card Header with vendor logo */}
            <div className="relative bg-gradient-to-br from-secondary-main to-slate-700 p-8 pb-14 text-white text-center">
                {/* Logo */}
                {vendor.logoUrl ? (
                    <img 
                        src={vendor.logoUrl}
                        alt={vendor.businessName}
                        className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 border-4 border-white/20 shadow-lg"
                    />
                ) : (
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border-2 border-white/30">
                        <Typography variant="h5" className="font-black text-white">{initials}</Typography>
                    </div>
                )}
                <Typography variant="h6" className="font-black tracking-tight leading-tight">
                    {vendor.businessName}
                </Typography>
            </div>

            {/* Cuisine badge overlapping */}
            <div className="relative -mt-5 flex justify-center z-10 mb-2">
                <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border shadow-sm ${cuisineColor}`}>
                    {vendor.cuisineType}
                </span>
            </div>

            <CardContent className="p-6 flex-grow flex flex-col">
                {/* Stall Location */}
                {vendor.stallNumber && (
                    <div className="flex items-center gap-2 text-primary-main font-bold text-sm mb-4 bg-primary-main/5 px-3 py-2 rounded-xl">
                        <MapPin className="w-4 h-4 shrink-0" />
                        Stall {vendor.stallNumber}
                    </div>
                )}

                {/* Menu Highlights */}
                {highlights.length > 0 && (
                    <div className="mb-4">
                        <Typography variant="caption" className="uppercase font-black tracking-widest text-gray-400 block mb-2">
                            Menu Highlights
                        </Typography>
                        <div className="flex flex-wrap gap-1.5">
                            {highlights.map((item, i) => (
                                <span key={i} className="text-xs bg-slate-100 text-gray-600 font-semibold px-2.5 py-1 rounded-lg border border-slate-200">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact */}
                <div className="mt-auto pt-4 border-t border-gray-100">
                    <Typography variant="caption" className="text-gray-400 font-medium block">
                        Contact: {vendor.contactPerson}
                    </Typography>
                    <Typography variant="caption" className="text-gray-400 font-medium block">
                        {vendor.phone}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};

export default Vendors;
