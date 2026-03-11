import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars } from '../services/api';
import CarCard from '../components/CarCard';
import carDatabase from '../data/carDatabase';
import { FiSearch } from 'react-icons/fi';
import { IoCarSportOutline, IoChevronForward } from 'react-icons/io5';

const CarSelect = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All'); // Category
    const [brandFilter, setBrandFilter] = useState('All');
    const [yearFilter, setYearFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [highlightIndex, setHighlightIndex] = useState(-1);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

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

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchRef.current && !searchRef.current.contains(e.target) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Extract unique filter options from platform cars
    const uniqueBrands = ['All', ...new Set(cars.map(c => c.brand))].sort();
    // sort years descending
    const uniqueYears = ['All', ...new Set(cars.map(c => c.year))].sort((a, b) => {
        if (a === 'All') return -1;
        if (b === 'All') return 1;
        return b - a;
    });

    // Filter platform cars for the grid
    const filteredCars = cars.filter((car) => {
        const matchesFilter = filter === 'All' || car.category === filter;
        const matchesBrand = brandFilter === 'All' || car.brand === brandFilter;
        const matchesYear = yearFilter === 'All' || car.year.toString() === yearFilter.toString();
        const matchesSearch = car.name.toLowerCase().includes(search.toLowerCase()) ||
            car.brand.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesBrand && matchesYear && matchesSearch;
    });

    // Autocomplete: search the full car database
    const autocompleteSuggestions = search.trim().length >= 1
        ? carDatabase.filter((entry) => {
            const q = search.toLowerCase();
            return (
                entry.name.toLowerCase().includes(q) ||
                entry.brand.toLowerCase().includes(q) ||
                entry.category.toLowerCase().includes(q)
            );
        }).slice(0, 8) // max 8 suggestions
        : [];

    // Find platform car _id from API data for navigation
    const findPlatformCarId = (dbEntry) => {
        const match = cars.find(
            (c) => c.name === dbEntry.name && c.brand === dbEntry.brand
        );
        return match ? match._id : null;
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion.onPlatform) {
            const carId = findPlatformCarId(suggestion);
            if (carId) {
                navigate(`/customize/${carId}`);
            }
        }
        setSearch(`${suggestion.brand} ${suggestion.name}`);
        setShowDropdown(false);
    };

    const handleKeyDown = (e) => {
        if (!showDropdown || autocompleteSuggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev < autocompleteSuggestions.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightIndex((prev) =>
                prev > 0 ? prev - 1 : autocompleteSuggestions.length - 1
            );
        } else if (e.key === 'Enter' && highlightIndex >= 0) {
            e.preventDefault();
            handleSuggestionClick(autocompleteSuggestions[highlightIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

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
                    {/* Search bar with autocomplete */}
                    <div className="max-w-sm mx-auto relative" ref={searchRef}>
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setShowDropdown(true);
                                    setHighlightIndex(-1);
                                }}
                                onFocus={() => search.trim().length >= 1 && setShowDropdown(true)}
                                onKeyDown={handleKeyDown}
                                className="input-field pl-11 !py-2.5 text-sm"
                                placeholder="Search any car brand or model..."
                                id="car-search"
                                autoComplete="off"
                            />
                        </div>

                        {/* Autocomplete dropdown */}
                        {showDropdown && autocompleteSuggestions.length > 0 && (
                            <div
                                ref={dropdownRef}
                                className="autocomplete-dropdown"
                            >
                                <div className="autocomplete-header">
                                    <span>Search Results</span>
                                    <span className="autocomplete-count">{autocompleteSuggestions.length} found</span>
                                </div>
                                {autocompleteSuggestions.map((suggestion, index) => (
                                    <button
                                        key={`${suggestion.brand}-${suggestion.name}`}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className={`autocomplete-item ${highlightIndex === index ? 'autocomplete-item-active' : ''}`}
                                        onMouseEnter={() => setHighlightIndex(index)}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`autocomplete-icon ${suggestion.onPlatform ? 'autocomplete-icon-available' : 'autocomplete-icon-coming'}`}>
                                                <IoCarSportOutline size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-white font-medium truncate">{suggestion.name}</span>
                                                </div>
                                                <span className="text-[11px] text-gray-500">{suggestion.brand} · {suggestion.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            {suggestion.onPlatform ? (
                                                <span className="autocomplete-badge-available">
                                                    Customize <IoChevronForward size={10} />
                                                </span>
                                            ) : (
                                                <span className="autocomplete-badge-coming">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category filter buttons — centered */}
                    <div className="flex justify-center gap-2 flex-wrap mb-4">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${filter === cat
                                        ? 'bg-accent-cyan text-dark-900 shadow-lg shadow-accent-cyan/20'
                                        : 'bg-dark-800 border border-white/[0.08] text-gray-400 hover:text-white hover:bg-white/[0.08]'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Brand and Year Dropdown Filters */}
                    <div className="flex justify-center gap-4 flex-wrap">
                        <select 
                            value={brandFilter} 
                            onChange={(e) => setBrandFilter(e.target.value)}
                            className="bg-dark-900 border border-white/[0.08] text-gray-300 text-xs rounded-xl px-4 py-2.5 outline-none focus:border-accent-cyan cursor-pointer transition-colors"
                        >
                            {uniqueBrands.map(brand => (
                                <option key={brand} value={brand}>{brand === 'All' ? 'All Brands' : brand}</option>
                            ))}
                        </select>
                        <select 
                            value={yearFilter} 
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="bg-dark-900 border border-white/[0.08] text-gray-300 text-xs rounded-xl px-4 py-2.5 outline-none focus:border-accent-cyan cursor-pointer transition-colors"
                        >
                            {uniqueYears.map(year => (
                                <option key={year} value={year}>{year === 'All' ? 'All Years' : year}</option>
                            ))}
                        </select>
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
                        <button onClick={() => { setFilter('All'); setBrandFilter('All'); setYearFilter('All'); setSearch(''); }} className="text-accent-cyan text-sm mt-3 hover:underline">
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarSelect;
