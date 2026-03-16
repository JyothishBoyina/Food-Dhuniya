import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { ChevronRight } from 'lucide-react';

const events = [
    {
        id: 'cooking-shows',
        title: 'Live Cooking Shows',
        description: 'Watch culinary magic unfold as master chefs demonstrate signature dishes, share secret recipes, and offer live tasting sessions.',
        color: '#f97316',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'celebrity-chefs',
        title: 'Celebrity Chefs',
        description: 'Exclusive meet-and-greets, book signings, and interactive workshops with renowned culinary stars and local food icons.',
        color: '#8b5cf6',
        image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'music-dj',
        title: 'Music & DJ Nights',
        description: 'Vibrant evenings featuring top local bands, acoustic performances, and high-energy DJ sets.',
        color: '#3b82f6',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'food-competitions',
        title: 'Food Competitions',
        description: 'Exciting contests like the Spicy Biryani Challenge and Burger Eating Contest.',
        color: '#ef4444',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
    {
        id: 'kids-entertainment',
        title: 'Kids Entertainment',
        description: 'A fun zone with magic shows, face painting, mini cooking workshops, and games.',
        color: '#ec4899',
        image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
    },
];

const Events = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <Container maxWidth="lg">
                <div className="text-center mb-16 flex flex-col items-center">
                    <Typography variant="overline" className="text-primary-main font-black tracking-widest text-lg text-center">
                        What's On
                    </Typography>
                    <Typography variant="h2" align="center" className="font-extrabold text-secondary-main mt-2 text-center">
                        Festival Events
                    </Typography>
                </div>

                <Grid container spacing={4} justifyContent="center" className="mb-24">
                    {events.map((event) => (
                        <Grid item xs={12} sm={4} key={event.id} className="flex">
                            <Paper
                                elevation={2}
                                className="group w-full aspect-square flex flex-col p-0 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white"
                                style={{
                                    border: `2px solid transparent`,
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = event.color}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <div className="h-1/2 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 z-10" />
                                    <img
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <div
                                            className="w-3 h-3 rounded-full shadow-lg"
                                            style={{ backgroundColor: event.color }}
                                        />
                                    </div>
                                </div>
                                <div className="p-6 h-1/2 flex flex-col text-center items-center justify-center">
                                    <div className="text-center">
                                        <Typography variant="h5" className="font-bold text-gray-800 mb-2 text-center">
                                            {event.title}
                                        </Typography>
                                        <Typography variant="body2" className="text-gray-600 mb-4 text-center line-clamp-3">
                                            {event.description}
                                        </Typography>
                                    </div>
                                    <Button
                                        variant="text"
                                        className="font-bold rounded-xl mt-auto mx-auto"
                                        style={{ color: event.color }}
                                        endIcon={<ChevronRight size={18} />}
                                    >
                                        Learn more
                                    </Button>
                                </div>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
};

export default Events;
