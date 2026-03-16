import { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, Grid, TextField, Button, 
    CircularProgress, Alert, Card, CardMedia, CardContent, 
    IconButton, Dialog, DialogTitle, DialogContent, 
    DialogActions, FormControl, InputLabel, Select, MenuItem, Box
} from '@mui/material';
import { Plus, Trash2, Image as ImageIcon, Video, ExternalLink, PlayCircle } from 'lucide-react';
import api from '../../lib/api';

const AdminGallery = () => {
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [newItem, setNewItem] = useState({ mediaUrl: '', mediaType: 'IMAGE', description: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await api.get('/gallery/');
            // The API returns a Page object, so we need response.data.content
            setMedia(response.data.content || []);
        } catch (err) {
            setError('Failed to fetch gallery. ' + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleAddMedia = async () => {
        if (!newItem.mediaUrl) return;
        try {
            setIsSubmitting(true);
            await api.post('/gallery/add', newItem);
            setOpen(false);
            setNewItem({ mediaUrl: '', mediaType: 'IMAGE', description: '' });
            fetchGallery();
        } catch (err) {
            alert('Failed to add media');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this media?')) return;
        try {
            await api.delete(`/gallery/${id}`);
            fetchGallery();
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (loading && media.length === 0) {
        return <div className="flex justify-center p-12"><CircularProgress /></div>;
    }

    return (
        <Container maxWidth="lg" className="py-12">
            <div className="flex justify-between items-center mb-8">
                <Typography variant="h4" className="font-bold text-secondary-main">
                    Gallery Management
                </Typography>
                <Button 
                    variant="contained" 
                    startIcon={<Plus className="w-5 h-5" />}
                    onClick={() => setOpen(true)}
                    className="bg-primary-main hover:bg-primary-dark rounded-lg px-6"
                >
                    Add Media
                </Button>
            </div>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            <Grid container spacing={3}>
                {media.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card className="rounded-xl overflow-hidden shadow-sm border border-gray-100 group relative">
                            <div className="relative aspect-video bg-gray-100">
                                {item.mediaType === 'IMAGE' ? (
                                    <CardMedia
                                        component="img"
                                        image={item.mediaUrl}
                                        alt={item.description}
                                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-black">
                                        <PlayCircle className="text-white w-12 h-12 opacity-50" />
                                        <Typography variant="caption" className="absolute bottom-2 right-2 text-white bg-black/50 px-2 rounded">
                                            VIDEO
                                        </Typography>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                    <IconButton 
                                        className="bg-white/20 hover:bg-white/40 text-white"
                                        onClick={() => window.open(item.mediaUrl, '_blank')}
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </IconButton>
                                    <IconButton 
                                        className="bg-red-500/80 hover:bg-red-600 text-white"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </IconButton>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <Typography variant="body2" className="text-gray-600 font-medium line-clamp-2">
                                    {item.description || 'No description'}
                                </Typography>
                                <Typography variant="caption" className="text-gray-400 mt-2 block">
                                    Added on {new Date(item.createdAt).toLocaleDateString()}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                {media.length === 0 && (
                    <Grid item xs={12}>
                        <Paper className="p-12 text-center rounded-2xl border-2 border-dashed border-gray-100 bg-gray-50/50">
                            <ImageIcon className="mx-auto w-12 h-12 text-gray-300 mb-4" />
                            <Typography className="text-gray-400 mb-4">The gallery is currently empty.</Typography>
                            <Button variant="outlined" onClick={() => setOpen(true)}>Upload your first photo</Button>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Add Media Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle className="font-bold">Add New Media</DialogTitle>
                <DialogContent className="pt-4 flex flex-col space-y-4">
                    <TextField
                        fullWidth
                        label="Media URL"
                        placeholder="https://example.com/image.jpg"
                        value={newItem.mediaUrl}
                        onChange={(e) => setNewItem({ ...newItem, mediaUrl: e.target.value })}
                        size="small"
                        autoFocus
                    />
                    <FormControl fullWidth size="small">
                        <InputLabel>Type</InputLabel>
                        <Select
                            label="Type"
                            value={newItem.mediaType}
                            onChange={(e) => setNewItem({ ...newItem, mediaType: e.target.value })}
                        >
                            <MenuItem value="IMAGE">Image</MenuItem>
                            <MenuItem value="VIDEO">Video</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        label="Description / Caption"
                        multiline
                        rows={2}
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        size="small"
                    />
                    {newItem.mediaUrl && newItem.mediaType === 'IMAGE' && (
                        <Box className="mt-4 border rounded-lg overflow-hidden h-40 bg-gray-50 flex items-center justify-center">
                            <img src={newItem.mediaUrl} alt="Preview" className="max-h-full max-w-full object-contain" onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL'} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="p-4">
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleAddMedia}
                        disabled={!newItem.mediaUrl || isSubmitting}
                        className="bg-primary-main hover:bg-primary-dark"
                    >
                        {isSubmitting ? 'Uploading...' : 'Add to Gallery'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AdminGallery;
