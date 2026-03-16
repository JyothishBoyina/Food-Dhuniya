import { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Grid, Card, CardContent, 
    CircularProgress, Alert, Box, LinearProgress, Tooltip
} from '@mui/material';
import { Ticket, DollarSign, Users, AlertCircle, TrendingUp } from 'lucide-react';
import api from '../../lib/api';

const TicketManagement = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/dashboard/tickets/stats');
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch ticket statistics. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress />
            </div>
        );
    }

    const cards = [
        { 
            title: 'Total Tickets Sold', 
            value: stats?.totalTicketsSold || 0, 
            icon: <Ticket className="text-blue-500 w-8 h-8" />, 
            color: 'text-blue-600',
            bg: 'bg-blue-50'
        },
        { 
            title: 'Refund Requests', 
            value: stats?.refundRequests || 0, 
            icon: <AlertCircle className="text-red-500 w-8 h-8" />, 
            color: 'text-red-600',
            bg: 'bg-red-50'
        },
        { 
            title: 'General Tickets', 
            value: stats?.ticketsByType?.GENERAL || 0, 
            icon: <Users className="text-purple-500 w-8 h-8" />, 
            color: 'text-purple-600',
            bg: 'bg-purple-50'
        },
        { 
            title: 'VIP Tickets', 
            value: stats?.ticketsByType?.VIP || 0, 
            icon: <TrendingUp className="text-indigo-500 w-8 h-8" />, 
            color: 'text-indigo-600',
            bg: 'bg-indigo-50'
        },
    ];

    return (
        <Container maxWidth="lg" className="py-12">
            <Typography variant="h4" className="font-bold text-secondary-main mb-8">
                Ticket Management
            </Typography>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            <Grid container spacing={4} className="mb-8">
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper elevation={0} className={`${card.bg} p-6 rounded-2xl flex items-center space-x-4 border border-opacity-50`}>
                            <div className="bg-white p-3 rounded-xl shadow-sm">
                                {card.icon}
                            </div>
                            <div>
                                <Typography variant="body2" className="text-gray-500 font-medium">
                                    {card.title}
                                </Typography>
                                <Typography variant="h5" className={`font-bold ${card.color}`}>
                                    {card.value}
                                </Typography>
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    <Paper className="p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
                        <Typography variant="h6" className="font-bold mb-6">Sales History (Last 7 Days)</Typography>
                        <div className="flex items-end justify-between h-[250px] mt-12 px-4 border-b border-gray-100">
                            {stats?.salesHistory?.map((day, index) => {
                                const maxCount = Math.max(...stats.salesHistory.map(d => d.count), 1);
                                const height = (day.count / maxCount) * 100;
                                return (
                                    <Box key={index} className="flex flex-col items-center w-full" sx={{ height: '100%', justifyContent: 'flex-end' }}>
                                        <Tooltip title={`${day.date}: ${day.count} tickets`}>
                                            <Box 
                                                className="bg-primary-main rounded-t-lg transition-all duration-500 hover:bg-primary-dark"
                                                sx={{ 
                                                    height: `${height}%`, 
                                                    width: '40px',
                                                    minHeight: day.count > 0 ? '4px' : '0'
                                                }}
                                            />
                                        </Tooltip>
                                        <Typography variant="caption" className="mt-4 text-gray-400 rotate-45 origin-left">
                                            {day.date.split('-').slice(1).join('/')}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </div>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className="p-8 rounded-2xl shadow-sm border border-gray-100">
                        <Typography variant="h6" className="font-bold mb-6">Ticket Distribution</Typography>
                        <Box className="space-y-6">
                            {['GENERAL', 'VIP'].map((type) => {
                                const count = stats?.ticketsByType?.[type] || 0;
                                const total = stats?.totalTicketsSold || 1;
                                const percentage = (count / total) * 100;
                                return (
                                    <div key={type}>
                                        <div className="flex justify-between mb-2">
                                            <Typography variant="body2" className="font-medium text-gray-700">{type}</Typography>
                                            <Typography variant="body2" className="text-gray-500">{count} ({percentage.toFixed(1)}%)</Typography>
                                        </div>
                                        <LinearProgress 
                                            variant="determinate" 
                                            value={percentage} 
                                            className="h-2 rounded-full bg-gray-100"
                                            sx={{
                                                '& .MuiLinearProgress-bar': {
                                                    backgroundColor: type === 'VIP' ? '#6366f1' : '#10b981'
                                                }
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TicketManagement;
