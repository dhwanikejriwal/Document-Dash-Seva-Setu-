import { ThreeWorld } from './threeScene.js';
import { GameEngine } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('webgl-canvas-container');
  if (!container) {
    console.error('Canvas container not found');
    return;
  }

  // Initialize Three.js 3D World
  const threeWorld = new ThreeWorld(container);

  // Initialize Game Logic Engine
  const game = new GameEngine(threeWorld);

  // Expose on window for debugging if needed
  window.__SEVA_GAME__ = {
    threeWorld,
    game
  };

  console.log('Seva Setu Document Dash initialized successfully.');
});
