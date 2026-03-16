import { useState, useEffect } from 'react';
import { Typography, Container, Grid, Card, CardMedia, CardContent, CircularProgress, Alert } from '@mui/material';
import api from '../../lib/api';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const placeholders = [
        { id: 'p1', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Food Tasting' },
        { id: 'p2', url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Live Cooking' },
        { id: 'p3', url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Gourmet Dishes' },
        { id: 'p4', url: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Dessert Station' },
        { id: 'p5', url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Vegan Delights' },
        { id: 'p6', url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', title: 'Pasta Making' },
    ];

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/gallery/');
                // Backend returns Page<Gallery>, use response.data.content
                setImages(response.data.content || []);
            } catch (err) {
                setError('Failed to fetch gallery images. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchGallery();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress className="text-primary-main" />
            </div>
        );
    }

    return (
        <Container maxWidth="lg" className="py-12 min-h-[70vh]">
            <div className="text-center mb-12 flex flex-col items-center">
                <Typography variant="h3" align="center" component="h1" className="font-extrabold text-secondary-main mb-4 text-center">
                    Photo Gallery
                </Typography>
                <Typography variant="h6" align="center" className="text-gray-500 max-w-2xl mx-auto font-normal text-center">
                    A glimpse into the magical moments of Food Dhuniya.
                </Typography>
            </div>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            <Grid container spacing={3} justifyContent="center">
                {(images.length > 0 ? images : placeholders).map((image) => (
                    <Grid item xs={12} sm={6} md={4} key={image.id}>
                        <Card className="hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-2 cursor-pointer">
                            <CardMedia
                                component="img"
                                height="240"
                                image={image.url}
                                alt={image.title}
                                className="h-60 object-cover"
                            />
                            <CardContent className="bg-slate-50 py-3">
                                <Typography variant="subtitle1" className="font-semibold text-center text-gray-700">
                                    {image.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Gallery;
