import { useState, useEffect, useCallback } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, Chip, 
    CircularProgress, Alert, TextField, IconButton, Tooltip,
    TablePagination, Tabs, Tab, Box, Dialog, DialogTitle, 
    DialogContent, DialogActions, FormControl, InputLabel, 
    Select, MenuItem, Stack, Grid
} from '@mui/material';
import { Search, CheckCircle, XCircle, Trash2, Eye, MapPin, CreditCard, Filter } from 'lucide-react';
import api from '../../lib/api';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    
    // Filters and Pagination
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    
    // Modals
    const [viewVendor, setViewVendor] = useState(null);
    const [approveModal, setApproveModal] = useState(null);
    const [paymentModal, setPaymentModal] = useState(null);
    const [stallNumber, setStallNumber] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('');

    const fetchVendors = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/vendors/admin/list', {
                params: {
                    search,
                    page,
                    size,
                    status: statusFilter === 'ALL' ? undefined : statusFilter
                }
            });
            setVendors(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (err) {
            setError('Failed to fetch vendors. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    }, [search, page, size, statusFilter]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchVendors();
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [fetchVendors]);

    const handleApprove = async () => {
        try {
            setActionLoading(approveModal.id);
            await api.put(`/vendors/${approveModal.id}/approve`, null, {
                params: { stallNumber }
            });
            setApproveModal(null);
            setStallNumber('');
            fetchVendors();
        } catch (err) {
            alert('Approval failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm('Are you sure you want to reject this application?')) return;
        try {
            setActionLoading(id);
            await api.put(`/vendors/${id}/reject`);
            fetchVendors();
        } catch (err) {
            alert('Rejection failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handlePaymentUpdate = async () => {
        try {
            setActionLoading(paymentModal.id);
            await api.put(`/vendors/${paymentModal.id}/payment-status`, null, {
                params: { status: paymentStatus }
            });
            setPaymentModal(null);
            fetchVendors();
        } catch (err) {
            alert('Update failed');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vendor record?')) return;
        try {
            setActionLoading(id);
            await api.delete(`/vendors/${id}`);
            fetchVendors();
        } catch (err) {
            alert('Delete failed');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'REJECTED': return 'error';
            default: return 'warning';
        }
    };

    return (
        <Container maxWidth="xl" className="py-12">
            <header className="mb-8">
                <Typography variant="h3" className="font-extrabold text-secondary-main mb-2">
                    Vendor Management
                </Typography>
                <Typography variant="body1" className="text-gray-500">
                    Review applications, assign stalls, and track payments for food vendors.
                </Typography>
            </header>

            <Paper className="mb-8 p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <Tabs 
                        value={statusFilter} 
                        onChange={(e, val) => { setStatusFilter(val); setPage(0); }}
                        indicatorColor="primary"
                        textColor="primary"
                        className="border-b lg:border-none"
                    >
                        <Tab label="All Vendors" value="ALL" />
                        <Tab label="Pending" value="PENDING" />
                        <Tab label="Approved" value="APPROVED" />
                        <Tab label="Rejected" value="REJECTED" />
                    </Tabs>

                    <TextField
                        size="small"
                        placeholder="Search business, contact, or cuisine..."
                        variant="outlined"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: <Search className="w-4 h-4 text-gray-400 mr-2" />,
                        }}
                        className="bg-white min-w-[300px]"
                    />
                </div>
            </Paper>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            <TableContainer component={Paper} className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table sx={{ minWidth: 1000 }}>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-bold">Business & Contact</TableCell>
                            <TableCell className="font-bold">Cuisine & Stall Type</TableCell>
                            <TableCell className="font-bold">Application Date</TableCell>
                            <TableCell className="font-bold">Status</TableCell>
                            <TableCell className="font-bold">Stall #</TableCell>
                            <TableCell className="font-bold">Payment</TableCell>
                            <TableCell className="font-bold align-center text-center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vendors.map((vendor) => (
                            <TableRow key={vendor.id} hover>
                                <TableCell>
                                    <Typography className="font-bold text-gray-800">{vendor.businessName}</Typography>
                                    <div className="text-sm text-gray-500">
                                        {vendor.contactPerson} • {vendor.phone}
                                    </div>
                                    <div className="text-xs text-blue-600">{vendor.email}</div>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{vendor.cuisineType}</Typography>
                                    <Typography variant="caption" className="text-gray-400 block">{vendor.stallType}</Typography>
                                </TableCell>
                                <TableCell>
                                    {new Date(vendor.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={vendor.status} 
                                        size="small" 
                                        color={getStatusColor(vendor.status)} 
                                        className="font-bold"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography className="font-mono font-bold text-primary-main">
                                        {vendor.stallNumber || '---'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={vendor.paymentStatus} 
                                        size="small" 
                                        variant="outlined"
                                        color={vendor.paymentStatus === 'PAID' ? 'success' : 'warning'}
                                        onClick={() => { setPaymentModal(vendor); setPaymentStatus(vendor.paymentStatus); }}
                                        className="cursor-pointer"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1} justifyContent="center">
                                        <Tooltip title="View Details">
                                            <IconButton size="small" onClick={() => setViewVendor(vendor)}>
                                                <Eye className="w-5 h-5 text-gray-500" />
                                            </IconButton>
                                        </Tooltip>

                                        {vendor.status === 'PENDING' && (
                                            <>
                                                <Tooltip title="Approve">
                                                    <IconButton 
                                                        size="small" 
                                                        color="success" 
                                                        onClick={() => { setApproveModal(vendor); setStallNumber(''); }}
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Reject">
                                                    <IconButton 
                                                        size="small" 
                                                        color="error"
                                                        onClick={() => handleReject(vendor.id)}
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </IconButton>
                                                </Tooltip>
                                            </>
                                        )}

                                        {vendor.status === 'APPROVED' && (
                                            <Tooltip title="Edit Stall #">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={() => { setApproveModal(vendor); setStallNumber(vendor.stallNumber || ''); }}
                                                >
                                                    <MapPin className="w-5 h-5" />
                                                </IconButton>
                                            </Tooltip>
                                        )}

                                        <Tooltip title="Delete">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(vendor.id)}>
                                                <Trash2 className="w-5 h-5" />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                
                {vendors.length === 0 && !loading && (
                    <div className="text-center py-20 bg-gray-50">
                        <Typography className="text-gray-400">No vendors matching criteria.</Typography>
                    </div>
                )}

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={totalElements}
                    rowsPerPage={size}
                    page={page}
                    onPageChange={(e, val) => setPage(val)}
                    onRowsPerPageChange={(e) => { setSize(parseInt(e.target.value, 10)); setPage(0); }}
                />
            </TableContainer>

            {/* View Details Modal */}
            <Dialog open={!!viewVendor} onClose={() => setViewVendor(null)} maxWidth="sm" fullWidth>
                <DialogTitle className="font-bold border-b">Vendor Details</DialogTitle>
                <DialogContent className="pt-6">
                    {viewVendor && (
                        <div className="space-y-4">
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" className="text-gray-500 uppercase">Business Name</Typography>
                                    <Typography className="font-bold">{viewVendor.businessName}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" className="text-gray-500 uppercase">Contact Person</Typography>
                                    <Typography>{viewVendor.contactPerson}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" className="text-gray-500 uppercase">Cuisine Type</Typography>
                                    <Typography>{viewVendor.cuisineType}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" className="text-gray-500 uppercase">Stall Type</Typography>
                                    <Typography>{viewVendor.stallType}</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption" className="text-gray-500 uppercase">Menu Overview</Typography>
                                    <Paper variant="outlined" className="p-3 bg-gray-50 text-sm mt-1 whitespace-pre-wrap">
                                        {viewVendor.menuItems || 'No items listed'}
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="caption" className="text-gray-500 uppercase">FSSAI License #</Typography>
                                    <Typography className="font-mono">{viewVendor.fssaiLicense || 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </DialogContent>
                <DialogActions className="p-4 bg-gray-50">
                    <Button onClick={() => setViewVendor(null)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Approve / Edit Stall Modal */}
            <Dialog open={!!approveModal} onClose={() => setApproveModal(null)}>
                <DialogTitle className="font-bold">{approveModal?.status === 'APPROVED' ? 'Edit Stall Number' : 'Approve Vendor Application'}</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" className="text-gray-500 mb-4">
                        Please assign a stall number to this vendor.
                    </Typography>
                    <TextField
                        autoFocus
                        fullWidth
                        label="Stall Number"
                        variant="outlined"
                        value={stallNumber}
                        onChange={(e) => setStallNumber(e.target.value)}
                        placeholder="e.g. A-12, FOOD-05"
                    />
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setApproveModal(null)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={handleApprove}
                        disabled={!stallNumber}
                    >
                        {approveModal?.status === 'APPROVED' ? 'Save Changes' : 'Approve & Assign'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Payment Modal */}
            <Dialog open={!!paymentModal} onClose={() => setPaymentModal(null)}>
                <DialogTitle className="font-bold">Update Payment Status</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth className="mt-4">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={paymentStatus}
                            label="Status"
                            onChange={(e) => setPaymentStatus(e.target.value)}
                        >
                            <MenuItem value="UNPAID">Unpaid</MenuItem>
                            <MenuItem value="PARTIAL">Partial</MenuItem>
                            <MenuItem value="PAID">Paid</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setPaymentModal(null)}>Cancel</Button>
                    <Button variant="contained" onClick={handlePaymentUpdate}>Update Status</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default VendorManagement;
