// Define the cost and performance modifiers for each part
// Positive performance values = better. For acceleration, negative means it drops the 0-60 time (which is faster).

export const modifiers = {
    paint: {
        '#808080': { cost: 0 },
        '#ff0000': { cost: 500 },
        '#00ff00': { cost: 500 },
        '#0000ff': { cost: 500 },
        '#ffffff': { cost: 200 },
        '#000000': { cost: 200 },
        '#ffff00': { cost: 800 }, // Custom premium colors
        '#ff00ff': { cost: 800 },
        '#00ffff': { cost: 800 },
    },
    wheels: {
        stock: { cost: 0, hp: 0, accel: 0, topSpeed: 0, name: 'Stock Alloys' },
        sport: { cost: 1200, hp: 0, accel: -0.1, topSpeed: 2, name: 'Sport Rims' },
        track: { cost: 2500, hp: 0, accel: -0.3, topSpeed: 5, name: 'Track Lightweight' },
        chrome: { cost: 3000, hp: 0, accel: 0.1, topSpeed: -2, name: 'Heavy Chrome' }, // Heavy, reduces perf slightly
        black: { cost: 1500, hp: 0, accel: -0.1, topSpeed: 2, name: 'Matte Black' },
    },
    spoiler: {
        none: { cost: 0, hp: 0, accel: 0, topSpeed: 0, name: 'No Spoiler' },
        lip: { cost: 300, hp: 0, accel: -0.05, topSpeed: -1, name: 'Lip Spoiler' },
        gt: { cost: 1200, hp: 0, accel: -0.1, topSpeed: -3, name: 'GT Wing' }, // More downforce = better accel but lower top speed
        carbon: { cost: 2000, hp: 0, accel: -0.15, topSpeed: -3, name: 'Carbon Fiber GT Wing' },
    },
    bodyKit: {
        stock: { cost: 0, hp: 0, accel: 0, topSpeed: 0, name: 'Stock Body' },
        street: { cost: 1500, hp: 0, accel: 0, topSpeed: -2, name: 'Street Kit' },
        widebody: { cost: 4500, hp: 0, accel: -0.1, topSpeed: -5, name: 'Widebody Kit' },
        carbon: { cost: 8000, hp: 0, accel: -0.2, topSpeed: -4, name: 'Full Carbon Kit' },
    }
};

export const calculateTotalCost = (basePrice, mods) => {
    let total = basePrice || 30000;
    
    // Add paint
    if (modifiers.paint[mods.paintColor]) total += modifiers.paint[mods.paintColor].cost;
    else total += 500; // Custom paint assumption

    // Add wheels
    if (modifiers.wheels[mods.wheels]) total += modifiers.wheels[mods.wheels].cost;

    // Add spoiler
    if (modifiers.spoiler[mods.spoiler]) total += modifiers.spoiler[mods.spoiler].cost;

    // Add bodyKit
    if (modifiers.bodyKit[mods.bodyKit]) total += modifiers.bodyKit[mods.bodyKit].cost;

    return total;
};

export const calculatePerformance = (baseHp = 300, baseAccel = 4.5, baseSpeed = 155, mods) => {
    let hp = baseHp;
    let accel = baseAccel;
    let topSpeed = baseSpeed;

    const parts = ['wheels', 'spoiler', 'bodyKit'];
    
    parts.forEach(part => {
        const mod = mods[part];
        if (modifiers[part] && modifiers[part][mod]) {
            hp += modifiers[part][mod].hp;
            accel += modifiers[part][mod].accel;
            topSpeed += modifiers[part][mod].topSpeed;
        }
    });

    return { 
        hp: Math.round(hp), 
        accel: Number(accel.toFixed(2)), 
        topSpeed: Math.round(topSpeed) 
    };
};
