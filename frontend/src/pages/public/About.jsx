import { Container, Typography, Paper, Grid } from '@mui/material';

const About = () => {
    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <Container maxWidth="lg">
                <div className="text-center mb-16 flex flex-col items-center">
                    <Typography variant="overline" className="text-primary-main font-black tracking-widest text-center">
                        Our Story
                    </Typography>
                    <Typography variant="h3" className="font-black text-secondary-main mt-2 text-center">
                        About Food Dhuniya
                    </Typography>
                </div>
                
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Paper elevation={0} className="p-8 md:p-12 rounded-3xl border border-gray-100 bg-white text-center flex flex-col items-center">
                            <Typography variant="h5" className="font-bold text-primary-main mb-4 text-center">
                                About the Festival
                            </Typography>
                            <Typography variant="body1" className="text-gray-600 leading-relaxed text-lg text-center mx-auto max-w-4xl">
                                Food Dhuniya is a grand celebration of flavor, music, and community bringing together the best hidden gems of the city. We believe that food is a universal language that connects people from all walks of life. Our festival is a vibrant, large-scale event where you can explore diverse cuisines, meet passionate chefs, discover exclusive vendors, and enjoy world-class entertainment all in one place.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} className="p-8 md:p-12 rounded-3xl border border-gray-100 bg-white h-full text-center flex flex-col items-center">
                            <Typography variant="h5" className="font-bold text-primary-main mb-4 text-center">
                                Event Vision
                            </Typography>
                            <Typography variant="body1" className="text-gray-600 leading-relaxed text-lg text-center mx-auto">
                                Our vision is to promote culinary culture, support local vendors and artisans, and create a vibrant festival experience that resonates with people of all ages. We aim to provide a platform for budding chefs to showcase their skills, for established restaurants to connect with a wider audience, and for food lovers to experience a truly dynamic and unforgettable food community.
                            </Typography>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Paper elevation={0} className="p-8 md:p-12 rounded-3xl border border-gray-100 bg-white h-full text-center flex flex-col items-center">
                            <Typography variant="h5" className="font-bold text-primary-main mb-4 text-center">
                                Festival Concept
                            </Typography>
                            <Typography variant="body1" className="text-gray-600 leading-relaxed text-lg text-center mx-auto">
                                Experience a sensory mix of different cuisines, live cooking demonstrations, and interactive food workshops. The festival features diverse zones including exotic international cuisines, beloved local street food, vibrant food trucks, and a dedicated dessert section. Complementing the food, we offer live bands, cultural performances, and family-friendly activities to create a festive atmosphere.
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default About;
