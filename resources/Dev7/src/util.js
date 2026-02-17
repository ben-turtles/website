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

FROG_GAME.UTIL = {};

// Primitives

// Clamps num to be in range [min, max].
FROG_GAME.UTIL.clamp = function(num, min, max) {
    return Math.min(max, Math.max(min, num));
}

// Timers

// Runs handler every step, returning string to cancel with timerStop.
FROG_GAME.UTIL.onStep = function(handler) {
    let tickCount = 0;
    return PS.timerStart(1, () => {
        tickCount++;
        handler(tickCount);
    })
}

// Tweens over the duration (IN SECONDS), calling to handler each update with current alpha [0, 1].
// Calls onFinish if provided once done tweening.
FROG_GAME.UTIL.tweenMethod = function(duration, handler, onFinish) {
    const durationTicks = duration * 60;
    let stepTimer;
    stepTimer = FROG_GAME.UTIL.onStep((tickCount) => {
        const alpha = tickCount / durationTicks;
        if (alpha >= 1) {
            if (onFinish != null) {
                onFinish();
            }
            PS.timerStop(stepTimer);
        }
        else {
            handler(alpha);
        }
    })
}

// Runs the handler after the duration (IN SECONDS)
FROG_GAME.UTIL.delay = function(duration, handler) {
    let timer;
    timer = PS.timerStart(duration * 60, () => {
        PS.timerStop(timer);
        handler();
    });
}

// Interpolation

// interpolate(a, b, t)
FROG_GAME.UTIL.lerp = function(a, b, t) {
    return a + (t * (b - a));
}

// interpolate(color1, color2, t)
FROG_GAME.UTIL.lerpColor = function(color1, color2, t) {
    let [r1, g1, b1] = PS.unmakeRGB(color1, []);
    let [r2, g2, b2] = PS.unmakeRGB(color2, []);
    return PS.makeRGB(
        FROG_GAME.UTIL.lerp(r1, r2, t),
        FROG_GAME.UTIL.lerp(g1, g2, t),
        FROG_GAME.UTIL.lerp(b1, b2, t)
    );
}

// Pivots

// Returns if the [x, y] pivot is outside of the grid.
FROG_GAME.UTIL.isPivotOutOfBounds = function(pivot) {
    return pivot[0] < 0 || pivot[0] >= FROG_GAME.CONSTANTS.GRID_SIZE
        || pivot[1] < 0 || pivot[1] >= FROG_GAME.CONSTANTS.GRID_SIZE;
}

// Returns the closest [x, y] pivot to the out of bounds pivot. If pivot is in bounds, returns null.
FROG_GAME.UTIL.getInBoundsFromPivot = function(pivot) {
    if (!FROG_GAME.UTIL.isPivotOutOfBounds(pivot)) {
        // In bounds, null
        return null;
    }
    // Clamp x and y values
    return [
        FROG_GAME.UTIL.clamp(pivot[0], 0, FROG_GAME.CONSTANTS.GRID_SIZE - 1),
        FROG_GAME.UTIL.clamp(pivot[1], 0, FROG_GAME.CONSTANTS.GRID_SIZE - 1)
    ];
}

// Returns whether the two pivots are overlapping (same position).
FROG_GAME.UTIL.doPivotsOverlap = function(pivot1, pivot2) {
    return pivot1[0] == pivot2[0] && pivot1[1] == pivot2[1];
}

// Returns whether the two pivots are adjacent (orthogonally connected).
FROG_GAME.UTIL.arePivotsAdjacent = function(pivot1, pivot2) {
    const xDiff = Math.abs(pivot1[0] - pivot2[0]);
    const yDiff = Math.abs(pivot1[1] - pivot2[1]);
    return (xDiff + yDiff) <= 1;
}

// Returns [x, y] adding the offset [x, y] to the pivot
FROG_GAME.UTIL.addOffset = function(pivot, offset) {
    return [pivot[0] + offset[0], pivot[1] + offset[1]];
}

