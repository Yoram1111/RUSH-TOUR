/**
 * RUSH HOUR — ESCAPE PROTOCOL
 * Logique de jeu principale
 * ─────────────────────────────────────────────
 * Architecture :
 *  - LEVELS       : définition des niveaux
 *  - GameState    : état courant
 *  - Rendering    : rendu DOM
 *  - Input        : souris, tactile, clavier
 *  - Victory      : détection + animation
 *  - Confetti     : effet de victoire
 *  - Init         : démarrage
 */

'use strict';

/* ═══════════════════════════════════════════════
   DÉFINITION DES NIVEAUX
   Chaque voiture : { id, row, col, len, dir:'H'|'V', color, label? }
   La voiture rouge (id:'red') est toujours en rangée 2 (0-indexed) dir H
   ═══════════════════════════════════════════════ */
const LEVELS = [

    /* ── Niveau 1 : Initiation ── */
    {
        name: "Initiation",
        difficulty: "EASY",
        hint: "Déplacez la voiture verte vers le bas, puis la bleue vers la droite.",
        cars: [
            { id:'red',    row:2, col:0, len:2, dir:'H', color:'red'    },
            { id:'b1',     row:0, col:2, len:2, dir:'V', color:'blue'   },
            { id:'b2',     row:1, col:3, len:2, dir:'H', color:'teal'   },
            { id:'b3',     row:3, col:1, len:2, dir:'H', color:'green'  },
            { id:'b4',     row:0, col:4, len:3, dir:'V', color:'orange' },
            { id:'b5',     row:4, col:3, len:2, dir:'V', color:'purple' },
            { id:'b6',     row:2, col:4, len:2, dir:'H', color:'pink'   },
        ]
    },

    /* ── Niveau 2 : Embouteillage ── */
    {
        name: "Embouteillage",
        difficulty: "MEDIUM",
        hint: "Libérez la rangée 2 en déplaçant les véhicules verticaux qui bloquent.",
        cars: [
            { id:'red',    row:2, col:0, len:2, dir:'H', color:'red'    },
            { id:'c1',     row:0, col:2, len:3, dir:'V', color:'indigo' },
            { id:'c2',     row:0, col:3, len:2, dir:'V', color:'blue'   },
            { id:'c3',     row:2, col:3, len:2, dir:'H', color:'teal'   },
            { id:'c4',     row:0, col:5, len:2, dir:'V', color:'lime'   },
            { id:'c5',     row:2, col:5, len:2, dir:'V', color:'orange' },
            { id:'c6',     row:3, col:1, len:3, dir:'H', color:'green'  },
            { id:'c7',     row:4, col:4, len:2, dir:'H', color:'purple' },
            { id:'c8',     row:1, col:0, len:2, dir:'H', color:'yellow' },
            { id:'c9',     row:4, col:0, len:2, dir:'V', color:'pink'   },
        ]
    },

    /* ── Niveau 3 : Labyrinthe ── */
    {
        name: "Labyrinthe",
        difficulty: "HARD",
        hint: "Chaîne de libérations : déplacez d'abord les camions verticaux à droite.",
        cars: [
            { id:'red',    row:2, col:0, len:2, dir:'H', color:'red'    },
            { id:'d1',     row:0, col:0, len:2, dir:'V', color:'blue'   },
            { id:'d2',     row:0, col:1, len:3, dir:'V', color:'orange' },
            { id:'d3',     row:0, col:2, len:2, dir:'H', color:'teal'   },
            { id:'d4',     row:1, col:2, len:2, dir:'V', color:'purple' },
            { id:'d5',     row:0, col:4, len:2, dir:'V', color:'lime'   },
            { id:'d6',     row:2, col:3, len:2, dir:'H', color:'yellow' },
            { id:'d7',     row:2, col:5, len:3, dir:'V', color:'indigo' },
            { id:'d8',     row:3, col:0, len:3, dir:'H', color:'pink'   },
            { id:'d9',     row:4, col:3, len:2, dir:'V', color:'green'  },
            { id:'d10',    row:5, col:0, len:2, dir:'H', color:'blue'   },
            { id:'d11',    row:5, col:4, len:2, dir:'H', color:'orange' },
            { id:'d12',    row:3, col:3, len:2, dir:'H', color:'teal'   },
        ]
    },

    /* ── Niveau 4 : L'Expert ── */
    {
        name: "L'Expert",
        difficulty: "EXPERT",
        hint: "Il faut d'abord dégager la colonne 4 en chaîne. Pensez vertical !",
        cars: [
            { id:'red',    row:2, col:1, len:2, dir:'H', color:'red'    },
            { id:'e1',     row:0, col:0, len:3, dir:'V', color:'indigo' },
            { id:'e2',     row:0, col:1, len:2, dir:'H', color:'lime'   },
            { id:'e3',     row:0, col:3, len:3, dir:'V', color:'orange' },
            { id:'e4',     row:0, col:4, len:2, dir:'H', color:'teal'   },
            { id:'e5',     row:1, col:5, len:2, dir:'V', color:'purple' },
            { id:'e6',     row:2, col:3, len:2, dir:'H', color:'blue'   },
            { id:'e7',     row:3, col:0, len:2, dir:'V', color:'pink'   },
            { id:'e8',     row:3, col:1, len:2, dir:'H', color:'yellow' },
            { id:'e9',     row:3, col:4, len:3, dir:'V', color:'green'  },
            { id:'e10',    row:4, col:1, len:3, dir:'H', color:'orange' },
            { id:'e11',    row:5, col:0, len:2, dir:'H', color:'blue'   },
            { id:'e12',    row:5, col:3, len:3, dir:'H', color:'indigo' },
        ]
    },

    /* ── Niveau 5 : Chaos Total ── */
    {
        name: "Chaos Total",
        difficulty: "INSANE",
        hint: "Patience... Il faut libérer toute la rangée centrale par étapes successives.",
        cars: [
            { id:'red',    row:2, col:0, len:2, dir:'H', color:'red'    },
            { id:'f1',     row:0, col:0, len:2, dir:'H', color:'teal'   },
            { id:'f2',     row:0, col:2, len:2, dir:'V', color:'blue'   },
            { id:'f3',     row:0, col:3, len:2, dir:'H', color:'lime'   },
            { id:'f4',     row:0, col:5, len:3, dir:'V', color:'orange' },
            { id:'f5',     row:1, col:1, len:2, dir:'H', color:'purple' },
            { id:'f6',     row:1, col:4, len:2, dir:'V', color:'pink'   },
            { id:'f7',     row:2, col:2, len:2, dir:'V', color:'indigo' },
            { id:'f8',     row:2, col:3, len:2, dir:'H', color:'yellow' },
            { id:'f9',     row:3, col:0, len:2, dir:'V', color:'green'  },
            { id:'f10',    row:3, col:2, len:3, dir:'H', color:'blue'   },
            { id:'f11',    row:4, col:1, len:2, dir:'H', color:'orange' },
            { id:'f12',    row:4, col:4, len:2, dir:'V', color:'teal'   },
            { id:'f13',    row:5, col:0, len:3, dir:'H', color:'purple' },
            { id:'f14',    row:5, col:4, len:2, dir:'H', color:'lime'   },
        ]
    },

];

