import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const navLinks = [];

    if (user?.role !== 'ADMIN') {
        navLinks.push(
            { name: 'Home', path: '/' },
            { name: 'About', path: '/about' },
            { name: 'Events', path: '/events' },
            { name: 'Zones', path: '/zones' },
            { name: 'Vendors', path: '/vendors' },
            { name: 'Sponsors', path: '/sponsors' },
            { name: 'Gallery', path: '/gallery' }
        );
    }

    if (user?.role === 'VISITOR') {
        navLinks.push({ name: 'My Tickets', path: '/tickets/my' });
    }

    if (user?.role === 'VENDOR') {
        navLinks.push({ name: 'Vendor Dashboard', path: '/vendor/dashboard' });
        navLinks.push({ name: 'Sponsor Registration', path: '/vendor/sponsor-registration' });
    }

    if (user?.role === 'SPONSOR') {
        navLinks.push({ name: 'Sponsor Dashboard', path: '/sponsor/dashboard' });
    }

    if (user?.role === 'ADMIN') {
        navLinks.push({ name: 'Dashboard', path: '/admin/dashboard' });
        navLinks.push({ name: 'Vendors', path: '/admin/vendors' });
        navLinks.push({ name: 'Tickets', path: '/admin/tickets' });
        navLinks.push({ name: 'Scan Tickets', path: '/admin/ticket-scanner' });
        navLinks.push({ name: 'Sponsors', path: '/admin/sponsors' });
        navLinks.push({ name: 'Gallery', path: '/admin/gallery' });
        navLinks.push({ name: 'Content', path: '/admin/content-manager' });
        navLinks.push({ name: 'Schedule', path: '/admin/schedule' });
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <img src="/logo.png" alt="Food Dhuniya" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
                            <span className="ml-2 text-2xl font-black text-secondary-main tracking-tighter hidden sm:block">
                                FOOD<span className="text-primary-main">DHUNIYA</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-gray-600 hover:text-primary-main transition-colors px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center text-gray-700">
                                    <UserIcon className="h-5 w-5 mr-1" />
                                    <span className="text-sm font-medium">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                                >
                                    <LogOut className="h-5 w-5 mr-1" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to="/login"
                                    className="bg-primary-main hover:bg-primary-dark text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-primary-main focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-main"
                        >
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" />
                            ) : (
                                <Menu className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-main hover:bg-gray-50"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <div className="px-3 py-2 text-base font-medium text-gray-700 border-t border-gray-200 mt-2 pt-4">
                                    Signed in as {user?.name} ({user?.role})
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 mt-1"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="border-t border-gray-200 mt-2 pt-4 space-y-1">
                                <Link
                                    to="/login"
                                    className="block px-3 py-2 rounded-md text-base font-medium text-primary-main hover:bg-gray-50 pt-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