// Returns [x, y] getting the offset pivot2 - pivot1 between the two [x, y] pivots
FROG_GAME.UTIL.getOffset = function(pivot1, pivot2) {
    return [pivot2[0] - pivot1[0], pivot2[1] - pivot1[1]];
}

// Returns the pivot rotated around (0, 0) by the angle (IN RADIANS) by applying a 2D rotation matrix
FROG_GAME.UTIL.rotatePivot = function(pivot, angle) {
    return [
        // Make sure to round to avoid float rounding errors
        Math.round((pivot[0] * Math.cos(angle)) - (pivot[1] * Math.sin(angle))),
        Math.round((pivot[0] * Math.sin(angle)) + (pivot[1] * Math.cos(angle)))
    ];
}

// Fills border around region of the two points with size and color
FROG_GAME.UTIL.fillRegionBorder = function(start, end, size, color) {
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

// Shapes

// Fills shape at the pivot with a color
FROG_GAME.UTIL.fillShape = function(pivot, shape, color) {
    const [x, y] = pivot;

    // Color pivot and all offsets from pivot
    PS.color(x, y, color);
    shape.offsets.forEach(offset => {
        const offsetPivot = FROG_GAME.UTIL.addOffset(pivot, offset)
        if (!FROG_GAME.UTIL.isPivotOutOfBounds(offsetPivot)) {
            PS.color(offsetPivot[0], offsetPivot[1], color);
        }
    });
}

// Returns whether at the offset from the pivot, there is another cell given cells array [[x, y]].
FROG_GAME.UTIL.isCellAtOffsetFromPivot = function(pivot, offset, cells) {
    const pivotWithOffset = FROG_GAME.UTIL.addOffset(pivot, offset);
    return cells.some(otherCell => FROG_GAME.UTIL.doPivotsOverlap(otherCell, pivotWithOffset))
}

// Fills shape border at the pivot with size and color. If overlay shape + pivot provided,
// doesn't create a border where overlay shape is.
FROG_GAME.UTIL.fillShapeBorder = function(pivot, shape, size, color, overlayPivot, overlayShape) {
    const shapeCells = FROG_GAME.UTIL.getShapeCells(pivot, shape);
    const overlayCells = overlayPivot != null ? FROG_GAME.UTIL.getShapeCells(overlayPivot, overlayShape) : [];
    shapeCells.forEach(cell => {
        let borders = {};

        if (overlayCells.some(overlayCell => FROG_GAME.UTIL.doPivotsOverlap(overlayCell, cell))) {
            return;
        }

        // If no cell in directions, create a border there
        if (!FROG_GAME.UTIL.isCellAtOffsetFromPivot(cell, [-1, 0], shapeCells)) {
            borders.left = size;
        }
        if (!FROG_GAME.UTIL.isCellAtOffsetFromPivot(cell, [1, 0], shapeCells)) {
            borders.right = size;
        }
        if (!FROG_GAME.UTIL.isCellAtOffsetFromPivot(cell, [0, -1], shapeCells)) {
            borders.top = size;
        }
        if (!FROG_GAME.UTIL.isCellAtOffsetFromPivot(cell, [0, 1], shapeCells)) {
            borders.bottom = size;
        }
        
        // Set borde
        const [x, y] = cell;
        PS.border(x, y, borders);
        PS.borderColor(x, y, color);
    });
}

// Returns [[x, y]], where each is a [x, y] pair of a cell where the shape spans from the pivot.
FROG_GAME.UTIL.getShapeCells = function(pivot, shape) {
    let cells = [];

    // Find all cells
    cells.push(pivot);
    shape.offsets.forEach(offset => {
        cells.push(FROG_GAME.UTIL.addOffset(pivot, offset));
    })
    return cells;
}

// Returns the shape rotated the angle (IN RADIANS) around its pivot
FROG_GAME.UTIL.getRotatedShape = function(shape, angle) {
    let rotatedOffsets = [];
    shape.offsets.forEach(offset => {
        rotatedOffsets.push(FROG_GAME.UTIL.rotatePivot(offset, angle));
    });
    return {
        offsets: rotatedOffsets
    };
}

// Returns [isValid, blockingCells], where:
// - isValid: true if shape is in a valid position at the pivot, avoiding all walls and in bounds
// - blockingCells: [[x, y]] for all cells shape overlaps with. Cells can be out of bounds!
FROG_GAME.UTIL.getShapePivotValid = function(shape, pivot, walls) {
    const shapeCells = FROG_GAME.UTIL.getShapeCells(pivot, shape);
    let blockingCells = [];

    // Check out of bounds
    for (let i = 0; i < shapeCells.length; i++) {
        const shapeCell = shapeCells[i];
        if (FROG_GAME.UTIL.isPivotOutOfBounds(shapeCell)) {
            blockingCells.push(shapeCell);
        }
    }

    // Check walls
    let isValid = blockingCells.length == 0;
    if (walls != null) {
        for (let i = 0; i < shapeCells.length; i++) {
            const shapeCell = shapeCells[i];
            for (let j = 0; j < walls.length; j++) {
                const wallCell = walls[j];
                if (FROG_GAME.UTIL.doPivotsOverlap(shapeCell, wallCell)) {
                    // Overlapping a wall
                    isValid = false;
                    blockingCells.push(wallCell);
                }
            }
        }
    }
    return [isValid, blockingCells];
}

// Returns whether any of the cells within the two list of [[x, y]] are overlapping.
FROG_GAME.UTIL.doShapeCellsOverlap = function(shape1Cells, shape2Cells) {
    if (shape1Cells.length != shape2Cells.length) {
        // One of the shapes has more cells
        return false;
    }
    for (let i = 0; i < shape1Cells.length; i++) {
        const shape1Cell = shape1Cells[i];
        let noOverlap = true;
        for (let j = 0; j < shape2Cells.length; j++) {
            const shape2Cell = shape2Cells[j];
            if (FROG_GAME.UTIL.doPivotsOverlap(shape1Cell, shape2Cell)) {
                noOverlap = false;
            }
        }
        if (noOverlap) {
            // No cells overlap with this one, invalid
            return false;
        }
    }
    // Overlapping found
    return true;
}

// Returns whether the two shapes are overlapping at their respective pivots.
FROG_GAME.UTIL.doShapesOverlap = function(pivot1, shape1, pivot2, shape2) {
    const shape1Cells = FROG_GAME.UTIL.getShapeCells(pivot1, shape1);
    const shape2Cells = FROG_GAME.UTIL.getShapeCells(pivot2, shape2);
    return FROG_GAME.UTIL.doShapeCellsOverlap(shape1Cells, shape2Cells);
}

// Returns [[minX, minY], [maxX, maxY]] describing the minimum cell and maximum cell of all of the cells
FROG_GAME.UTIL.getCellsMinMax = function(cells) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    cells.forEach(cell => {
        const [x, y] = cell;
        if (x < minX) {
            minX = x;
        }
        if (x > maxX) {
            maxX = x;
        }
        if (y < minY) {
            minY = y;
        }
        if (y > maxY) {
            maxY = y;
        }
    });
    return [[minX, minY], [maxX, maxY]];
}

