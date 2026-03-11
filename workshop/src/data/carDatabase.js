// Comprehensive car database — includes cars on the platform + popular models not yet available
// Each entry: { name, brand, category, onPlatform }
// onPlatform cars will match against the actual API data for linking

const carDatabase = [
  // ── ON-PLATFORM CARS ──
  { name: 'Mustang GT', brand: 'Ford', category: 'Sports', onPlatform: true },
  { name: 'Civic Type R', brand: 'Honda', category: 'Sports', onPlatform: true },
  { name: 'Model S', brand: 'Tesla', category: 'Sedan', onPlatform: true },
  { name: 'Wrangler Rubicon', brand: 'Jeep', category: 'SUV', onPlatform: true },
  { name: '911 Carrera', brand: 'Porsche', category: 'Coupe', onPlatform: true },

  // ── SPORTS / SUPERCARS ──
  { name: 'M3 Competition', brand: 'BMW', category: 'Sports', onPlatform: false },
  { name: 'M4 CSL', brand: 'BMW', category: 'Coupe', onPlatform: false },
  { name: 'RS6 Avant', brand: 'Audi', category: 'Wagon', onPlatform: false },
  { name: 'R8 V10', brand: 'Audi', category: 'Supercar', onPlatform: false },
  { name: 'Huracán EVO', brand: 'Lamborghini', category: 'Supercar', onPlatform: false },
  { name: 'Aventador SVJ', brand: 'Lamborghini', category: 'Supercar', onPlatform: false },
  { name: 'F8 Tributo', brand: 'Ferrari', category: 'Supercar', onPlatform: false },
  { name: '488 Pista', brand: 'Ferrari', category: 'Supercar', onPlatform: false },
  { name: 'SF90 Stradale', brand: 'Ferrari', category: 'Supercar', onPlatform: false },
  { name: '720S', brand: 'McLaren', category: 'Supercar', onPlatform: false },
  { name: 'P1', brand: 'McLaren', category: 'Hypercar', onPlatform: false },
  { name: 'Chiron', brand: 'Bugatti', category: 'Hypercar', onPlatform: false },
  { name: 'Veyron', brand: 'Bugatti', category: 'Hypercar', onPlatform: false },
  { name: 'AMG GT', brand: 'Mercedes-Benz', category: 'Sports', onPlatform: false },
  { name: 'C63 AMG', brand: 'Mercedes-Benz', category: 'Sports', onPlatform: false },
  { name: 'GT-R Nismo', brand: 'Nissan', category: 'Sports', onPlatform: false },
  { name: '370Z', brand: 'Nissan', category: 'Sports', onPlatform: false },
  { name: 'GR Supra', brand: 'Toyota', category: 'Sports', onPlatform: false },
  { name: 'GR86', brand: 'Toyota', category: 'Coupe', onPlatform: false },
  { name: 'WRX STI', brand: 'Subaru', category: 'Sports', onPlatform: false },
  { name: 'BRZ', brand: 'Subaru', category: 'Coupe', onPlatform: false },
  { name: 'Corvette Z06', brand: 'Chevrolet', category: 'Sports', onPlatform: false },
  { name: 'Camaro ZL1', brand: 'Chevrolet', category: 'Sports', onPlatform: false },
  { name: 'Challenger Hellcat', brand: 'Dodge', category: 'Sports', onPlatform: false },
  { name: 'Viper ACR', brand: 'Dodge', category: 'Sports', onPlatform: false },
  { name: 'RX-7 FD', brand: 'Mazda', category: 'Sports', onPlatform: false },
  { name: 'MX-5 Miata', brand: 'Mazda', category: 'Sports', onPlatform: false },
  { name: 'NSX Type S', brand: 'Acura', category: 'Supercar', onPlatform: false },
  { name: 'Emira', brand: 'Lotus', category: 'Sports', onPlatform: false },
  { name: 'Vantage', brand: 'Aston Martin', category: 'Sports', onPlatform: false },
  { name: 'DB11', brand: 'Aston Martin', category: 'Coupe', onPlatform: false },

  // ── SEDANS ──
  { name: 'Model 3', brand: 'Tesla', category: 'Sedan', onPlatform: false },
  { name: 'Charger', brand: 'Dodge', category: 'Sedan', onPlatform: false },
  { name: 'Accord', brand: 'Honda', category: 'Sedan', onPlatform: false },
  { name: 'Camry TRD', brand: 'Toyota', category: 'Sedan', onPlatform: false },
  { name: 'S-Class', brand: 'Mercedes-Benz', category: 'Sedan', onPlatform: false },
  { name: '7 Series', brand: 'BMW', category: 'Sedan', onPlatform: false },
  { name: 'A8', brand: 'Audi', category: 'Sedan', onPlatform: false },
  { name: 'Genesis G70', brand: 'Genesis', category: 'Sedan', onPlatform: false },
  { name: 'CT5-V Blackwing', brand: 'Cadillac', category: 'Sedan', onPlatform: false },

  // ── SUVs ──
  { name: 'Model X', brand: 'Tesla', category: 'SUV', onPlatform: false },
  { name: 'Model Y', brand: 'Tesla', category: 'SUV', onPlatform: false },
  { name: 'Urus', brand: 'Lamborghini', category: 'SUV', onPlatform: false },
  { name: 'Cayenne Turbo', brand: 'Porsche', category: 'SUV', onPlatform: false },
  { name: 'G-Wagon', brand: 'Mercedes-Benz', category: 'SUV', onPlatform: false },
  { name: 'Range Rover Sport', brand: 'Land Rover', category: 'SUV', onPlatform: false },
  { name: 'X5 M', brand: 'BMW', category: 'SUV', onPlatform: false },
  { name: 'RS Q8', brand: 'Audi', category: 'SUV', onPlatform: false },
  { name: 'Bronco Raptor', brand: 'Ford', category: 'SUV', onPlatform: false },
  { name: 'Grand Cherokee', brand: 'Jeep', category: 'SUV', onPlatform: false },
  { name: '4Runner TRD Pro', brand: 'Toyota', category: 'SUV', onPlatform: false },

  // ── TRUCKS ──
  { name: 'F-150 Raptor', brand: 'Ford', category: 'Truck', onPlatform: false },
  { name: 'Cybertruck', brand: 'Tesla', category: 'Truck', onPlatform: false },
  { name: 'RAM 1500 TRX', brand: 'Ram', category: 'Truck', onPlatform: false },
  { name: 'Silverado ZR2', brand: 'Chevrolet', category: 'Truck', onPlatform: false },
  { name: 'Tacoma TRD Pro', brand: 'Toyota', category: 'Truck', onPlatform: false },
  { name: 'Tundra TRD Pro', brand: 'Toyota', category: 'Truck', onPlatform: false },

  // ── ELECTRIC ──
  { name: 'Taycan Turbo S', brand: 'Porsche', category: 'Electric', onPlatform: false },
  { name: 'e-tron GT', brand: 'Audi', category: 'Electric', onPlatform: false },
  { name: 'iX M60', brand: 'BMW', category: 'Electric', onPlatform: false },
  { name: 'Roadster', brand: 'Tesla', category: 'Electric', onPlatform: false },
  { name: 'Air Grand Touring', brand: 'Lucid', category: 'Electric', onPlatform: false },
  { name: 'Ioniq 5 N', brand: 'Hyundai', category: 'Electric', onPlatform: false },
];

export default carDatabase;
