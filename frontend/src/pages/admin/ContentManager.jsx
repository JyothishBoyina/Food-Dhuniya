import { useState, useEffect } from 'react';
import { 
    Container, Typography, Paper, TextField, Button, Grid, 
    CircularProgress, Alert, Box, Tab, Tabs, Divider
} from '@mui/material';
import { Save, Globe, Layout, Info, Image as ImageIcon } from 'lucide-react';
import api from '../../lib/api';

const AdminContentManager = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Initial state for sections
    const [content, setContent] = useState({
        hero: {
            title: 'Experience the Best Flavors of the City',
            subtitle: 'Join us for a three-day celebration of food, culture, and music.',
            bannerUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1'
        },
        about: {
            heading: 'About Food Dhuniya',
            description: 'Food Dhuniya is more than just a food festival; it is a celebration of culinary heritage and innovation.',
            imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'
        },
        contact: {
            address: 'Main Exhibition Ground, City Center',
            email: 'info@fooddhuniya.com',
            phone: '+91 98765 43210'
        }
    });

    const sections = [
        { id: 'hero', name: 'Hero Section', icon: <Layout className="w-4 h-4 mr-2" /> },
        { id: 'about', name: 'About Section', icon: <Info className="w-4 h-4 mr-2" /> },
        { id: 'contact', name: 'Contact Info', icon: <Globe className="w-4 h-4 mr-2" /> },
    ];

    useEffect(() => {
        const fetchAllContent = async () => {
            try {
                setLoading(true);
                const results = await Promise.all(
                    sections.map(s => api.get(`/content/${s.id}`))
                );
                
                const newContent = { ...content };
                results.forEach((res, index) => {
                    const sectionId = sections[index].id;
                    if (res.data && res.data.length > 0) {
                        res.data.forEach(item => {
                            newContent[sectionId][item.contentKey] = item.contentValue;
                        });
                    }
                });
                setContent(newContent);
            } catch (err) {
                console.error('Failed to load content', err);
                // We keep defaults if it fails
            } finally {
                setLoading(false);
            }
        };

        fetchAllContent();
    }, []);

    const handleChange = (section, key, value) => {
        setContent(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSave = async (sectionId) => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');
            
            const payload = Object.entries(content[sectionId]).map(([key, value]) => ({
                pageSection: sectionId,
                contentKey: key,
                contentValue: value
            }));

            await api.post('/content/bulk-update', payload);
            setSuccess(`Updated ${sectionId} successfully!`);
        } catch (err) {
            setError('Failed to update content');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><CircularProgress /></div>;

    const currentSection = sections[activeTab].id;

    return (
        <Container maxWidth="lg" className="py-12">
            <Typography variant="h4" className="font-bold text-secondary-main mb-8">
                Website Content Management
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={3}>
                    <Paper className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <Tabs
                            orientation="vertical"
                            value={activeTab}
                            onChange={(e, v) => setActiveTab(v)}
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                            className="bg-gray-50"
                        >
                            {sections.map((s, i) => (
                                <Tab 
                                    key={s.id} 
                                    label={<div className="flex items-center w-full px-2">{s.icon} {s.name}</div>} 
                                    className="items-start text-left min-h-[60px]"
                                />
                            ))}
                        </Tabs>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Paper className="p-8 rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <Typography variant="h5" className="font-bold">
                                {sections[activeTab].name}
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<Save className="w-4 h-4" />}
                                onClick={() => handleSave(currentSection)}
                                disabled={saving}
                                className="bg-primary-main hover:bg-primary-dark"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>

                        {error && <Alert severity="error" className="mb-6">{error}</Alert>}
                        {success && <Alert severity="success" className="mb-6">{success}</Alert>}

                        <div className="space-y-6">
                            {Object.entries(content[currentSection]).map(([key, value]) => (
                                <Box key={key} className="space-y-2">
                                    <div className="flex justify-between">
                                        <Typography variant="body2" className="font-bold text-gray-500 uppercase tracking-wider text-[10px]">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </Typography>
                                        {key.toLowerCase().includes('url') && (
                                            <Typography variant="caption" className="text-primary-main flex items-center cursor-pointer hover:underline" onClick={() => window.open(value, '_blank')}>
                                                Preview <ImageIcon className="w-3 h-3 ml-1" />
                                            </Typography>
                                        )}
                                    </div>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        multiline={value.length > 100}
                                        rows={value.length > 100 ? 3 : 1}
                                        value={value}
                                        onChange={(e) => handleChange(currentSection, key, e.target.value)}
                                        className="bg-gray-50"
                                    />
                                </Box>
                            ))}
                        </div>

                        <Divider className="my-8" />

                        <Box className="bg-slate-50 p-6 rounded-xl">
                            <Typography variant="subtitle2" className="font-bold mb-4 text-gray-700 flex items-center">
                                <Layout className="w-4 h-4 mr-2" /> Live Preview (Draft)
                            </Typography>
                            {currentSection === 'hero' && (
                                <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-white">
                                    <Typography variant="h6" className="font-bold text-center mb-2">{content.hero.title}</Typography>
                                    <Typography variant="body2" className="text-center text-gray-500 mb-4">{content.hero.subtitle}</Typography>
                                    <div className="h-40 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={content.hero.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            )}
                            {currentSection === 'about' && (
                                <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-white flex space-x-4">
                                    <div className="w-1/3 h-32 bg-gray-100 rounded-lg overflow-hidden">
                                        <img src={content.about.imageUrl} alt="About" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-2/3">
                                        <Typography variant="h6" className="font-bold mb-2">{content.about.heading}</Typography>
                                        <Typography variant="caption" className="text-gray-500 line-clamp-4">{content.about.description}</Typography>
                                    </div>
                                </div>
                            )}
                            {currentSection === 'contact' && (
                                <div className="border border-dashed border-gray-300 rounded-lg p-6 bg-white space-y-2 text-sm">
                                    <div className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary-main" /> {content.contact.address}</div>
                                    <div className="flex items-center"><Mail className="w-4 h-4 mr-2 text-primary-main" /> {content.contact.email}</div>
                                    <div className="flex items-center"><Phone className="w-4 h-4 mr-2 text-primary-main" /> {content.contact.phone}</div>
                                </div>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

// Mock icons for preview
const MapPin = ({ className }) => <span className={className}>📍</span>;
const Mail = ({ className }) => <span className={className}>✉️</span>;
const Phone = ({ className }) => <span className={className}>📞</span>;

export default AdminContentManager;
