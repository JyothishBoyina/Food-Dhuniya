import { Container, Typography, Grid, Paper, Box, Button, Tooltip, Zoom } from '@mui/material';
import { useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

const Zones = () => {
    const mapRef = useRef(null);
    const [activeZone, setActiveZone] = useState(null);

    const zones = [
        {
            id: 'hyd-special',
            title: 'Hyderabad Special Zone',
            description: 'Biryani, haleem, and local favourites.',
            color: '#f97316', // orange-500
            image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'street-food',
            title: 'Street Food Zone',
            description: 'Chaats, spicy snacks, and quick bites.',
            color: '#ef4444', // red-500
            image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'international',
            title: 'International Cuisine Zone',
            description: 'Global dishes from Italy, China, Mexico.',
            color: '#3b82f6', // blue-500
            image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'dessert',
            title: 'Dessert Zone',
            description: 'Sweets, pastries, and ice creams.',
            color: '#ec4899', // pink-500
            image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        },
        {
            id: 'food-truck',
            title: 'Food Truck Zone',
            description: 'Creative and quick meals on wheels.',
            color: '#8b5cf6', // violet-500
            image: 'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
        }
    ];

    const scrollToMapAndHighlight = (zoneId) => {
        setActiveZone(zoneId);
        if (mapRef.current) {
            mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleMapClick = (zoneId) => {
        setActiveZone(zoneId);
    };

    return (
        <div className="bg-slate-50 min-h-screen py-16">
            <Container maxWidth="lg">
                <div className="text-center mb-16 flex flex-col items-center">
                    <Typography variant="overline" className="text-primary-main font-black tracking-widest text-lg text-center">
                        Explore the Grounds
                    </Typography>
                    <Typography variant="h2" align="center" className="font-extrabold text-secondary-main mt-2 text-center">
                        Festival Zones
                    </Typography>
                </div>

                {/* Zone Cards */}
                <Grid container spacing={4} justifyContent="center" className="mb-24">
                    {zones.map((zone) => (
                        <Grid item xs={12} sm={6} md={4} key={zone.id} className="flex">
                            <Paper
                                elevation={2}
                                className="group w-full flex flex-col p-0 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 bg-white"
                                style={{
                                    border: `2px solid transparent`,
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = zone.color}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                            >
                                <div className="h-48 w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-black/20 z-10" />
                                    <img 
                                        src={zone.image} 
                                        alt={zone.title} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <div 
                                            className="w-3 h-3 rounded-full shadow-lg" 
                                            style={{ backgroundColor: zone.color }} 
                                        />
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow text-center items-center justify-center">
                                    <div className="text-center">
                                        <Typography variant="h5" className="font-bold text-gray-800 mb-2 text-center">
                                            {zone.title}
                                        </Typography>
                                        <Typography variant="body1" className="text-gray-600 mb-6 text-center">
                                            {zone.description}
                                        </Typography>
                                    </div>
                                    <Button 
                                        variant="text" 
                                        className="font-bold rounded-xl mt-auto mx-auto"
                                        style={{ color: zone.color }}
                                        endIcon={<MapPin size={18} />}
                                        onClick={() => scrollToMapAndHighlight(zone.id)}
                                    >
                                        View on map
                                    </Button>
                                </div>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Venue Map Section */}
                <div ref={mapRef} className="pt-8">
                    <div className="text-center mb-10 flex flex-col items-center">
                        <Typography variant="h3" className="font-extrabold text-secondary-main text-center">
                            Venue Map
                        </Typography>
                        <Typography variant="subtitle1" className="text-gray-500 mt-2 text-center">
                            Event Layout – NTR Grounds, Hyderabad
                        </Typography>
                    </div>

                    <Paper elevation={3} className="p-4 md:p-8 rounded-3xl bg-white border border-gray-100 mb-10">
                        <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center p-4">
                            
                            {/* Entrance */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-12 bg-gray-800 text-white flex items-center justify-center font-bold text-sm tracking-widest rounded-t-xl z-20 shadow-lg border-b-4 border-yellow-500">
                                ENTRANCE
                            </div>

                            {/* Main Stage */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-16 bg-gray-800 text-white flex items-center justify-center font-bold text-lg rounded-b-xl z-20 shadow-lg border-t-4 border-yellow-500">
                                MAIN STAGE
                            </div>

                            {/* Dining Area */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border-4 border-dashed border-gray-400 bg-gray-200/50 flex items-center justify-center">
                                <Typography variant="overline" className="text-gray-500 font-bold tracking-widest text-center leading-tight">
                                    Community<br/>Dining
                                </Typography>
                            </div>

                            {/* Zones Container */}
                            <div className="absolute inset-0 p-8 pt-24 pb-20 pointer-events-none">
                                <div className="w-full h-full relative pointer-events-auto">
                                    
                                    {/* Hyderabad Special Zone - Top Left */}
                                    <Tooltip TransitionComponent={Zoom} title={<><Typography variant="subtitle2" className="font-bold">Hyderabad Special Zone</Typography><Typography variant="body2">Biryani & Local Cuisine</Typography></>} placement="top">
                                        <div 
                                            onClick={() => handleMapClick('hyd-special')}
                                            className={`absolute top-0 left-0 w-[30%] h-[35%] rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center shadow-md p-2 hover:scale-105
                                                ${activeZone === 'hyd-special' ? 'border-4 ring-4 ring-orange-500/30 scale-105 z-30 shadow-2xl' : 'border-2'}
                                            `}
                                            style={{ 
                                                backgroundColor: activeZone === 'hyd-special' || !activeZone ? '#f97316' : '#fdba74',
                                                borderColor: '#c2410c',
                                                opacity: !activeZone || activeZone === 'hyd-special' ? 1 : 0.4
                                            }}
                                        >
                                            <Typography variant="button" className="text-white font-bold text-center leading-tight drop-shadow-md">
                                                HYD<br/>SPECIAL
                                            </Typography>
                                        </div>
                                    </Tooltip>

                                    {/* Street Food - Middle Left */}
                                    <Tooltip TransitionComponent={Zoom} title={<><Typography variant="subtitle2" className="font-bold">Street Food Zone</Typography><Typography variant="body2">Chaats & Snacks</Typography></>} placement="right">
                                        <div 
                                            onClick={() => handleMapClick('street-food')}
                                            className={`absolute top-[45%] left-0 w-[25%] h-[40%] rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center shadow-md p-2 hover:scale-105
                                                ${activeZone === 'street-food' ? 'border-4 ring-4 ring-red-500/30 scale-105 z-30 shadow-2xl' : 'border-2'}
                                            `}
                                            style={{ 
                                                backgroundColor: activeZone === 'street-food' || !activeZone ? '#ef4444' : '#fca5a5',
                                                borderColor: '#b91c1c',
                                                opacity: !activeZone || activeZone === 'street-food' ? 1 : 0.4
                                            }}
                                        >
                                            <Typography variant="button" className="text-white font-bold text-center leading-tight drop-shadow-md">
                                                STREET<br/>FOOD
                                            </Typography>
                                        </div>
                                    </Tooltip>

                                    {/* Food Truck Lane - Bottom Right Corner */}
                                    <Tooltip TransitionComponent={Zoom} title={<><Typography variant="subtitle2" className="font-bold">Food Truck Zone</Typography><Typography variant="body2">Meals on Wheels</Typography></>} placement="top">
                                        <div 
                                            onClick={() => handleMapClick('food-truck')}
                                            className={`absolute bottom-0 right-0 w-[40%] h-[20%] rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center shadow-md hover:scale-105
                                                ${activeZone === 'food-truck' ? 'border-4 ring-4 ring-violet-500/30 scale-105 z-30 shadow-2xl' : 'border-2'}
                                            `}
                                            style={{ 
                                                backgroundColor: activeZone === 'food-truck' || !activeZone ? '#8b5cf6' : '#c4b5fd',
                                                borderColor: '#6d28d9',
                                                opacity: !activeZone || activeZone === 'food-truck' ? 1 : 0.4
                                            }}
                                        >
                                            <Typography variant="button" className="text-white font-bold tracking-widest drop-shadow-md">
                                                FOOD TRUCK LANE
                                            </Typography>
                                        </div>
                                    </Tooltip>

                                    {/* International - Top Right */}
                                    <Tooltip TransitionComponent={Zoom} title={<><Typography variant="subtitle2" className="font-bold">International Cuisine Zone</Typography><Typography variant="body2">Global Flavors</Typography></>} placement="left">
                                        <div 
                                            onClick={() => handleMapClick('international')}
                                            className={`absolute top-0 right-0 w-[30%] h-[40%] rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center shadow-md p-2 hover:scale-105
                                                ${activeZone === 'international' ? 'border-4 ring-4 ring-blue-500/30 scale-105 z-30 shadow-2xl' : 'border-2'}
                                            `}
                                            style={{ 
                                                backgroundColor: activeZone === 'international' || !activeZone ? '#3b82f6' : '#93c5fd',
                                                borderColor: '#1d4ed8',
                                                opacity: !activeZone || activeZone === 'international' ? 1 : 0.4
                                            }}
                                        >
                                            <Typography variant="button" className="text-white font-bold text-center leading-tight drop-shadow-md">
                                                INTERNATIONAL<br/>CUISINE
                                            </Typography>
                                        </div>
                                    </Tooltip>

                                    {/* Dessert - Middle Right */}
                                    <Tooltip TransitionComponent={Zoom} title={<><Typography variant="subtitle2" className="font-bold">Dessert Zone</Typography><Typography variant="body2">Sweets & Treats</Typography></>} placement="left">
                                        <div 
                                            onClick={() => handleMapClick('dessert')}
                                            className={`absolute top-[45%] right-0 w-[25%] h-[30%] rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center shadow-md p-2 hover:scale-105
                                                ${activeZone === 'dessert' ? 'border-4 ring-4 ring-pink-500/30 scale-105 z-30 shadow-2xl' : 'border-2'}
                                            `}
                                            style={{ 
                                                backgroundColor: activeZone === 'dessert' || !activeZone ? '#ec4899' : '#f9a8d4',
                                                borderColor: '#be185d',
                                                opacity: !activeZone || activeZone === 'dessert' ? 1 : 0.4
                                            }}
                                        >
                                            <Typography variant="button" className="text-white font-bold text-center leading-tight drop-shadow-md">
                                                DESSERT<br/>ZONE
                                            </Typography>
                                        </div>
                                    </Tooltip>

                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="mt-8 flex flex-wrap justify-center gap-6">
                            {[
                                { label: 'Entrance & Ticketing', color: 'bg-gray-800' },
                                { label: 'Main Stage', color: 'bg-gray-800' },
                                { label: 'Dining Area', color: 'bg-gray-200 border-2 border-gray-400 border-dashed' },
                                { label: 'Food Zones', color: 'bg-blue-200' },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-sm ${item.color}`} />
                                    <Typography variant="caption" className="font-bold text-gray-600">
                                        {item.label}
                                    </Typography>
                                </div>
                            ))}
                            {activeZone && (
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    className="ml-auto rounded-full"
                                    onClick={() => setActiveZone(null)}
                                >
                                    Reset Map
                                </Button>
                            )}
                        </div>
                    </Paper>
                </div>
            </Container>
        </div>
    );
};

export default Zones;
