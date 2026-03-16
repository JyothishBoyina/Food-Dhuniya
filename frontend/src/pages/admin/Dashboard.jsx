import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, CircularProgress, Alert } from '@mui/material';
import { Ticket, Users, CheckCircle, DollarSign, Calendar, Award, Eye } from 'lucide-react';
import api from '../../lib/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard/stats');
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard statistics. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress className="text-primary-main" />
            </div>
        );
    }

    const statCards = [
        { title: 'Tickets Sold', value: stats?.totalTicketsSold || 0, icon: <Ticket className="text-blue-500 w-8 h-8" />, bgColor: 'bg-blue-50' },
        { title: 'Registered Vendors', value: stats?.totalVendorsRegistered || 0, icon: <Users className="text-purple-500 w-8 h-8" />, bgColor: 'bg-purple-50' },
        { title: 'Total Revenue', value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, icon: <DollarSign className="text-emerald-500 w-8 h-8" />, bgColor: 'bg-emerald-50' },
        { title: 'Scheduled Events', value: stats?.totalScheduledEvents || 0, icon: <Calendar className="text-orange-500 w-8 h-8" />, bgColor: 'bg-orange-50' },
        { title: 'Total Sponsors', value: stats?.totalSponsors || 0, icon: <Award className="text-pink-500 w-8 h-8" />, bgColor: 'bg-pink-50' },
        { title: 'Site Visitors', value: stats?.totalVisitors?.toLocaleString() || 0, icon: <Eye className="text-indigo-500 w-8 h-8" />, bgColor: 'bg-indigo-50' },
    ];

    return (
        <Container maxWidth="lg" className="py-12">
            <Typography variant="h3" className="font-extrabold text-secondary-main mb-8">
                Admin Dashboard
            </Typography>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            <Grid container spacing={4}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper elevation={1} className={`p-6 rounded-xl flex items-center space-x-4 ${stat.bgColor}`}>
                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                {stat.icon}
                            </div>
                            <div>
                                <Typography variant="body2" className="text-gray-500 font-medium whitespace-nowrap">
                                    {stat.title}
                                </Typography>
                                <Typography variant="h4" className="font-bold text-gray-800">
                                    {stat.value}
                                </Typography>
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Placeholder for charts or recent activity */}
            <Grid container spacing={4} className="mt-8">
                <Grid item xs={12} md={8}>
                    <Paper className="p-6 rounded-xl min-h-[300px] flex items-center justify-center border border-dashed border-gray-300">
                        <Typography className="text-gray-400">Revenue Analytics Coming Soon</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="p-6 rounded-xl min-h-[300px] flex items-center justify-center border border-dashed border-gray-300">
                        <Typography className="text-gray-400">Recent Notifications</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminDashboard;