/* Constantes */
const GRID_SIZE  = 6;
const CELL_PX    = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size')) || 70;
const GAP_PX     = () => parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap'))       || 5;
const BOARD_PAD  = 12; // padding inside .game-board

/* Meilleurs scores (localStorage) */
const BEST_KEY   = 'rushHour_best';

/* ═══════════════════════════════════════════════
   ÉTAT DU JEU
   ═══════════════════════════════════════════════ */
const state = {
    levelIndex:   0,
    cars:         [],     // copies mutables des voitures
    moves:        0,
    bests:        {},
    selected:     null,   // voiture sélectionnée au clavier
    dragging:     null,   // { carId, startPointer, startCarPos }
};

/* ═══════════════════════════════════════════════
   UTILITAIRES
   ═══════════════════════════════════════════════ */

/** Cloner profondément les voitures d'un niveau */
function cloneCars(levelCars) {
    return levelCars.map(c => ({ ...c }));
}

/** Calculer la position px (top/left) d'une cellule */
function cellPos(index) {
    return BOARD_PAD + index * (CELL_PX() + GAP_PX());
}

/** Trouver une voiture par id */
function carById(id) {
    return state.cars.find(c => c.id === id);
}

/** Construire la grille logique (quelles cellules sont occupées) */
function buildGrid() {
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    for (const car of state.cars) {
        for (let i = 0; i < car.len; i++) {
            const r = car.dir === 'V' ? car.row + i : car.row;
            const c = car.dir === 'H' ? car.col + i : car.col;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
                grid[r][c] = car.id;
            }
        }
    }
    return grid;
}

