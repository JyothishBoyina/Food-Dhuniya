import { Link } from 'react-router-dom';
import { Button, Typography, Grid, Paper, Container, Box } from '@mui/material';
import { Calendar, Users, Ticket, Image as ImageIcon, Star, MapPin, Clock } from 'lucide-react';
import heroImage from '../../assets/hero.png';
import tacosImage from '../../assets/tacos.png';
import concertImage from '../../assets/concert.png';

const Home = () => {
    const features = [
        {
            title: 'Gourmet Stalls',
            description: 'Savor world-class dishes from 50+ handpicked local and international vendors.',
            icon: <Users className="w-8 h-8 text-primary-main" />,
            link: '/vendors',
            img: tacosImage
        },
        {
            title: 'Live Entertainment',
            description: 'Experience the beat with live bands, DJ sets, and cultural performances.',
            icon: <Calendar className="w-8 h-8 text-primary-main" />,
            link: '/events',
            img: concertImage
        },
        {
            title: 'Instant Access',
            description: 'Skip the queues. Secure your digital tickets and food passes in seconds.',
            icon: <Ticket className="w-8 h-8 text-primary-main" />,
            link: '/login'
        }
    ];

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <div
                className="relative h-[85vh] flex items-center justify-center text-white overflow-hidden"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <Container maxWidth="lg" className="relative z-10 text-center flex flex-col items-center">
                    <Typography
                        variant="h1"
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-fade-in-up text-center"
                    >
                        Taste the <span className="text-primary-main italic">Extraordinary</span>
                    </Typography>
                    <Typography
                        variant="h5"
                        className="max-w-2xl mx-auto text-lg md:text-xl text-gray-200 mb-10 font-light leading-relaxed text-center"
                    >
                        Join us for Food Dhuniya 2026—a grand celebration of flavor, music, and community. Discover the city's best hidden gems in one place.
                    </Typography>
                    <div className="flex justify-center">
                        <Button
                            variant="contained"
                            component={Link}
                            to="/tickets/book"
                            size="large"
                            className="bg-primary-main hover:bg-primary-dark text-white px-12 py-5 rounded-full font-black text-xl transition-all duration-300 transform hover:scale-110 shadow-[0_0_20px_rgba(251,146,60,0.4)] hover:shadow-[0_0_30px_rgba(251,146,60,0.6)]"
                        >
                            Book Tickets Now
                        </Button>
                    </div>
                </Container>
                {/* Decorative Scroll indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-70">
                    <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Stats / Value Section */}
            <div className="py-12 bg-slate-50 border-y border-gray-100">
                <Container maxWidth="lg" className="text-center">
                    <Grid container spacing={4} justifyContent="center" className="divide-x divide-gray-200">
                        <Grid item xs={6} md={3}>
                            <Typography variant="h4" className="font-black text-secondary-main">50+</Typography>
                            <Typography variant="body2" className="text-gray-500 uppercase tracking-widest font-bold">Vendors</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h4" className="font-black text-secondary-main">12</Typography>
                            <Typography variant="body2" className="text-gray-500 uppercase tracking-widest font-bold">Live Acts</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h4" className="font-black text-secondary-main">20K</Typography>
                            <Typography variant="body2" className="text-gray-500 uppercase tracking-widest font-bold">Foodies</Typography>
                        </Grid>
                        <Grid item xs={6} md={3}>
                            <Typography variant="h4" className="font-black text-secondary-main">3</Typography>
                            <Typography variant="body2" className="text-gray-500 uppercase tracking-widest font-bold">Grand Days</Typography>
                        </Grid>
                    </Grid>
                </Container>
            </div>

            {/* Features / Experience Area */}
            <Container maxWidth="lg" className="py-24">
                <div className="text-center mb-16 flex flex-col items-center justify-center">
                    <Typography variant="overline" className="text-primary-main font-black tracking-widest text-center">
                        The Experience
                    </Typography>
                    <Typography variant="h3" className="font-black text-secondary-main mt-2 text-center">
                        What's Cooking?
                    </Typography>
                </div>

                <Grid container spacing={6} justifyContent="center">
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={0}
                                className="group h-full flex flex-col items-center text-center p-8 rounded-3xl border border-gray-100 hover:border-primary-light transition-all duration-500 bg-white"
                            >
                                {feature.img && (
                                    <div className="w-full h-48 mb-8 overflow-hidden rounded-2xl">
                                        <img
                                            src={feature.img}
                                            alt={feature.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                )}
                                <div className="bg-orange-50 p-4 rounded-2xl mb-6 group-hover:bg-primary-main group-hover:text-white transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <Typography variant="h5" className="font-black mb-4 group-hover:text-primary-main transition-colors">
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" className="text-gray-600 leading-relaxed mb-6 italic">
                                    "{feature.description}"
                                </Typography>
                                <Button
                                    component={Link}
                                    to={feature.link}
                                    className="text-primary-main font-bold capitalize mt-auto flex items-center justify-center gap-1 group-hover:gap-2 transition-all mx-auto"
                                >
                                    Learn More →
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Testimonial Section - Social Proof */}
            <div className="bg-secondary-main text-white py-24">
                <Container maxWidth="lg">
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} md={6} className="text-center md:text-center flex flex-col items-center">
                            <Typography variant="h3" className="font-black mb-6 leading-tight text-center">
                                "The best food event I've ever attended. The variety was insane!"
                            </Typography>
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-primary-main flex items-center justify-center font-bold text-xl">R</div>
                                <div className="text-left">
                                    <Typography variant="h6" className="font-bold">Rahul Sharma</Typography>
                                    <Typography variant="body2" className="text-gray-400">Local Food Blogger</Typography>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} className="space-y-6">
                            <Box className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                                <div className="flex text-yellow-400 mb-2">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <Typography className="text-gray-300 italic">"Ordering tickets was seamless. No more standing in long lines at the venue. 10/10!"</Typography>
                            </Box>
                            <Box className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors ml-12">
                                <div className="flex text-yellow-400 mb-2">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <Typography className="text-gray-300 italic">"As a vendor, this platform made registration and stall management so easy. Highly recommend!"</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </div>

            {/* Map / Logistics Section */}
            <Container maxWidth="lg" className="py-24 text-center">
                <Typography variant="h4" className="font-black text-secondary-main mb-12">Save the Date</Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <div className="flex flex-col items-center">
                            <MapPin className="text-primary-main w-12 h-12 mb-4" />
                            <Typography variant="h6" className="font-bold">Venue</Typography>
                            <Typography variant="body1" className="text-gray-600">Central Exhibition Grounds, Bengaluru</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className="flex flex-col items-center">
                            <Calendar className="text-primary-main w-12 h-12 mb-4" />
                            <Typography variant="h6" className="font-bold">Date</Typography>
                            <Typography variant="body1" className="text-gray-600">Oct 24th - 26th, 2026</Typography>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <div className="flex flex-col items-center">
                            <Clock className="text-primary-main w-12 h-12 mb-4" />
                            <Typography variant="h6" className="font-bold">Timing</Typography>
                            <Typography variant="body1" className="text-gray-600">11:00 AM - 11:00 PM Daily</Typography>
                        </div>
                    </Grid>
                </Grid>
            </Container>

            {/* CTA Section */}
            <div className="bg-primary-main py-24 text-center text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-main/20 rounded-full -ml-32 -mb-32 blur-3xl animate-pulse"></div>

                <Container maxWidth="md" className="relative z-10">
                    <Typography variant="h3" className="font-black mb-6">
                        Ready to Join the Feast?
                    </Typography>
                    <Typography variant="h6" className="mb-10 font-light opacity-90 mx-auto max-w-xl">
                        Whether you're here to eat or to serve, there's a place for you at Food Dhuniya. Limited tickets available.
                    </Typography>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button
                            variant="contained"
                            component={Link}
                            to="/tickets/book"
                            size="large"
                            className="bg-white text-primary-dark hover:bg-slate-100 font-black px-12 py-5 rounded-full shadow-2xl"
                        >
                            Book Tickets
                        </Button>
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/vendors"
                            size="large"
                            className="bg-secondary-main text-white border-none hover:bg-slate-900 font-black px-12 py-5 rounded-full shadow-2xl"
                        >
                            Explore Vendors
                        </Button>
                    </div>
                </Container>
            </div>
        </div>
    );
};

export default Home;