// Returns whether the two shapes are overlapping, if they were both aligned and crammed into the same top left corner.
FROG_GAME.UTIL.doShapesOverlapWhenAligned = function(shape1, shape2) {
    const pivot = [0, 0];
    let shape1Cells = FROG_GAME.UTIL.getShapeCells(pivot, shape1);
    let shape2Cells = FROG_GAME.UTIL.getShapeCells(pivot, shape2);
    let [shape1Min] = FROG_GAME.UTIL.getCellsMinMax(shape1Cells);
    shape1Cells = shape1Cells.map(cell => {
        return FROG_GAME.UTIL.addOffset(cell, [-shape1Min[0], -shape1Min[1]])
    });
    let [shape2Min] = FROG_GAME.UTIL.getCellsMinMax(shape2Cells);
    shape2Cells = shape2Cells.map(cell => {
        return FROG_GAME.UTIL.addOffset(cell, [-shape2Min[0], -shape2Min[1]])
    });
    return FROG_GAME.UTIL.doShapeCellsOverlap(shape1Cells, shape2Cells);
}

// Returns whether the first shape can ever overlap the second.
FROG_GAME.UTIL.canShapesOverlap = function(shape1, shape2) {
    return FROG_GAME.UTIL.doShapesOverlapWhenAligned(shape1, shape2) ||
        FROG_GAME.UTIL.doShapesOverlapWhenAligned(FROG_GAME.UTIL.getRotatedShape(shape1, Math.PI / 2), shape2) ||
        FROG_GAME.UTIL.doShapesOverlapWhenAligned(FROG_GAME.UTIL.getRotatedShape(shape1, Math.PI), shape2) ||
        FROG_GAME.UTIL.doShapesOverlapWhenAligned(FROG_GAME.UTIL.getRotatedShape(shape1, -Math.PI / 2), shape2);
}

