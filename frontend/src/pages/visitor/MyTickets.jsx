import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Alert, Container, Chip, Divider, Button } from '@mui/material';
import { Mail, Calendar, Phone, User as UserIcon, Ticket as TicketIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import QRCodeStyling from 'qr-code-styling';

// Reusable component to handle the styled QR code generation
const TicketQRCode = ({ ticket }) => {
    const qrRef = useRef(null);

    useEffect(() => {
        // Data to encode in the QR code
        const qrData = JSON.stringify({
            ticketId: ticket.id,
            event: "Food Dhuniya 2026",
            user: ticket.name || "N/A",
            type: ticket.ticketType,
            qty: ticket.quantity
        });

        // Initialize the stylish QR code
        const qrCode = new QRCodeStyling({
            width: 180,
            height: 180,
            data: qrData,
            dotsOptions: {
                color: "#1e293b",
                type: "rounded"
            },
            backgroundOptions: {
                color: "#ffffff",
            },
            cornersSquareOptions: {
                type: "extra-rounded"
            }
        });

        // Append to the DOM element
        if (qrRef.current) {
            qrRef.current.innerHTML = ""; // Clear existing before appending
            qrCode.append(qrRef.current);
        }
    }, [ticket]);

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div 
                ref={qrRef} 
                className="overflow-hidden rounded-xl shadow-inner border-4 border-white"
            />
        </div>
    );
};

const MyTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                if (user && user.id) {
                    const response = await api.get(`/tickets/user/${user.id}`);
                    // Handle both Page<TicketResponse> (response.data.content) and List<TicketResponse> (response.data)
                    const fetchedData = response.data?.content || response.data || [];
                    setTickets(fetchedData);
                }
            } catch (err) {
                setError('Failed to fetch your tickets. ' + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <CircularProgress className="text-primary-main" />
            </div>
        );
    }

    return (
        <Container maxWidth="lg" className="py-12 min-h-[70vh]">
            <Typography variant="h3" component="h1" className="font-extrabold text-secondary-main mb-8">
                My Tickets
            </Typography>

            {error && <Alert severity="error" className="mb-6">{error}</Alert>}

            {tickets.length === 0 && !error ? (
                <div className="flex justify-center mt-12">
                    <Card className="max-w-md w-full p-8 text-center shadow-xl rounded-2xl border border-gray-100">
                        <div className="flex justify-center mb-4">
                            <div className="bg-orange-100 p-4 rounded-full">
                                <TicketIcon className="w-12 h-12 text-primary-main" />
                            </div>
                        </div>
                        <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                            You have no tickets yet.
                        </Typography>
                        <Typography variant="body1" className="text-gray-500 mb-8">
                            Secure your spot at Food Dhuniya 2026 and experience the ultimate food festival!
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            onClick={() => navigate('/tickets/book')}
                            className="bg-primary-main hover:bg-primary-dark font-bold px-8 py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
                        >
                            Book tickets
                        </Button>
                    </Card>
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <Grid container spacing={4} className="mb-12 w-full">
                        {tickets.map((ticket) => (
                            <Grid item xs={12} lg={8} key={ticket.id} className="mx-auto">
                                <Card className="hover:shadow-2xl transition-shadow duration-300 rounded-3xl border-0 flex flex-col sm:flex-row overflow-hidden bg-white shadow-xl relative">
                                    
                                    {/* Left Pane - Main Stub with QR */}
                                    <div className="bg-[#fcd34d] p-8 flex flex-col items-center justify-center sm:w-1/3 min-h-[250px] relative z-10">
                                        
                                        <TicketQRCode ticket={ticket} />
                                        
                                        <Typography variant="caption" className="font-mono text-black font-bold tracking-widest uppercase mt-4 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                            ID: {ticket.qrCode?.substring(0, 10) || `TKT-${ticket.id}A`}
                                        </Typography>
                                        <Chip
                                            label={ticket.paymentStatus || "COMPLETED"}
                                            size="small"
                                            className="mt-3 bg-black text-white font-bold text-[10px] uppercase tracking-wider"
                                        />
                                    </div>

                                    {/* Right Pane - Ticket Details */}
                                    <CardContent className="p-8 sm:w-2/3 flex flex-col w-full relative">
                                        {/* Perforated Edge line mapping (Visual Desktop separation) */}
                                        <div className="hidden sm:block absolute left-0 top-6 bottom-6 w-0 border-l-2 border-dashed border-gray-200" />
                                        
                                        <div className="flex flex-col mb-6">
                                            <Typography variant="h4" component="h2" className="font-black text-secondary-main tracking-tight">
                                                Food Dhuniya 2026
                                            </Typography>
                                            <div className="flex items-center gap-3 mt-3">
                                                <Chip
                                                    label={`${ticket.ticketType} Entry`}
                                                    className={`${ticket.ticketType === 'VIP' ? 'bg-indigo-600 text-white' : 'bg-primary-main text-white'} font-bold rounded-lg uppercase tracking-wider`}
                                                />
                                                <div className="bg-gray-100 px-3 py-1 rounded-lg font-bold text-gray-700">
                                                    Qty: {ticket.quantity}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-xl p-5 space-y-3 mb-6 border border-slate-100">
                                            <div className="flex items-center text-gray-700">
                                                <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                                                <Typography variant="body1" className="font-medium">
                                                    {ticket.name || 'N/A'}
                                                </Typography>
                                            </div>
                                            <div className="flex items-center text-gray-700">
                                                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                                                <Typography variant="body1" className="truncate">
                                                    {ticket.email || 'N/A'}
                                                </Typography>
                                            </div>
                                            {ticket.phone && (
                                                <div className="flex items-center text-gray-700">
                                                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                                                    <Typography variant="body1">
                                                        {ticket.phone}
                                                    </Typography>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-end mt-auto pt-4 border-t border-dashed border-gray-200">
                                            <div className="flex flex-col">
                                                <Typography variant="caption" className="text-gray-400 uppercase tracking-widest font-bold mb-1">
                                                    Booked On
                                                </Typography>
                                                <div className="flex items-center text-gray-700 font-medium">
                                                    <Calendar className="w-4 h-4 mr-2 text-primary-main" />
                                                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Typography variant="caption" className="text-gray-400 uppercase tracking-widest font-bold mb-1 block">
                                                    Total Paid
                                                </Typography>
                                                <Typography variant="h5" className="font-black text-green-600">
                                                    ₹{ticket.totalAmount?.toLocaleString('en-IN')}
                                                </Typography>
                                            </div>
                                        </div>
                                    </CardContent>

                                    {/* Ticket Cutout Circles (Top & Bottom) for aesthetics */}
                                    <div className="hidden sm:block absolute -top-4 left-[33.33%] w-8 h-8 rounded-full bg-slate-50 transform -translate-x-1/2 z-20 shadow-inner" />
                                    <div className="hidden sm:block absolute -bottom-4 left-[33.33%] w-8 h-8 rounded-full bg-slate-50 transform -translate-x-1/2 z-20 shadow-inner" />

                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={() => navigate('/tickets/book')}
                        className="bg-primary-main hover:bg-primary-dark font-bold px-10 py-3 rounded-xl shadow-lg transition-transform hover:scale-105"
                    >
                        Book Another Ticket
                    </Button>
                </div>
            )}
        </Container>
    );
};

export default MyTickets;