/** Déplacer une voiture d'un delta (en cellules), retourne true si possible */
function moveCar(id, delta) {
    const car  = carById(id);
    if (!car || delta === 0) return false;

    const grid = buildGrid();
    const step = delta > 0 ? 1 : -1;
    let steps  = Math.abs(delta);

    let newPos = (car.dir === 'H') ? car.col : car.row;

    for (let s = 0; s < steps; s++) {
        const next = newPos + step;
        // Vérifier les limites
        const endNext = next + (car.dir === 'H' ? car.len - 1 : car.len - 1);
        if (next < 0 || endNext >= GRID_SIZE) break;

        // Vérifier collision
        const checkR = (car.dir === 'H') ? car.row : (step > 0 ? car.row + car.len - 1 + 1 : car.row - 1);
        const checkC = (car.dir === 'V') ? car.col : (step > 0 ? car.col + car.len - 1 + 1 : car.col - 1);

        let blocked = false;
        if (car.dir === 'H') {
            const col = (step > 0) ? newPos + car.len : newPos - 1;
            if (col < 0 || col >= GRID_SIZE) break;
            if (grid[car.row][col] && grid[car.row][col] !== id) blocked = true;
        } else {
            const row = (step > 0) ? newPos + car.len : newPos - 1;
            if (row < 0 || row >= GRID_SIZE) break;
            if (grid[row][car.col] && grid[row][car.col] !== id) blocked = true;
        }
        if (blocked) break;

        // Mettre à jour la grille temporaire
        // Libérer l'ancienne queue/tête
        if (car.dir === 'H') {
            grid[car.row][step > 0 ? newPos : newPos + car.len - 1] = null;
            grid[car.row][step > 0 ? newPos + car.len : newPos - 1] = id;
        } else {
            grid[step > 0 ? newPos : newPos + car.len - 1][car.col] = null;
            grid[step > 0 ? newPos + car.len : newPos - 1][car.col] = id;
        }

        newPos += step;
    }

    const moved = newPos !== (car.dir === 'H' ? car.col : car.row);
    if (moved) {
        if (car.dir === 'H') car.col = newPos;
        else                  car.row = newPos;
        state.moves++;
        updateMovesDisplay();
        return true;
    }
    return false;
}

/** Combien de cases max peut bouger une voiture dans un sens ? */
function maxMove(id, dir) {
    const car  = carById(id);
    const grid = buildGrid();
    let count  = 0;
    let pos    = (car.dir === 'H') ? car.col : car.row;
    const step = (dir === 'right' || dir === 'down') ? 1 : -1;

    while (true) {
        const next = pos + step;
        if (step > 0) {
            const tail = next + car.len - 1;
            if (tail >= GRID_SIZE) break;
            const checkR = (car.dir === 'H') ? car.row : pos + car.len;
            const checkC = (car.dir === 'V') ? car.col : pos + car.len;
            const r = car.dir === 'H' ? car.row : pos + car.len;
            const c = car.dir === 'V' ? car.col : pos + car.len;
            const nxtR = car.dir === 'H' ? car.row : next + car.len - 1;
            const nxtC = car.dir === 'V' ? car.col : next + car.len - 1;
            const blocked = car.dir === 'H'
                ? (grid[car.row][pos + car.len] && grid[car.row][pos + car.len] !== id)
                : (grid[pos + car.len] && grid[pos + car.len][car.col] && grid[pos + car.len][car.col] !== id);
            if (blocked) break;
        } else {
            if (next < 0) break;
            const blocked = car.dir === 'H'
                ? (grid[car.row][pos - 1] && grid[car.row][pos - 1] !== id)
                : (grid[pos - 1] && grid[pos - 1][car.col] && grid[pos - 1][car.col] !== id);
            if (blocked) break;
        }
        pos += step;
        count++;
    }
    return count;
}

