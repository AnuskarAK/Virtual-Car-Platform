import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
    return (
        <Link to={`/customize/${car._id}`} className="block group">
            <div className="bg-dark-800 border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-400 hover:border-accent-cyan/30 hover:shadow-lg hover:shadow-accent-cyan/5 hover:-translate-y-1">
                {/* Car image container */}
                <div className="relative h-52 flex items-center justify-center px-8 py-6 bg-gradient-to-b from-dark-700/60 to-dark-800">
                    <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        style={{ filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.4))' }}
                    />
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-accent-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                {/* Card info */}
                <div className="px-5 pb-5 pt-4">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-heading tracking-[0.2em] text-accent-cyan uppercase font-medium">{car.brand}</span>
                        <span className="text-[11px] text-gray-500 font-medium">{car.year}</span>
                    </div>
                    <h3 className="font-heading text-[15px] font-semibold text-white mb-3 leading-snug">{car.name}</h3>
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-500 bg-white/[0.04] border border-white/[0.06] px-3 py-1 rounded-full">{car.category}</span>
                        <span className="text-[11px] text-accent-cyan font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
                            Customize →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CarCard;
