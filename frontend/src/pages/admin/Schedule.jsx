import { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, TextField, Button, Grid, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert,
    MenuItem, Select, FormControl, InputLabel, Box, Chip, Tab, Tabs, IconButton
} from '@mui/material';
import { Plus, Trash2, Calendar, Clock, MapPin, Tag, List, CalendarDays } from 'lucide-react';
import { useForm } from 'react-hook-form';
import api from '../../lib/api';

const ScheduleManagement = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [viewMode, setViewMode] = useState(0); // 0 for List, 1 for Calendar/Grouped
    const [filterCategory, setFilterCategory] = useState('ALL');

    const categories = ['Live Cooking', 'Music Performance', 'Workshop', 'Competition', 'Talk Show', 'Award Ceremony'];

    const fetchSchedules = async () => {
        try {
            const response = await api.get('/schedules/');
            setSchedules(response.data);
        } catch (err) {
            setError('Failed to fetch schedules. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const onSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            await api.post('/schedules/add', data);
            reset();
            fetchSchedules();
        } catch (err) {
            setError('Failed to add schedule');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this schedule?')) return;
        try {
            await api.delete(`/schedules/${id}`);
            fetchSchedules();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const filteredSchedules = filterCategory === 'ALL' 
        ? schedules 
        : schedules.filter(s => s.category === filterCategory);

    // Grouping by date for "Calendar View"
    const groupedSchedules = filteredSchedules.reduce((acc, curr) => {
        const date = curr.eventDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(curr);
        return acc;
    }, {});

    if (loading) return <div className="flex justify-center p-12"><CircularProgress /></div>;

    return (
        <Container maxWidth="lg" className="py-12">
            <div className="flex justify-between items-center mb-8">
                <Typography variant="h4" className="font-bold text-secondary-main">
                    Event Schedule Management
                </Typography>
                <div className="flex space-x-2">
                    <Tabs value={viewMode} onChange={(e, v) => setViewMode(v)} className="bg-gray-50 rounded-lg">
                        <Tab icon={<List className="w-4 h-4" />} label="List" />
                        <Tab icon={<CalendarDays className="w-4 h-4" />} label="Calendar" />
                    </Tabs>
                </div>
            </div>

            <Grid container spacing={4}>
                {/* Add New Schedule Form */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={1} className="p-6 rounded-xl border border-gray-100 sticky top-24">
                        <Typography variant="h6" className="font-bold mb-4 flex items-center">
                            <Plus className="w-5 h-5 mr-2 text-primary-main" /> Add New Event
                        </Typography>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <TextField
                                fullWidth
                                label="Event Name"
                                {...register('eventName', { required: 'Event name is required' })}
                                error={!!errors.eventName}
                                helperText={errors.eventName?.message}
                                size="small"
                                placeholder="e.g. Masterclass by Chef Joy"
                            />
                            <TextField
                                fullWidth
                                type="date"
                                label="Event Date"
                                InputLabelProps={{ shrink: true }}
                                {...register('eventDate', { required: 'Date is required' })}
                                error={!!errors.eventDate}
                                size="small"
                            />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="time"
                                        label="Start Time"
                                        InputLabelProps={{ shrink: true }}
                                        {...register('startTime', { required: 'Required' })}
                                        error={!!errors.startTime}
                                        size="small"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="time"
                                        label="End Time"
                                        InputLabelProps={{ shrink: true }}
                                        {...register('endTime', { required: 'Required' })}
                                        error={!!errors.endTime}
                                        size="small"
                                    />
                                </Grid>
                            </Grid>
                            
                            <FormControl fullWidth size="small">
                                <InputLabel>Category</InputLabel>
                                <Select
                                    label="Category"
                                    defaultValue=""
                                    {...register('category', { required: 'Category is required' })}
                                    error={!!errors.category}
                                >
                                    {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <TextField
                                fullWidth
                                label="Stage / Location"
                                {...register('stage')}
                                size="small"
                                placeholder="e.g. Main Stage"
                            />

                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={2}
                                {...register('description')}
                                size="small"
                            />

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                className="bg-primary-main hover:bg-primary-dark mt-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding...' : 'Add to Schedule'}
                            </Button>
                        </form>
                    </Paper>
                </Grid>

                {/* Existing Schedules Table/View */}
                <Grid item xs={12} md={8}>
                    <Box className="mb-6 flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-gray-400" />
                            <Typography variant="body2" className="text-gray-500 font-medium">Filter By Category:</Typography>
                        </div>
                        <Select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            size="small"
                            className="w-48"
                        >
                            <MenuItem value="ALL">All Categories</MenuItem>
                            {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                        </Select>
                    </Box>

                    {viewMode === 0 ? (
                        <TableContainer component={Paper} className="rounded-xl shadow-sm border border-gray-100">
                            <Table>
                                <TableHead className="bg-slate-50">
                                    <TableRow>
                                        <TableCell className="font-bold">Event Detals</TableCell>
                                        <TableCell className="font-bold">Time & Date</TableCell>
                                        <TableCell className="font-bold">Location</TableCell>
                                        <TableCell className="font-bold text-right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSchedules.map((item) => (
                                        <TableRow key={item.id} hover>
                                            <TableCell>
                                                <div className="font-bold text-gray-900">{item.eventName}</div>
                                                <div className="flex items-center mt-1">
                                                    <Chip label={item.category} size="xs" className="text-[10px] h-5 bg-blue-50 text-blue-600 font-bold" />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-gray-700">
                                                    <Calendar className="w-3 h-3 mr-2" /> {new Date(item.eventDate).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 mt-1">
                                                    <Clock className="w-3 h-3 mr-2" /> {item.startTime.slice(0, 5)} - {item.endTime.slice(0, 5)}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center text-sm text-gray-600 italic">
                                                    <MapPin className="w-3 h-3 mr-2" /> {item.stage || 'TBD'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <IconButton 
                                                    size="small" 
                                                    color="error"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredSchedules.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                                                No events found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Box className="space-y-8">
                            {Object.entries(groupedSchedules).sort().map(([date, items]) => (
                                <Box key={date}>
                                    <div className="flex items-center mb-4 sticky top-[80px] bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg z-10 border border-gray-200 shadow-sm">
                                        <Calendar className="w-5 h-5 mr-3 text-secondary-main" />
                                        <Typography variant="h6" className="font-bold">
                                            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </Typography>
                                        <Chip label={`${items.length} Events`} size="small" className="ml-auto bg-white border border-gray-200" />
                                    </div>
                                    <div className="grid gap-4">
                                        {items.map((item) => (
                                            <Paper key={item.id} className="p-5 border-l-4 border-primary-main hover:shadow-md transition-all shadow-sm flex items-center justify-between">
                                                <div className="flex-grow">
                                                    <div className="flex items-center mb-2">
                                                        <Chip label={item.category} size="small" className="bg-primary-50 text-primary-700 font-bold mr-2 text-[10px]" />
                                                        <div className="flex items-center text-gray-400 text-xs italic">
                                                            <MapPin className="w-3 h-3 mr-1" /> {item.stage}
                                                        </div>
                                                    </div>
                                                    <Typography variant="subtitle1" className="font-bold text-gray-900 leading-tight">
                                                        {item.eventName}
                                                    </Typography>
                                                    <Typography variant="body2" className="text-gray-500 mt-1 line-clamp-1">
                                                        {item.description}
                                                    </Typography>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="text-secondary-main font-black text-lg">
                                                        {item.startTime.slice(0, 5)}
                                                    </div>
                                                    <div className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                                                        {item.endTime.slice(0, 5)}
                                                    </div>
                                                    <IconButton 
                                                        size="small" 
                                                        className="mt-2 text-gray-300 hover:text-red-500"
                                                        onClick={() => handleDelete(item.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </IconButton>
                                                </div>
                                            </Paper>
                                        ))}
                                    </div>
                                </Box>
                            ))}
                            {Object.keys(groupedSchedules).length === 0 && (
                                <Box className="text-center py-20 bg-gray-50 rounded-2xl border-4 border-dashed border-gray-200">
                                    <CalendarDays className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <Typography variant="h6" className="text-gray-400">No events scheduled yet</Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default ScheduleManagement;