/* ═══════════════════════════════════════════════
   RENDU
   ═══════════════════════════════════════════════ */

const boardEl    = document.getElementById('gameBoard');
const movesEl    = document.getElementById('movesDisplay');
const levelEl    = document.getElementById('levelDisplay');
const bestEl     = document.getElementById('bestDisplay');
const levelList  = document.getElementById('levelList');

/** Construire les cellules vides */
function buildCells() {
    boardEl.querySelectorAll('.cell').forEach(c => c.remove());
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        boardEl.appendChild(cell);
    }
}

/** Rendre toutes les voitures */
function renderCars() {
    boardEl.querySelectorAll('.car').forEach(c => c.remove());

    for (const car of state.cars) {
        const el = document.createElement('div');
        el.className = `car ${car.dir === 'H' ? 'horizontal' : 'vertical'}`;
        if (car.id === 'red') el.classList.add('target');
        el.dataset.id    = car.id;
        el.dataset.color = car.color;

        const cell = CELL_PX();
        const gap  = GAP_PX();

        const w = car.dir === 'H' ? car.len * cell + (car.len - 1) * gap : cell;
        const h = car.dir === 'V' ? car.len * cell + (car.len - 1) * gap : cell;

        el.style.width  = `${w}px`;
        el.style.height = `${h}px`;
        el.style.left   = `${cellPos(car.col)}px`;
        el.style.top    = `${cellPos(car.row)}px`;

        // Label
        const lbl = document.createElement('span');
        lbl.className = 'car-label';
        lbl.textContent = car.id === 'red' ? '★' : '';
        el.appendChild(lbl);

        boardEl.appendChild(el);
        attachCarEvents(el);
    }
}

/** Mettre à jour position px d'une voiture existante (sans re-créer) */
function updateCarPosition(id) {
    const car = carById(id);
    const el  = boardEl.querySelector(`.car[data-id="${id}"]`);
    if (!el || !car) return;
    el.style.left = `${cellPos(car.col)}px`;
    el.style.top  = `${cellPos(car.row)}px`;
}

function updateMovesDisplay() {
    movesEl.textContent = String(state.moves).padStart(2, '0');
}

function updateLevelDisplay() {
    levelEl.textContent = String(state.levelIndex + 1).padStart(2, '0');
    const best = state.bests[state.levelIndex];
    bestEl.textContent = best != null ? String(best).padStart(2, '0') : '--';
}

function renderLevelList() {
    levelList.innerHTML = '';
    LEVELS.forEach((lvl, i) => {
        const btn = document.createElement('button');
        btn.className = 'level-btn' + (i === state.levelIndex ? ' active' : '') + (state.bests[i] != null ? ' completed' : '');
        btn.innerHTML = `
      <span>${i + 1}. ${lvl.name}</span>
      <span class="level-badge">${state.bests[i] != null ? '✓ ' + state.bests[i] : lvl.difficulty}</span>
    `;
        btn.addEventListener('click', () => loadLevel(i));
        levelList.appendChild(btn);
    });
}

/* ═══════════════════════════════════════════════
   CHARGEMENT D'UN NIVEAU
   ═══════════════════════════════════════════════ */

function loadLevel(index) {
    state.levelIndex = index;
    state.cars       = cloneCars(LEVELS[index].cars);
    state.moves      = 0;
    state.selected   = null;

    // Masquer indice
    document.getElementById('tipCard').style.display = 'none';

    updateMovesDisplay();
    updateLevelDisplay();
    renderLevelList();
    buildCells();
    renderCars();

    // Mettre à jour texte de mission
    document.getElementById('missionText').textContent =
        `Niveau ${index + 1} — ${LEVELS[index].difficulty}. Guidez la voiture rouge (★) vers la sortie à droite.`;
}

/* ═══════════════════════════════════════════════
   DÉTECTION DE VICTOIRE
   ═══════════════════════════════════════════════ */

