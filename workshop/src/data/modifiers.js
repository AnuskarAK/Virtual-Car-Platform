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
        'stock': { cost: 0, hp: 0, accel: 0, topSpeed: 0, handling: 0, name: 'Stock Alloys' },
        'sport-alloy': { cost: 1200, hp: 0, accel: -0.1, topSpeed: 2, handling: 5, name: 'Sport Alloy' },
        'racing-mesh': { cost: 2500, hp: 0, accel: -0.3, topSpeed: 5, handling: 15, name: 'Racing Mesh' },
        'chrome-classic': { cost: 3000, hp: 0, accel: 0.1, topSpeed: -2, handling: -5, name: 'Chrome Classic' },
        'matte-black': { cost: 1500, hp: 0, accel: -0.1, topSpeed: 2, handling: 5, name: 'Matte Black' },
    },
    spoiler: {
        'none': { cost: 0, hp: 0, accel: 0, topSpeed: 0, handling: 0, name: 'None' },
        'lip': { cost: 300, hp: 0, accel: -0.05, topSpeed: -1, handling: 2, name: 'Lip Spoiler' },
        'gt-wing': { cost: 1200, hp: 0, accel: -0.1, topSpeed: -3, handling: 10, name: 'GT Wing' },
        'ducktail': { cost: 800, hp: 0, accel: -0.08, topSpeed: -2, handling: 8, name: 'Ducktail' },
    },
    bodyKit: {
        'stock': { cost: 0, hp: 0, accel: 0, topSpeed: 0, handling: 0, name: 'Stock' },
        'widebody': { cost: 4500, hp: 0, accel: -0.1, topSpeed: -5, handling: 15, name: 'Widebody' },
        'aero': { cost: 3000, hp: 0, accel: -0.15, topSpeed: -3, handling: 12, name: 'Aero Kit' },
        'offroad': { cost: 2500, hp: -10, accel: 0.5, topSpeed: -15, handling: -10, name: 'Off-Road Kit' },
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

export const calculatePerformance = (baseHp = 300, baseAccel = 4.5, baseSpeed = 155, baseHandling = 50, mods) => {
    let hp = baseHp;
    let accel = baseAccel;
    let topSpeed = baseSpeed;
    let handling = baseHandling;

    const parts = ['wheels', 'spoiler', 'bodyKit'];
    
    parts.forEach(part => {
        const mod = mods[part];
        if (modifiers[part] && modifiers[part][mod]) {
            hp += modifiers[part][mod].hp || 0;
            accel += modifiers[part][mod].accel || 0;
            topSpeed += modifiers[part][mod].topSpeed || 0;
            handling += modifiers[part][mod].handling || 0;
        }
    });

    return { 
        hp: Math.round(hp), 
        accel: Number(accel.toFixed(2)), 
        topSpeed: Math.round(topSpeed),
        handling: Math.round(handling)
    };
};
