// util.js
// Utility functions for Perlenblocks game
// Ben Reinherz 2025

/*
TYPES:

Actor = {
    pivot: [x, y]
    shape: Shape
}
Shape = {
    offsets: [[x, y]]
}

*/

PB_GAME.UTIL = {};

// General util

// Fills border around region of the two points with size and color
PB_GAME.UTIL.fillRegionBorder = function(start, end, size, color) {
    const [x1, y1] = start;
    const [x2, y2] = end;

    // Top + bottom borders
    for (let x = x1; x < x2; x++) {
        PS.border(x, y1, {top: size});
        PS.border(x, y2 - 1, {bottom: size});
        PS.borderColor(x, y1, color);
        PS.borderColor(x, y2 - 1, color);
    }

    // Left + right borders
    for (let y = y1; y < y2; y++) {
        PS.border(x1, y, {left: size});
        PS.border(x2 - 1, y, {right: size});
        PS.borderColor(x1, y, color);
        PS.borderColor(x2 - 1, y, color);
    }
}

// Fills shape at the pivot with a color
PB_GAME.UTIL.fillShape = function(pivot, shape, color) {
    const [x, y] = pivot;

    // Color pivot and all offsets from pivot
    PS.color(x, y, color);
    shape.offsets.forEach(offset => {
        const [offsetX, offsetY] = offset;
        PS.color(x + offsetX, y + offsetY, color);
    });
}

// Fills shape border at the pivot with size and color
PB_GAME.UTIL.fillShapeBorder = function(pivot, shape, size, color) {
    PB_GAME.UTIL.fillShape(pivot, shape, color);
}

// Actor util

PB_GAME.UTIL.ACTOR = {};

// Fills actor with the color
PB_GAME.UTIL.ACTOR.fillActor = function(actor, color) {
    PB_GAME.UTIL.fillShape(actor.pivot, actor.shape, color);
}

// Fills actor border with the size and color
PB_GAME.UTIL.ACTOR.fillActorBorder = function(actor, size, color) {
    PB_GAME.UTIL.fillShapeBorder(actor.pivot, actor.shape, size, color);
}

// Get [x, y] pair actor will be at when moving the offset [x, y]
PB_GAME.UTIL.ACTOR.getOffsetMove = function(actor, offset) {
    return [actor.pivot[0] + offset[0], actor.pivot[1] + offset[1]];
}