function checkVictory() {
    const red = carById('red');
    if (!red) return;
    // La voiture rouge est en rangée 2, direction H
    // Victoire si son extrémité droite touche ou dépasse col 5
    if (red.col + red.len - 1 >= GRID_SIZE - 1) {
        triggerVictory();
    }
}

function triggerVictory() {
    // Sauvegarder meilleur score
    const prev = state.bests[state.levelIndex];
    if (prev == null || state.moves < prev) {
        state.bests[state.levelIndex] = state.moves;
        saveBests();
    }

    // Calculer étoiles
    const moves = state.moves;
    const stars = moves <= 8 ? 3 : moves <= 15 ? 2 : 1;

    document.getElementById('victoryLevel').textContent = state.levelIndex + 1;
    document.getElementById('victoryMoves').textContent = moves;
    document.getElementById('victoryStars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);

    const overlay = document.getElementById('victoryOverlay');
    overlay.classList.add('show');

    // Configurer bouton suivant
    const btn = document.getElementById('btnNext');
    const hasNext = state.levelIndex < LEVELS.length - 1;
    btn.textContent = hasNext ? 'NIVEAU SUIVANT →' : 'REJOUER ↺';
    btn.onclick = () => {
        overlay.classList.remove('show');
        loadLevel(hasNext ? state.levelIndex + 1 : 0);
        renderLevelList();
    };

    // Confettis
    launchConfetti();
    renderLevelList();
}

/* ═══════════════════════════════════════════════
   ÉVÉNEMENTS DRAG & DROP
   ═══════════════════════════════════════════════ */

function attachCarEvents(el) {
    // Souris
    el.addEventListener('mousedown', onDragStart);
    // Tactile
    el.addEventListener('touchstart', onTouchStart, { passive: false });
}

let dragData = null;

function onDragStart(e) {
    e.preventDefault();
    const id  = e.currentTarget.dataset.id;
    const car = carById(id);
    startDrag(id, car, e.clientX, e.clientY);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup',  onDragEnd);
}

function onTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const id    = e.currentTarget.dataset.id;
    startDrag(id, carById(id), touch.clientX, touch.clientY);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend',  onTouchEnd);
}

function startDrag(id, car, clientX, clientY) {
    dragData = {
        id,
        startX:   clientX,
        startY:   clientY,
        startCol: car.col,
        startRow: car.row,
        moved:    false,
    };
    const el = boardEl.querySelector(`.car[data-id="${id}"]`);
    if (el) el.classList.add('dragging');
    selectCar(id);
}

function onDragMove(e) { handleDragMove(e.clientX, e.clientY); }
function onTouchMove(e) {
    e.preventDefault();
    const t = e.touches[0];
    handleDragMove(t.clientX, t.clientY);
}

function handleDragMove(clientX, clientY) {
    if (!dragData) return;
    const car  = carById(dragData.id);
    const cell = CELL_PX() + GAP_PX();
    const dx   = clientX - dragData.startX;
    const dy   = clientY - dragData.startY;

    let delta = 0;
    if (car.dir === 'H') delta = Math.round(dx / cell);
    else                  delta = Math.round(dy / cell);

    if (delta === 0) return;

    // Revenir à la position de départ et recalculer
    if (car.dir === 'H') car.col = dragData.startCol;
    else                  car.row = dragData.startRow;

    const oldMoves = state.moves;
    // Simuler le déplacement case par case
    const prevPos = car.dir === 'H' ? car.col : car.row;

    // Déplacer dans la direction demandée (moveCar gère les collisions)
    // On recalcule depuis la position originale
    if (car.dir === 'H') car.col = dragData.startCol;
    else                  car.row = dragData.startRow;

    // Rebuilder la grille sans cette voiture pour tester
    const available = calcAvailable(dragData.id, delta > 0 ? 1 : -1);
    const clampedDelta = delta > 0 ? Math.min(delta, available.fwd) : -Math.min(-delta, available.bwd);

    if (car.dir === 'H') car.col = dragData.startCol + clampedDelta;
    else                  car.row = dragData.startRow + clampedDelta;

    state.moves = oldMoves; // on ne compte pas les mouvements intermédiaires du drag
    updateCarPosition(dragData.id);
    dragData.currentDelta = clampedDelta;
}

