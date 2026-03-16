import { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card, CardContent, Typography, Alert, CircularProgress, Divider, Chip, Button } from '@mui/material';
import { Ticket as TicketIcon, User as UserIcon, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../../lib/api';

const TicketScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [scanStatus, setScanStatus] = useState(null); // 'VALID', 'USED', 'INVALID'
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [scannerActive, setScannerActive] = useState(true);

    useEffect(() => {
        if (!scannerActive) return;

        const scanner = new Html5QrcodeScanner("qr-reader", { 
            qrbox: { width: 250, height: 250 },
            fps: 5,
        });

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(result) {
            scanner.clear();
            setScannerActive(false);
            handleScan(result);
        }

        function onScanFailure(err) {
            // continuously fails when no QR code is in frame, ignore.
        }

        return () => {
            scanner.clear().catch(err => console.error("Failed to clear html5-qrcode scanner", err));
        };
    }, [scannerActive]);

    const handleScan = async (ticketId) => {
        setLoading(true);
        setError(null);
        setScanResult(null);
        setScanStatus(null);

        try {
            // The QR code contains the ticket ID directly
            const response = await api.get(`/tickets/validate/${ticketId}`);
            const ticket = response.data;
            
            // If it succeeds, the backend has marked it as used
            setScanResult(ticket);
            setScanStatus('VALID');
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            if (errorMsg.includes("Already Used")) {
                setScanStatus('USED');
            } else {
                setScanStatus('INVALID');
                setError(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setScanStatus(null);
        setError(null);
        setScannerActive(true);
    };

    return (
        <div className="py-12 bg-slate-50 min-h-[80vh] flex flex-col items-center px-4">
            <Typography variant="h3" component="h1" className="font-extrabold text-secondary-main mb-8 text-center">
                Admin Ticket Scanner
            </Typography>

            <Card className="w-full max-w-lg p-6 shadow-xl rounded-2xl border border-gray-100">
                {scannerActive ? (
                    <div className="flex flex-col items-center">
                        <Typography variant="body1" className="text-gray-500 mb-4 text-center">
                            Point the camera at the attendee's QR code ticket to validate their entry.
                        </Typography>
                        <div id="qr-reader" className="w-full max-w-sm rounded-xl overflow-hidden border-2 border-primary-main"></div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center w-full">
                        {loading ? (
                            <div className="flex flex-col items-center py-12">
                                <CircularProgress className="text-primary-main mb-4" />
                                <Typography>Validating Ticket...</Typography>
                            </div>
                        ) : (
                            <div className="w-full">
                                {/* Success - Valid */}
                                {scanStatus === 'VALID' && scanResult && (
                                    <Alert icon={<CheckCircle className="text-green-600 w-8 h-8" />} severity="success" className="mb-6 rounded-xl text-lg flex items-center bg-green-50 text-green-800 border-green-200">
                                        <div className="font-bold">Valid Ticket!</div>
                                        <div className="text-sm">Entry granted. Ticket has been marked as used.</div>
                                    </Alert>
                                )}

                                {/* Error - Already Used */}
                                {scanStatus === 'USED' && (
                                    <Alert icon={<AlertCircle className="text-orange-600 w-8 h-8" />} severity="warning" className="mb-6 rounded-xl text-lg flex items-center bg-orange-50 text-orange-800 border-orange-200">
                                        <div className="font-bold">Ticket Already Used!</div>
                                        <div className="text-sm">This ticket has already been scanned previously. Entry denied.</div>
                                    </Alert>
                                )}

                                {/* Error - Invalid / Not Found */}
                                {scanStatus === 'INVALID' && (
                                    <Alert icon={<XCircle className="text-red-600 w-8 h-8" />} severity="error" className="mb-6 rounded-xl text-lg flex items-center bg-red-50 text-red-800 border-red-200">
                                        <div className="font-bold">Invalid Ticket!</div>
                                        <div className="text-sm">{error || "This QR code does not match any valid tickets in the system."}</div>
                                    </Alert>
                                )}

                                {/* Display Ticket Details if it was found (even if used, wait we don't return the ticket from backend if it throws an error on used.) */}
                                {scanResult && (
                                    <CardContent className="bg-gray-50 rounded-xl border border-gray-200 p-6 mb-6">
                                        <Typography variant="h6" className="font-black text-gray-800 mb-4 pb-2 border-b">
                                            Ticket Details
                                        </Typography>
                                        
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Typography variant="body2" className="text-gray-500 font-medium">Ticket ID</Typography>
                                                <Typography variant="body1" className="font-bold font-mono">TKT-{scanResult.id}</Typography>
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <Typography variant="body2" className="text-gray-500 font-medium">Type</Typography>
                                                <Chip label={scanResult.ticketType} size="small" className="font-bold bg-primary-light text-primary-dark" />
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Typography variant="body2" className="text-gray-500 font-medium">Attendee</Typography>
                                                <div className="flex items-center">
                                                    <UserIcon className="w-4 h-4 mr-1 text-gray-400" />
                                                    <Typography variant="body1" className="font-semibold">{scanResult.name}</Typography>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <Typography variant="body2" className="text-gray-500 font-medium">Booked On</Typography>
                                                <div className="flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                    <Typography variant="body1" className="font-medium">
                                                        {scanResult.createdAt ? new Date(scanResult.createdAt).toLocaleDateString() : 'N/A'}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                )}

                                <Button 
                                    fullWidth 
                                    variant="contained" 
                                    color="primary"
                                    onClick={resetScanner}
                                    className="bg-primary-main hover:bg-primary-dark h-14 text-lg font-bold rounded-xl"
                                >
                                    Scan Another Ticket
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default TicketScanner;
