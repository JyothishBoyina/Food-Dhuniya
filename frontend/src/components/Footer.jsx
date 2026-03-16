import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary-main text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center mb-4">
                            <img src="/logo.png" alt="Food Dhuniya" className="h-12 w-auto mr-3 brightness-0 invert" />
                            <span className="text-2xl font-bold text-primary-main">Food Dhuniya</span>
                        </div>
                        <p className="mt-4 text-gray-400 text-sm max-w-sm">
                            The ultimate food festival experience. Discover incredible vendors, enjoy live events, and taste the world.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Quick Links</h3>
                        <ul className="mt-4 space-y-2">
                            <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors text-sm">Events</Link></li>
                            <li><Link to="/vendors" className="text-gray-400 hover:text-white transition-colors text-sm">Vendors</Link></li>
                            <li><Link to="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">Gallery</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300">Legal</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                    <p>&copy; {currentYear} Food Dhuniya. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