/** Calculer combien de cases disponibles dans chaque sens (sans compter les moves) */
function calcAvailable(id, _) {
    const car  = carById(id);
    // Construire une grille sans cette voiture
    const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
    for (const c of state.cars) {
        if (c.id === id) continue;
        for (let i = 0; i < c.len; i++) {
            const r = c.dir === 'V' ? c.row + i : c.row;
            const col = c.dir === 'H' ? c.col + i : c.col;
            grid[r][col] = c.id;
        }
    }

    // Position originale
    const origPos = car.dir === 'H' ? dragData.startCol : dragData.startRow;

    let fwd = 0;
    for (let p = origPos + 1; p + car.len - 1 < GRID_SIZE; p++) {
        const blocked = car.dir === 'H'
            ? grid[car.row][p + car.len - 1]
            : (grid[p + car.len - 1] && grid[p + car.len - 1][car.col]);
        if (blocked) break;
        fwd = p - origPos;
    }
    let bwd = 0;
    for (let p = origPos - 1; p >= 0; p--) {
        const blocked = car.dir === 'H'
            ? grid[car.row][p]
            : (grid[p] && grid[p][car.col]);
        if (blocked) break;
        bwd = origPos - p;
    }
    return { fwd, bwd };
}

function onDragEnd(e) {
    finishDrag();
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup',  onDragEnd);
}
function onTouchEnd(e) {
    finishDrag();
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend',  onTouchEnd);
}

function finishDrag() {
    if (!dragData) return;
    const car  = carById(dragData.id);
    const el   = boardEl.querySelector(`.car[data-id="${dragData.id}"]`);
    if (el) el.classList.remove('dragging');

    // Compter les cases effectivement parcourues comme 1 mouvement
    const delta = dragData.currentDelta || 0;
    if (delta !== 0) {
        state.moves++;
        updateMovesDisplay();
        updateCarPosition(dragData.id);
        checkVictory();
    } else {
        // Remettre à la position originale
        if (car.dir === 'H') car.col = dragData.startCol;
        else                  car.row = dragData.startRow;
        updateCarPosition(dragData.id);
    }

    dragData = null;
}

/* ═══════════════════════════════════════════════
   SÉLECTION CLAVIER
   ═══════════════════════════════════════════════ */

function selectCar(id) {
    // Désélectionner l'ancien
    if (state.selected) {
        const prev = boardEl.querySelector(`.car[data-id="${state.selected}"]`);
        if (prev) prev.style.outline = '';
    }
    state.selected = id;
    if (id) {
        const el = boardEl.querySelector(`.car[data-id="${id}"]`);
        if (el) el.style.outline = '2px solid rgba(255,255,255,0.6)';
    }
}

document.addEventListener('keydown', (e) => {
    const car = state.selected ? carById(state.selected) : null;
    if (!car) return;

    let delta = 0;
    switch (e.key) {
        case 'ArrowRight': if (car.dir === 'H') delta =  1; break;
        case 'ArrowLeft':  if (car.dir === 'H') delta = -1; break;
        case 'ArrowDown':  if (car.dir === 'V') delta =  1; break;
        case 'ArrowUp':    if (car.dir === 'V') delta = -1; break;
        case 'Tab':
            e.preventDefault();
            // Passer à la voiture suivante
            const ids = state.cars.map(c => c.id);
            const idx = ids.indexOf(state.selected);
            selectCar(ids[(idx + 1) % ids.length]);
            return;
        case 'Escape':
            selectCar(null);
            return;
        default: return;
    }

    e.preventDefault();
    if (delta !== 0) {
        const moved = moveCar(state.selected, delta);
        if (moved) {
            const el = boardEl.querySelector(`.car[data-id="${state.selected}"]`);
            if (el) {
                el.classList.add('moving');
                updateCarPosition(state.selected);
                checkVictory();
                setTimeout(() => el.classList.remove('moving'), 300);
            }
        } else {
            // Feedback visuel : mouvement invalide
            const el = boardEl.querySelector(`.car[data-id="${state.selected}"]`);
            if (el) {
                el.classList.add('invalid-move');
                setTimeout(() => el.classList.remove('invalid-move'), 350);
            }
        }
    }
});

