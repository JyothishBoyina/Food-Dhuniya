import { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, CircularProgress, Chip, alpha } from '@mui/material';
import { Building2, Layers, ShieldCheck, Star } from 'lucide-react';
import api from '../../lib/api';

const CATEGORY_CONFIG = {
    TITLE_SPONSOR: {
        label: 'Title Sponsor',
        color: 'from-amber-400 to-yellow-600',
        bg: 'bg-amber-50',
        icon: <Star className="w-8 h-8 text-amber-500" />,
        span: 12,
        height: 'h-64'
    },
    POWERED_BY: {
        label: 'Powered By',
        color: 'from-blue-500 to-indigo-600',
        bg: 'bg-blue-50',
        icon: <Layers className="w-6 h-6 text-blue-500" />,
        span: 6,
        height: 'h-48'
    },
    CO_SPONSOR: {
        label: 'Co-Sponsors',
        color: 'from-emerald-400 to-teal-600',
        bg: 'bg-emerald-50',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        span: 4,
        height: 'h-40'
    },
    ASSOCIATE_SPONSOR: {
        label: 'Associate Sponsors',
        color: 'from-slate-400 to-slate-600',
        bg: 'bg-slate-50',
        icon: <Building2 className="w-4 h-4 text-slate-500" />,
        span: 3,
        height: 'h-32'
    }
};

const CATEGORY_ORDER = ['TITLE_SPONSOR', 'POWERED_BY', 'CO_SPONSOR', 'ASSOCIATE_SPONSOR'];

const PublicSponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await api.get('/sponsors/');
                setSponsors(response.data);
            } catch (err) {
                console.error("Failed to fetch sponsors");
            } finally {
                setLoading(false);
            }
        };
        fetchSponsors();
    }, []);

    // Group sponsors by category
    const groupedSponsors = CATEGORY_ORDER.reduce((acc, category) => {
        acc[category] = sponsors.filter(s => s.category === category);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress size={48} sx={{ color: 'primary.main' }} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <Box className="bg-slate-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-main via-slate-900 to-slate-900"></div>
                <Container maxWidth="lg" className="relative z-10 flex flex-col items-center text-center">
                    <Typography variant="h2" align="center" className="font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 text-center">
                        Our Sponsors
                    </Typography>
                    <Typography variant="h6" align="center" className="text-slate-400 font-medium max-w-2xl mx-auto text-center">
                        Proudly supported by industry leaders who make Food Dhuniya the ultimate culinary experience.
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" className="py-16">
                {sponsors.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <Typography variant="h5" className="font-bold text-slate-400">Partnerships Coming Soon</Typography>
                        <Typography className="text-slate-500 mt-2">We'll be announcing our incredible sponsors shortly.</Typography>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {CATEGORY_ORDER.map(categoryKey => {
                            const categorySponsors = groupedSponsors[categoryKey];
                            if (!categorySponsors || categorySponsors.length === 0) return null;

                            const config = CATEGORY_CONFIG[categoryKey];

                            return (
                                <section key={categoryKey} className="relative">
                                    <div className="flex flex-col items-center mb-10 text-center">
                                        <div className="flex items-center justify-center gap-3 mb-2">
                                            {config.icon}
                                            <Typography variant="h4" className="font-black text-slate-800 tracking-tight text-center">
                                                {config.label}
                                            </Typography>
                                            {config.icon}
                                        </div>
                                        <div className={`h-1 w-24 bg-gradient-to-r ${config.color} rounded-full mx-auto`}></div>
                                    </div>

                                    <Grid container spacing={4} justifyContent="center">
                                        {categorySponsors.map(sponsor => (
                                            <Grid item xs={12} sm={config.span >= 6 ? 12 : 6} md={config.span} key={sponsor.id}>
                                                <SponsorCard sponsor={sponsor} config={config} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </section>
                            );
                        })}
                    </div>
                )}
            </Container>
        </div>
    );
};

const SponsorCard = ({ sponsor, config }) => {
    return (
        <Paper 
            elevation={0}
            className={`group rounded-3xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 flex flex-col items-center ${config.bg} relative`}
        >
            {/* Banner Section (if they have one) */}
            {sponsor.bannerUrl && (
                <div className="w-full h-32 relative overflow-hidden">
                    <img src={sponsor.bannerUrl} alt={`${sponsor.businessName} Banner`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
            )}

            {/* Content Section */}
            <div className={`p-8 w-full flex flex-col items-center justify-center text-center ${sponsor.bannerUrl ? '-mt-12 relative z-10' : config.height}`}>
                {sponsor.logoUrl ? (
                    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center p-4 overflow-hidden
                        ${config.span === 12 ? 'w-48 h-48 mb-6' : config.span >= 6 ? 'w-32 h-32 mb-4' : 'w-24 h-24 mb-3'}
                    `}>
                        <img 
                            src={sponsor.logoUrl} 
                            alt={sponsor.businessName} 
                            className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all"
                        />
                    </div>
                ) : (
                    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-300
                        ${config.span === 12 ? 'w-48 h-48 mb-6' : config.span >= 6 ? 'w-32 h-32 mb-4' : 'w-24 h-24 mb-3'}
                    `}>
                        <Building2 className="w-1/2 h-1/2" />
                    </div>
                )}

                <Typography 
                    variant={config.span === 12 ? 'h4' : config.span >= 6 ? 'h5' : 'h6'} 
                    className={`font-black tracking-tight text-slate-800 ${sponsor.bannerUrl ? 'text-white drop-shadow-md' : ''}`}
                >
                    {sponsor.businessName}
                </Typography>
                
                {sponsor.description && config.span >= 6 && (
                    <Typography className={`mt-4 text-sm max-w-lg ${sponsor.bannerUrl ? 'text-white/80' : 'text-slate-500'}`}>
                        {sponsor.description}
                    </Typography>
                )}
            </div>
            
            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        </Paper>
    );
};

export default PublicSponsors;