// Actor

FROG_GAME.UTIL.ACTOR = {};

// Fills actor with the color
FROG_GAME.UTIL.ACTOR.fillActor = function(actor, color) {
    FROG_GAME.UTIL.fillShape(actor.pivot, actor.shape, color);
}

// Fills actor border with the size and color. If overlay actor provided,
// doesn't create a border where overlay actor is.
FROG_GAME.UTIL.ACTOR.fillActorBorder = function(actor, size, color, overlayActor) {
    FROG_GAME.UTIL.fillShapeBorder(
        actor.pivot, actor.shape, size, color,
        overlayActor != null ? overlayActor.pivot : null,
        overlayActor != null ? overlayActor.shape : null
    );
}

// Returns [x, y] stating where actor will be at when moving the offset [x, y]
FROG_GAME.UTIL.ACTOR.getOffsetMove = function(actor, offset) {
    return FROG_GAME.UTIL.addOffset(actor.pivot, offset);
}

// Returns [[x, y]], where each is a [x, y] pair of a cell where the actor spans.
FROG_GAME.UTIL.ACTOR.getActorCells = function(actor) {
    return FROG_GAME.UTIL.getShapeCells(actor.pivot, actor.shape);
}

// Returns [isValid, blockingCells], where:
// - isValid: true if actor is in a valid position, avoiding all walls and in bounds
// - blockingCells: [[x, y]] for all cells actor overlaps with.  Cells can be out of bounds!
FROG_GAME.UTIL.ACTOR.getActorPivotValid = function(actor, walls) {
    return FROG_GAME.UTIL.getShapePivotValid(actor.shape, actor.pivot, walls);
}

// Returns [rotatedActor, isValid, collisionCells], where:
// - rotatedActor: the actor rotated about the pivot by angle (IN RADIANS) avoiding walls [[x, y]]
// - isValid: true if the actor could rotate, else false
// - blockingCells: [[x, y]] for all wall cells the actor would collide with if it rotated. Cells can be out of bounds!
FROG_GAME.UTIL.ACTOR.getRotatedActor = function(actor, angle, walls) {
    // Get rotated actor shape, and information about if valid
    let newShape = FROG_GAME.UTIL.getRotatedShape(actor.shape, angle);
    const [isValid, blockingCells] = FROG_GAME.UTIL.getShapePivotValid(newShape, actor.pivot, walls);

    // Rotate actor
    let rotatedActor = {
        pivot: actor.pivot,
        shape: newShape
    };
    return [rotatedActor, isValid, blockingCells];
}

// Returns whether the two actors are overlapping.
FROG_GAME.UTIL.ACTOR.doActorsOverlap = function(actor1, actor2) {
    return FROG_GAME.UTIL.doShapesOverlap(actor1.pivot, actor1.shape, actor2.pivot, actor2.shape);
}