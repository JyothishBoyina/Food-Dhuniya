import { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Table, TableBody, TableCell, 
    TableContainer, TableHead, TableRow, Button, CircularProgress, 
    Alert, Avatar, Chip, Dialog, DialogTitle, DialogContent, 
    DialogActions, Select, MenuItem, FormControl, InputLabel, TextField
} from '@mui/material';
import { Shield, User, Search, ShieldCheck, Mail, Calendar } from 'lucide-react';
import api from '../../lib/api';

const AdminUserRoles = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [updating, setUpdating] = useState(false);

    const roles = ['ADMIN', 'VENDOR_MANAGER', 'TICKET_MANAGER', 'CONTENT_MANAGER', 'EVENT_MANAGER', 'VENDOR', 'SPONSOR', 'VISITOR'];

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            setError('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async () => {
        try {
            setUpdating(true);
            await api.put(`/admin/users/${selectedUser.id}/role`, newRole);
            setSelectedUser(null);
            fetchUsers();
            alert('Role updated successfully');
        } catch (err) {
            alert('Failed to update role');
        } finally {
            setUpdating(false);
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const getRoleColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'error';
            case 'VENDOR_MANAGER': 
            case 'TICKET_MANAGER':
            case 'CONTENT_MANAGER':
            case 'EVENT_MANAGER': return 'warning';
            case 'VENDOR': return 'primary';
            case 'SPONSOR': return 'secondary';
            default: return 'default';
        }
    };

    if (loading) return <div className="flex justify-center p-12"><CircularProgress /></div>;

    return (
        <Container maxWidth="lg" className="py-12">
            <div className="flex justify-between items-center mb-8">
                <Typography variant="h4" className="font-bold text-secondary-main">
                    User Roles & Permissions
                </Typography>
                <TextField
                    placeholder="Search users..."
                    size="small"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        startAdornment: <Search className="w-4 h-4 mr-2 text-gray-400" />
                    }}
                    className="w-64"
                />
            </div>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            <TableContainer component={Paper} className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHead className="bg-slate-50">
                        <TableRow>
                            <TableCell className="font-bold">User Information</TableCell>
                            <TableCell className="font-bold">Contact</TableCell>
                            <TableCell className="font-bold">Joined</TableCell>
                            <TableCell className="font-bold">Current Role</TableCell>
                            <TableCell className="font-bold text-right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <div className="flex items-center">
                                        <Avatar className="bg-primary-50 text-primary-main font-bold mr-3">
                                            {user.username[0].toUpperCase()}
                                        </Avatar>
                                        <div>
                                            <div className="font-bold text-gray-900">{user.username}</div>
                                            <div className="text-xs text-gray-400 flex items-center">
                                                <User className="w-3 h-3 mr-1" /> ID: #{user.id}
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-3 h-3 mr-2" /> {user.email}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="w-3 h-3 mr-2" /> {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.role.replace('_', ' ')} 
                                        size="small"
                                        color={getRoleColor(user.role)}
                                        className="font-bold text-[10px]"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        size="small" 
                                        startIcon={<Shield className="w-4 h-4" />}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setNewRole(user.role);
                                        }}
                                        disabled={user.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length === 1}
                                        className="text-primary-main"
                                    >
                                        Change Role
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Change Role Dialog */}
            <Dialog open={!!selectedUser} onClose={() => setSelectedUser(null)} fullWidth maxWidth="xs">
                <DialogTitle className="font-bold flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-primary-main" /> Update User Role
                </DialogTitle>
                <DialogContent className="pt-4">
                    {selectedUser && (
                        <div className="mb-6 bg-slate-50 p-4 rounded-xl">
                            <Typography variant="body2" className="text-gray-500 mb-1 uppercase text-[10px] font-black">Managing Permissions for:</Typography>
                            <Typography variant="h6" className="font-bold truncate">{selectedUser.username}</Typography>
                            <Typography variant="caption" className="text-gray-400">{selectedUser.email}</Typography>
                        </div>
                    )}
                    <FormControl fullWidth size="small">
                        <InputLabel>New Role</InputLabel>
                        <Select
                            label="New Role"
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                        >
                            {roles.map(r => (
                                <MenuItem key={r} value={r}>
                                    {r.replace('_', ' ')}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <Typography variant="caption" className="text-blue-700 flex italic">
                            Changing roles affects the user's access permissions immediately.
                        </Typography>
                    </Box>
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setSelectedUser(null)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleUpdateRole}
                        disabled={updating || (selectedUser && newRole === selectedUser.role)}
                        className="bg-primary-main hover:bg-primary-dark"
                    >
                        {updating ? 'Updating...' : 'Confirm Change'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminUserRoles;
