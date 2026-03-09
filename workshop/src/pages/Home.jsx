import { Link } from 'react-router-dom';
import { IoCarSportOutline, IoSpeedometerOutline, IoColorPaletteOutline, IoSaveOutline, IoEyeOutline, IoFlashOutline } from 'react-icons/io5';

const Home = () => {
    const features = [
        { icon: <IoCarSportOutline size={28} />, title: 'Choose Your Ride', desc: 'Browse a curated collection of iconic car models from top brands' },
        { icon: <IoColorPaletteOutline size={28} />, title: 'Customize Everything', desc: 'Paint colors, wheels, spoilers, body kits — make it truly yours' },
        { icon: <IoEyeOutline size={28} />, title: 'Real-Time Preview', desc: 'See your modifications come to life instantly as you design' },
        { icon: <IoSaveOutline size={28} />, title: 'Save Your Builds', desc: 'Keep your favorite designs and come back to refine them anytime' },
        { icon: <IoSpeedometerOutline size={28} />, title: 'Compare Designs', desc: 'View your modified car side by side with the original stock version' },
        { icon: <IoFlashOutline size={28} />, title: 'Zero Risk', desc: 'Experiment freely without spending a dime on real parts' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-cyan/3 rounded-full blur-3xl"></div>
                </div>

                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                ></div>

                <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                    <div className="animate-slide-up">
                        <p className="text-accent-cyan font-heading text-sm tracking-[0.3em] mb-6 uppercase">
                            Virtual Car Modification Platform
                        </p>
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-heading font-black leading-tight mb-6">
                            <span className="text-white">BUILD YOUR</span>
                            <br />
                            <span className="gradient-text">DREAM RIDE</span>
                        </h1>
                        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                            Customize, visualize, and perfect your dream car modification
                            before spending a single dollar. Your garage, unlimited possibilities.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/cars" className="btn-primary text-base px-8 py-4">
                                Start Customizing
                            </Link>
                            <Link to="/register" className="btn-secondary text-base px-8 py-4">
                                Create Account
                            </Link>
                        </div>
                    </div>

                    {/* Floating car illustration */}
                    <div className="mt-16 animate-float">
                        <div className="relative mx-auto max-w-lg">
                            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 blur-3xl rounded-full"></div>
                            <img
                                src="/cars/mustang.png"
                                alt="Car Preview"
                                className="relative w-full drop-shadow-2xl"
                                style={{ filter: 'drop-shadow(0 0 30px rgba(0, 180, 216, 0.3))' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
                        <div className="w-1.5 h-3 bg-accent-cyan rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-dark-800 relative">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 animate-slide-up">
                        <p className="text-accent-cyan font-heading text-xs tracking-[0.3em] mb-3 uppercase">Features</p>
                        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            A complete toolkit for designing your perfect car modification
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="glass rounded-2xl p-6 card-hover"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-cyan mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-heading text-sm font-semibold text-white mb-2 tracking-wide">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">
                        Ready to Build?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                        Join thousands of car enthusiasts who are already designing
                        their dream rides on ModShift.
                    </p>
                    <Link to="/cars" className="btn-primary text-base px-10 py-4">
                        Explore Cars
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
