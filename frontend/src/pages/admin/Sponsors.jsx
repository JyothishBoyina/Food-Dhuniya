import { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, Chip, 
    CircularProgress, Alert, IconButton, Tooltip, Avatar
} from '@mui/material';
import { Check, X, Trash2, ExternalLink, ShieldCheck, ShieldAlert } from 'lucide-react';
import api from '../../lib/api';

const SponsorManagement = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);

    const fetchSponsors = async () => {
        try {
            setLoading(true);
            const response = await api.get('/sponsors/');
            setSponsors(response.data);
        } catch (err) {
            setError('Failed to fetch sponsors. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            setActionLoading(id);
            await api.put(`/sponsors/admin/${id}/status`, null, {
                params: { status }
            });
            fetchSponsors(); 
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sponsor?')) return;
        try {
            setActionLoading(id);
            await api.delete(`/sponsors/${id}`);
            fetchSponsors();
        } catch (err) {
            alert('Delete failed');
        } finally {
            setActionLoading(null);
        }
    };

    if (loading && sponsors.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container maxWidth="lg" className="py-12">
            <Typography variant="h4" className="font-bold text-secondary-main mb-8">
                Sponsor Management
            </Typography>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            <TableContainer component={Paper} className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <Table sx={{ minWidth: 650 }}>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-bold">Logo</TableCell>
                            <TableCell className="font-bold">Sponsor Name</TableCell>
                            <TableCell className="font-bold">Category / Tier</TableCell>
                            <TableCell className="font-bold">Zone / Event</TableCell>
                            <TableCell className="font-bold">Status</TableCell>
                            <TableCell className="font-bold text-center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sponsors.map((sponsor) => (
                            <TableRow key={sponsor.id} hover>
                                <TableCell>
                                    <Avatar 
                                        src={sponsor.logoUrl} 
                                        alt={sponsor.name}
                                        variant="rounded"
                                        className="bg-gray-100 p-1"
                                        sx={{ width: 48, height: 48 }}
                                    >
                                        {sponsor.name.charAt(0)}
                                    </Avatar>
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium text-gray-900">{sponsor.name}</div>
                                    {sponsor.website && (
                                        <a 
                                            href={sponsor.website} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-xs text-primary-main flex items-center hover:underline"
                                        >
                                            Website <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={sponsor.category} 
                                        size="small" 
                                        color={sponsor.category === 'TITLE' ? 'primary' : 'default'}
                                        className="font-semibold"
                                    />
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {sponsor.zone || 'Global'}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={sponsor.status}
                                        size="small"
                                        color={
                                            sponsor.status === 'ACTIVE' ? 'success' : 
                                            sponsor.status === 'PENDING' ? 'warning' : 'error'
                                        }
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center space-x-2">
                                        {sponsor.status !== 'ACTIVE' && (
                                            <Tooltip title="Approve/Activate">
                                                <IconButton
                                                    color="success"
                                                    onClick={() => handleUpdateStatus(sponsor.id, 'ACTIVE')}
                                                    disabled={actionLoading === sponsor.id}
                                                >
                                                    <ShieldCheck className="w-5 h-5" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {sponsor.status === 'ACTIVE' && (
                                            <Tooltip title="Deactivate">
                                                <IconButton
                                                    color="warning"
                                                    onClick={() => handleUpdateStatus(sponsor.id, 'INACTIVE')}
                                                    disabled={actionLoading === sponsor.id}
                                                >
                                                    <ShieldAlert className="w-5 h-5" />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDelete(sponsor.id)}
                                                disabled={actionLoading === sponsor.id}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {sponsors.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                                    No sponsors found in the system.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default SponsorManagement;