/* Clic sur une voiture = sélectionner pour clavier */
boardEl.addEventListener('click', (e) => {
    const carEl = e.target.closest('.car');
    if (carEl) {
        selectCar(carEl.dataset.id);
    }
});

/* ═══════════════════════════════════════════════
   BOUTONS
   ═══════════════════════════════════════════════ */

document.getElementById('btnReset').addEventListener('click', () => {
    loadLevel(state.levelIndex);
});

document.getElementById('btnSkip').addEventListener('click', () => {
    const next = (state.levelIndex + 1) % LEVELS.length;
    loadLevel(next);
});

document.getElementById('btnHint').addEventListener('click', () => {
    const card = document.getElementById('tipCard');
    const text = document.getElementById('tipText');
    text.textContent = LEVELS[state.levelIndex].hint;
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

/* ═══════════════════════════════════════════════
   PERSISTANCE DES MEILLEURS SCORES
   ═══════════════════════════════════════════════ */

function loadBests() {
    try {
        const raw = localStorage.getItem(BEST_KEY);
        if (raw) state.bests = JSON.parse(raw);
    } catch(e) {}
}
function saveBests() {
    try { localStorage.setItem(BEST_KEY, JSON.stringify(state.bests)); } catch(e) {}
}

/* ═══════════════════════════════════════════════
   CONFETTIS
   ═══════════════════════════════════════════════ */

function launchConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx    = canvas.getContext('2d');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;

    const COLORS = ['#ff2d55','#00b4ff','#00ffea','#ffd60a','#30d158','#bf5fff','#ff9f0a','#ff4ec4'];
    const pieces = [];

    for (let i = 0; i < 140; i++) {
        pieces.push({
            x:    Math.random() * canvas.width,
            y:    Math.random() * -canvas.height,
            w:    6 + Math.random() * 10,
            h:    10 + Math.random() * 14,
            r:    Math.random() * Math.PI * 2,
            rv:   (Math.random() - 0.5) * 0.15,
            vx:   (Math.random() - 0.5) * 4,
            vy:   3 + Math.random() * 5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            alpha: 1,
        });
    }

    let frame;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = 0;
        for (const p of pieces) {
            p.x  += p.vx;
            p.y  += p.vy;
            p.r  += p.rv;
            p.vy += 0.08; // gravité
            if (p.y > canvas.height * 0.7) p.alpha -= 0.02;

            if (p.alpha > 0) {
                alive++;
                ctx.save();
                ctx.globalAlpha = Math.max(0, p.alpha);
                ctx.translate(p.x, p.y);
                ctx.rotate(p.r);
                ctx.fillStyle = p.color;
                ctx.shadowColor = p.color;
                ctx.shadowBlur  = 8;
                ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
                ctx.restore();
            }
        }
        if (alive > 0) {
            frame = requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    cancelAnimationFrame(frame);
    draw();
}

/* ═══════════════════════════════════════════════
   PARTICULES DE FOND
   ═══════════════════════════════════════════════ */

function spawnParticles() {
    const container = document.getElementById('bgParticles');
    const COLORS_P = ['#00b4ff','#00ffea','#ff2d55','#bf5fff','#ffd60a'];
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = 2 + Math.random() * 5;
        p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${COLORS_P[Math.floor(Math.random() * COLORS_P.length)]};
      --dur:${7 + Math.random() * 12}s;
      --delay:${Math.random() * 10}s;
      filter: blur(${Math.random() > 0.5 ? 1 : 0}px);
    `;
        container.appendChild(p);
    }
}

/* ═══════════════════════════════════════════════
   RECALCUL AU RESIZE (responsive cell size)
   ═══════════════════════════════════════════════ */
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        buildCells();
        renderCars();
    }, 150);
});

/* ═══════════════════════════════════════════════
   INITIALISATION
   ═══════════════════════════════════════════════ */
function init() {
    loadBests();
    spawnParticles();
    loadLevel(0);
}

init();