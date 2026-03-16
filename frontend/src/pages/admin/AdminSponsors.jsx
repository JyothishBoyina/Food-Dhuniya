import { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Chip, IconButton, 
    CircularProgress, TextField, InputAdornment, Box, Alert, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid
} from '@mui/material';
import { Search, CheckCircle, XCircle, Trash2, Eye, Building2, User, Mail, Tag, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/api';

const STATUS_COLORS = {
    PENDING: { color: 'warning', label: 'Pending' },
    APPROVED: { color: 'success', label: 'Approved' },
    REJECTED: { color: 'error', label: 'Rejected' }
};

const CATEGORY_LABELS = {
    TITLE_SPONSOR: 'Title Sponsor',
    POWERED_BY: 'Powered By',
    CO_SPONSOR: 'Co-Sponsor',
    ASSOCIATE_SPONSOR: 'Associate Sponsor'
};

const AdminSponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // View Modal State
    const [viewSponsor, setViewSponsor] = useState(null);

    const fetchSponsors = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/sponsors/admin/list?search=${searchQuery}&size=100`);
            setSponsors(response.data.content);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch sponsors');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSponsors();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleStatusChange = async (id, action) => {
        try {
            await api.put(`/sponsors/admin/${id}/${action}`);
            fetchSponsors();
            if (viewSponsor && viewSponsor.id === id) setViewSponsor(null);
        } catch (err) {
            setError(`Failed to ${action} sponsor`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sponsor?')) return;
        try {
            await api.delete(`/sponsors/admin/${id}`);
            fetchSponsors();
            if (viewSponsor && viewSponsor.id === id) setViewSponsor(null);
        } catch (err) {
            setError('Failed to delete sponsor');
        }
    };

    return (
        <Container maxWidth="xl" className="py-8">
            <Box className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <Typography variant="h4" className="font-black text-secondary-main tracking-tight">
                        Sponsor Management
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1">
                        Review, approve, and manage event sponsors.
                    </Typography>
                </div>
                
                <TextField
                    size="small"
                    placeholder="Search sponsors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search className="w-4 h-4 text-gray-400" />
                            </InputAdornment>
                        ),
                        className: 'bg-white rounded-xl'
                    }}
                    className="w-full md:w-72"
                />
            </Box>

            {error && (
                <Alert severity="error" className="mb-6 rounded-xl" onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Paper className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <TableContainer>
                    <Table>
                        <TableHead className="bg-slate-50 border-b border-slate-200">
                            <TableRow>
                                <TableCell className="font-bold text-slate-700">Business Name</TableCell>
                                <TableCell className="font-bold text-slate-700">Category</TableCell>
                                <TableCell className="font-bold text-slate-700">Contact Person</TableCell>
                                <TableCell className="font-bold text-slate-700">Status</TableCell>
                                <TableCell align="right" className="font-bold text-slate-700">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" className="py-12">
                                        <CircularProgress size={32} />
                                    </TableCell>
                                </TableRow>
                            ) : sponsors.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" className="py-12">
                                        <div className="flex flex-col items-center text-gray-500">
                                            <Building2 className="w-12 h-12 mb-3 opacity-20" />
                                            <Typography variant="h6" className="font-bold text-gray-400">No Sponsors Found</Typography>
                                            <Typography variant="body2" className="text-gray-400">Could not find any matching sponsors.</Typography>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sponsors.map((sponsor) => (
                                    <TableRow key={sponsor.id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                                    {sponsor.logoUrl ? (
                                                        <img src={sponsor.logoUrl} alt={sponsor.businessName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Building2 className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <Typography className="font-bold text-slate-800">{sponsor.businessName}</Typography>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={CATEGORY_LABELS[sponsor.category] || sponsor.category} 
                                                size="small"
                                                className="bg-blue-50 text-blue-700 font-bold border border-blue-200"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" className="text-slate-700">{sponsor.contactPerson}</Typography>
                                            <Typography variant="caption" className="text-slate-500 block">{sponsor.email}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={STATUS_COLORS[sponsor.status]?.label || sponsor.status}
                                                color={STATUS_COLORS[sponsor.status]?.color || 'default'}
                                                size="small"
                                                className="font-bold"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <div className="flex justify-end gap-1">
                                                <Tooltip title="View Details">
                                                    <IconButton size="small" onClick={() => setViewSponsor(sponsor)} className="text-slate-400 hover:text-blue-600">
                                                        <Eye className="w-4 h-4" />
                                                    </IconButton>
                                                </Tooltip>
                                                {sponsor.status !== 'APPROVED' && (
                                                    <Tooltip title="Approve">
                                                        <IconButton size="small" onClick={() => handleStatusChange(sponsor.id, 'approve')} className="text-emerald-500 hover:bg-emerald-50">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {sponsor.status !== 'REJECTED' && (
                                                    <Tooltip title="Reject">
                                                        <IconButton size="small" onClick={() => handleStatusChange(sponsor.id, 'reject')} className="text-orange-500 hover:bg-orange-50">
                                                            <XCircle className="w-4 h-4" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" onClick={() => handleDelete(sponsor.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50">
                                                        <Trash2 className="w-4 h-4" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* View Details Modal */}
            <Dialog 
                open={!!viewSponsor} 
                onClose={() => setViewSponsor(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{ className: "rounded-2xl" }}
            >
                {viewSponsor && (
                    <>
                        <DialogTitle className="border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                                    {viewSponsor.logoUrl ? (
                                        <img src={viewSponsor.logoUrl} alt={viewSponsor.businessName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="w-6 h-6 text-slate-400" />
                                    )}
                                </div>
                                <div className="flex-grow flex justify-between items-center">
                                    <div>
                                        <Typography variant="h5" className="font-black text-secondary-main">{viewSponsor.businessName}</Typography>
                                        <Chip 
                                            label={CATEGORY_LABELS[viewSponsor.category] || viewSponsor.category} 
                                            size="small"
                                            className="bg-blue-50 text-blue-700 font-bold border border-blue-200 mt-1"
                                        />
                                    </div>
                                    <Chip 
                                        label={STATUS_COLORS[viewSponsor.status]?.label || viewSponsor.status}
                                        color={STATUS_COLORS[viewSponsor.status]?.color || 'default'}
                                        className="font-bold"
                                    />
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent className="pt-6">
                            <Grid container spacing={4}>
                                <Grid item xs={12} md={6}>
                                    <DetailField icon={<User className="w-4 h-4" />} label="Contact Person" value={viewSponsor.contactPerson} />
                                    <DetailField icon={<Mail className="w-4 h-4" />} label="Email Address" value={viewSponsor.email} />
                                    <DetailField icon={<Tag className="w-4 h-4" />} label="Category" value={CATEGORY_LABELS[viewSponsor.category]} />
                                </Grid>
                                
                                {viewSponsor.description && (
                                    <Grid item xs={12}>
                                        <Typography variant="caption" className="font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description</Typography>
                                        <Paper elevation={0} className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 whitespace-pre-wrap text-sm">
                                            {viewSponsor.description}
                                        </Paper>
                                    </Grid>
                                )}

                                {viewSponsor.bannerUrl && (
                                    <Grid item xs={12}>
                                        <DetailField icon={<ImageIcon className="w-4 h-4" />} label="Banner Image" value={null} />
                                        <div className="mt-2 aspect-[3/1] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                            <img src={viewSponsor.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                                        </div>
                                    </Grid>
                                )}
                            </Grid>
                        </DialogContent>
                        <DialogActions className="p-4 border-t border-slate-100">
                            <Button onClick={() => setViewSponsor(null)} className="text-slate-500">Close</Button>
                            {viewSponsor.status !== 'REJECTED' && (
                                <Button 
                                    variant="outlined" 
                                    color="error" 
                                    onClick={() => handleStatusChange(viewSponsor.id, 'reject')}
                                    className="font-bold rounded-xl px-6"
                                >
                                    Reject
                                </Button>
                            )}
                            {viewSponsor.status !== 'APPROVED' && (
                                <Button 
                                    variant="contained" 
                                    color="success" 
                                    onClick={() => handleStatusChange(viewSponsor.id, 'approve')}
                                    className="font-bold rounded-xl px-6 shadow-none hover:shadow-sm"
                                >
                                    Approve
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Container>
    );
};

const DetailField = ({ icon, label, value }) => (
    <div className="mb-4">
        <div className="flex items-center gap-1.5 text-slate-400 mb-1">
            {icon}
            <Typography variant="caption" className="font-bold uppercase tracking-wider leading-none">{label}</Typography>
        </div>
        {value && <Typography className="font-semibold text-slate-800">{value}</Typography>}
    </div>
);

export default AdminSponsors;
