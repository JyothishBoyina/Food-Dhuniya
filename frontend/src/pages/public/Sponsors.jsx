import { useState, useEffect } from 'react';
import { Typography, Container, Grid, Paper, CircularProgress, Alert, Box } from '@mui/material';
import api from '../../lib/api';

const Sponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSponsors = async () => {
            try {
                const response = await api.get('/sponsors/');
                setSponsors(response.data || []);
            } catch (err) {
                setError('Failed to fetch sponsors. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchSponsors();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress className="text-secondary-main" />
            </div>
        );
    }

    return (
        <Container maxWidth="lg" className="py-16 min-h-[70vh]">
            <div className="text-center mb-16">
                <Typography variant="h3" component="h1" className="font-extrabold text-secondary-main mb-4">
                    Our Proud Sponsors
                </Typography>
                <Typography variant="h6" className="text-gray-500 max-w-2xl mx-auto font-normal">
                    Food Dhuniya is made possible through the generous support of our amazing partners.
                </Typography>
            </div>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            {sponsors.length === 0 && !error ? (
                <Alert severity="info" className="mb-6 text-center">
                    We are currently onboarding our amazing sponsors. Stay tuned!
                </Alert>
            ) : (
                <Grid container spacing={4} justifyContent="center">
                    {sponsors.map((sponsor) => (
                        <Grid item xs={12} sm={6} md={4} key={sponsor.id}>
                            <Paper
                                elevation={1}
                                className={`p-8 text-center h-full flex flex-col items-center justify-center rounded-xl border-t-4 ${sponsor.category === 'TITLE' ? 'border-primary-main' :
                                    sponsor.category === 'CO_SPONSOR' ? 'border-yellow-400' : 'border-gray-400'
                                    }`}
                            >
                                <div className="bg-slate-100 w-24 h-24 rounded-full flex items-center justify-center mb-6">
                                    <span className="text-2xl font-bold text-slate-400">{sponsor.name.charAt(0)}</span>
                                </div>
                                <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                                    {sponsor.name}
                                </Typography>
                                <Typography variant="subtitle2" className="text-gray-500 uppercase tracking-widest font-semibold">
                                    {sponsor.category?.replace('_', ' ')} Sponsor
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default Sponsors;
