import { useState, useEffect } from 'react';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';
import { FiSearch } from 'react-icons/fi';

const CarSelect = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const categories = ['All', 'Sports', 'Sedan', 'SUV', 'Coupe', 'Truck'];

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await getCars();
                setCars(res.data);
            } catch (error) {
                console.error('Error fetching cars:', error);
            }
            setLoading(false);
        };
        fetchCars();
    }, []);

    const filteredCars = cars.filter((car) => {
        const matchesFilter = filter === 'All' || car.category === filter;
        const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase()) ||
            car.brand.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-accent-cyan font-heading text-xs tracking-[0.3em] mb-3 uppercase">Choose Your Base</p>
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">
                        Select a Car Model
                    </h1>
                    <p className="text-gray-400 max-w-md mx-auto text-sm leading-relaxed">
                        Pick your dream car and start customizing it to perfection
                    </p>
                </div>

                {/* Search & Filters */}
                <div className="mb-8 space-y-4">
                    {/* Search bar */}
                    <div className="max-w-sm mx-auto">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="input-field pl-11 !py-2.5 text-sm"
                                placeholder="Search by name or brand..."
                                id="car-search"
                            />
                        </div>
                    </div>

                    {/* Category filter buttons — centered */}
                    <div className="flex justify-center gap-2 flex-wrap">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${filter === cat
                                        ? 'bg-accent-cyan text-dark-900 shadow-lg shadow-accent-cyan/20'
                                        : 'bg-white/[0.04] border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Car Grid */}
                {filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCars.map((car, index) => (
                            <div key={car._id} className="animate-slide-up" style={{ animationDelay: `${index * 0.08}s` }}>
                                <CarCard car={car} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24">
                        <p className="text-gray-500 text-lg">No cars found matching your criteria</p>
                        <button onClick={() => { setFilter('All'); setSearch(''); }} className="text-accent-cyan text-sm mt-3 hover:underline">
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarSelect;
