/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';

// --- PIXEL ART SPRITE DEFINITIONS ---
const SPRITE_SCALE = 4;
const SPRITE_SIZE = 16;

const SPRITES = {
  idle: [
    ".......krk......",
    "......krrrk.....",
    ".....kRrrRrk....",
    ".....kaaaaak....",
    "....kaaaaaaak...",
    "...kaakkkkkaak..",
    "...kakBkkkBkak..",
    "...kaakkkkkaak..",
    "....kaaaaaaak...",
    "...kkaaaaaaakk..",
    "..kaakaaaaakaak.",
    "..kaakaaaaakaak.",
    "..kaakaaaaakaak.",
    "...kkkaaaakkk...",
    "....kAAkkAAk....",
    "....kkk..kkk...."
  ],
  run1: [
    ".......krk......",
    "......krrrk.....",
    ".....kRrrRrk....",
    ".....kaaaaak....",
    "....kaaaaaaak...",
    "...kaakkkkkaak..",
    "...kakBkkkBkak..",
    "...kaakkkkkaak..",
    "....kaaaaaaak...",
    "...kkaaaaaaakk..",
    "..kaakaaaaakaak.",
    "...kkkaaaakkk...",
    ".....kaaaak.....",
    "....kAA..kAAk...",
    "....kkk...kkk...",
    "..........kkk..."
  ],
  run2: [
    ".......krk......",
    "......krrrk.....",
    ".....kRrrRrk....",
    ".....kaaaaak....",
    "....kaaaaaaak...",
    "...kaakkkkkaak..",
    "...kakBkkkBkak..",
    "...kaakkkkkaak..",
    "....kaaaaaaak...",
    "...kkaaaaaaakk..",
    "..kaakaaaaakaak.",
    "...kkkaaaakkk...",
    ".....kaaaak.....",
    "...kAAk..AAk....",
    "...kkk...kkk....",
    "...kkk.........."
  ],
  jump: [
    ".......krk......",
    "......krrrk.....",
    ".....kRrrRrk....",
    ".....kaaaaak....",
    "....kaaaaaaak...",
    "...kaakkkkkaak..",
    "...kakBkkkBkak..",
    "...kaakkkkkaak..",
    "....kaaaaaaak...",
    "...kkaaaaaaakk..",
    "..kaakaaaaakaak.",
    "..kaakaaaaakaak.",
    "...kkkaaaakkk...",
    "...kAAk..kAAk...",
    "...kkk....kkk...",
    "................"
  ],
  fall: [
    ".......krk......",
    "......krrrk.....",
    ".....kRrrRrk....",
    ".....kaaaaak....",
    "....kaaaaaaak...",
    "...kaakkkkkaak..",
    "...kakBkkkBkak..",
    "...kaakkkkkaak..",
    "....kaaaaaaak...",
    "...kkaaaaaaakk..",
    "..kaakaaaaakaak.",
    "..kaakaaaaakaak.",
    "...kkkaaaakkk...",
    ".....kAAkkAAk...",
    ".....kkk.kkk....",
    "................"
  ],
  dash: [
    "................",
    "........krk.....",
    ".......krrrk....",
    "......kRrrRrk...",
    "......kaaaaak...",
    ".....kaaaaaaak..",
    "....kaakkkkkaak.",
    "....kakBkkkBkak.",
    "....kaakkkkkaak.",
    ".....kaaaaaaak..",
    "....kkaaaaaaakk.",
    "..kkaakaaaaakaak",
    ".kAAkaakaaaaakaa",
    ".kkk.kkkaaaakkk.",
    ".......kAAkkAAk.",
    ".......kkk..kkk."
  ],
  wallSlide: [
    ".......krk......",
    "......krrrk.....",
    ".....kRrrRrk....",
    ".....kaaaaak....",
    "....kaaaaaaak...",
    "...kaaaaaaaaak..",
    "...kaaaaaaaaak..",
    "...kaaaaaaaaak..",
    "....kaaaaaaak...",
    "...kkaaaaaaakk..",
    "..kaakaaaaakaak.",
    "..kaakaaaaakaak.",
    "...kkkaaaakkk...",
    "....kAAkkAAk....",
    "....kkk..kkk....",
    "................"
  ],
  bgWall: [
    "1111111111111111",
    "1222222122222221",
    "1222222122222221",
    "1222222122222221",
    "1111111111111111",
    "2221222222212222",
    "2221222222212222",
    "2221222222212222",
    "1111111111111111",
    "1222222122222221",
    "1222222122222221",
    "1222222122222221",
    "1111111111111111",
    "2221222222212222",
    "2221222222212222",
    "2221222222212222",
  ],
  bgPillar: [
    "2342222223222432",
    "2342232222222432",
    "2342222222222432",
    "2342222422222432",
    "2342222222222432",
    "2342222222322432",
    "2342222222222432",
    "2342223222222432",
    "2342222222222432",
    "2342222224222432",
    "2342222222222432",
    "2342232222222432",
    "2342222222222432",
    "2342222222322432",
    "2342222222222432",
    "2342222422222432",
  ],
  groundTop: [
    "GGGGGGGGGGGGGGGG",
    "GgGgGgGgGgGgGgGg",
    "gggggggggggggggg",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA"
  ],
  groundBottom: [
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA"
  ],
  carrot: [
    ".......G........",
    "......GgG.......",
    ".......g........",
    "......OOO.......",
    ".....OOOOO......",
    ".....OOOOO......",
    "......OOO.......",
    ".......O........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  key: [
    "................",
    "....YYYY........",
    "...Y....Y.......",
    "...Y....Y.......",
    "....YYYY........",
    "......Y.........",
    "......YY........",
    "......Y.........",
    "......YY........",
    "......Y.........",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  gold: [
    "................",
    "................",
    "................",
    "......YYYY......",
    ".....YYYYYY.....",
    "....YYYYYYYY....",
    "....YYYYYYYY....",
    ".....YYYYYY.....",
    "......YYYY......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  gem: [
    "................",
    "................",
    ".......BB.......",
    "......BBBB......",
    ".....BBBBBB.....",
    "....BBBBBBBB....",
    ".....BBBBBB.....",
    "......BBBB......",
    ".......BB.......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  potion: [
    "................",
    ".......ww.......",
    ".......PP.......",
    "......PPPP......",
    ".....PPPPPP.....",
    "....PPPPPPPP....",
    "....PPPPPPPP....",
    "....PPPPPPPP....",
    ".....PPPPPP.....",
    "......PPPP......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  scroll: [
    "................",
    "......wwww......",
    ".....wllllw.....",
    "....wllllllw....",
    "....wlddddlw....",
    "....wllllllw....",
    "....wlddddlw....",
    "....wllllllw....",
    ".....wllllw.....",
    "......wwww......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................"
  ],
  station: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "......kkkk......",
    ".....kYYYYk.....",
    "....kYYYYYYk....",
    "...kYYYYYYYYk...",
    "..kkkkkkkkkkkk..",
    "..kAAAAAAAAAAk..",
    "..kAAAAAAAAAAk..",
    "..kAAkkkkkkAAk..",
    "..kAAkYYYYkAAk..",
    "..kAAkkkkkkAAk..",
    "..kkkkkkkkkkkk.."
  ],
  gateClosed: [
    "kkkkkkkkkkkkkkkk",
    "kAAAAAAAAAAAAAAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kAddddddddddddAk",
    "kkkkkkkkkkkkkkkk"
  ],
  gateOpen: [
    "kkkkkkkkkkkkkkkk",
    "kAAAAAAAAAAAAAAk",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kA............Ak",
    "kkkkkkkkkkkkkkkk"
  ],
  platform: [
    "GGGGGGGGGGGGGGGG",
    "GgGgGgGgGgGgGgGg",
    "gggggggggggggggg",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dAAdAAdAAdAAdAAd",
    "AAdAAdAAdAAdAAdA",
    "dddddddddddddddd",
    "................"
  ],
  spike: [
    "................",
    ".......kk.......",
    "......kwwk......",
    "......kwak......",
    ".....kwaaak.....",
    ".....kwaaak.....",
    "....kwaaaAak....",
    "....kwaaaAak....",
    "...kwaaaAAAak...",
    "...kwaaaAAAak...",
    "..kwaaaAAAAAak..",
    "..kwaaaAAAAAak..",
    ".kwaaaAAAAAAAak.",
    ".kwaaaAAAAAAAak.",
    "kwaaaaaaaaaaaaak",
    "kkkkkkkkkkkkkkkk"
  ],
  spring: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "...mmmmmmmmmm...",
    "..m..........m..",
    "..m..........m..",
    "...mmmmmmmmmm...",
    "..m..........m..",
    "..m..........m..",
    "...mmmmmmmmmm...",
    "................"
  ],
  springCompressed: [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "...mmmmmmmmmm...",
    "..m..mmmmmm..m..",
    "...mmmmmmmmmm...",
    "................"
  ],
  bossIdle: [
    ".....kkkkkk.....",
    "....kAAAAAAk....",
    "...kAAkkkkAAk...",
    "..kAAkRkkRkAAk..",
    "..kAAkkkkkkAAk..",
    "..kAAkAAAAkAAk..",
    "..kAAkkkkkkAAk..",
    "...kAAkkkkAAk...",
    "....kAAAAAAk....",
    ".....kAAAAk.....",
    "....kAAAAAAk....",
    "...kAAkkkkAAk...",
    "..kAAkkkkkkAAk..",
    "..kAAkkkkkkAAk..",
    "...kAAkkkkAAk...",
    "....kk....kk...."
  ],
  bossCharge: [
    ".....kkkkkk.....",
    "....kAAAAAAk....",
    "...kAAkkkkAAk...",
    "..kAAkRkkRkAAk..",
    "..kAAkkkkkkAAk..",
    "..kAAkAAAAkAAk..",
    "..kAAkkkkkkAAk..",
    "...kAAkkkkAAk...",
    "....kAAAAAAk....",
    ".....kAAAAk.....",
    "...kkAAAAAAkk...",
    "..kAAkkkkkkAAk..",
    ".kAAkkkkkkkkAAk.",
    ".kAAkkkkkkkkAAk.",
    "..kAAkkkkkkAAk..",
    "...kkk....kkk..."
  ],
  bossHurt: [
    ".....kkkkkk.....",
    "....kwwwwwwk....",
    "...kwwkkkkwwk...",
    "..kwwkRkkRkwwk..",
    "..kwwkkkkkkwwk..",
    "..kwwkwwwwkwwk..",
    "..kwwkkkkkkwwk..",
    "...kwwkkkkwwk...",
    "....kwwwwwwk....",
    ".....kwwwwk.....",
    "....kwwwwwwk....",
    "...kwwkkkkwwk...",
    "..kwwkkkkkkwwk..",
    "..kwwkkkkkkwwk..",
    "...kwwkkkkwwk...",
    "....kk....kk...."
  ],
};

const COLOR_MAP: Record<string, string> = {
  '.': 'transparent',
  '#': '#111111',
  'g': '#008751',
  'G': '#00e436',
  'r': '#e03a3e',
  'R': '#ff004d',
  's': '#ffccaa',
  'S': '#ffccaa',
  'w': '#ffffff',
  '1': '#1a1a24',
  '2': '#22222e',
  '3': '#2a2a38',
  '4': '#323242',
  '5': '#0a0a0c',
  '6': '#3a3a45',
  '7': '#111115',
  'o': '#ff9900',
  'O': '#ffa300',
  'y': '#ffd700',
  'Y': '#ffec27',
  'b': '#4a90e2',
  'B': '#29adff',
  'p': '#800080',
  'P': '#83769c',
  'd': '#333333',
  'l': '#777777',
  'k': '#111111',
  'a': '#c2c3c7',
  'A': '#5f574f',
  'm': '#ff77a8',
  'M': '#ff004d',
};

// Pre-render sprites to offscreen canvases for performance
const renderSprite = (spriteData: string[]): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = SPRITE_SIZE * SPRITE_SCALE;
  canvas.height = SPRITE_SIZE * SPRITE_SCALE;
  const ctx = canvas.getContext('2d')!;
  
  for (let y = 0; y < SPRITE_SIZE; y++) {
    for (let x = 0; x < SPRITE_SIZE; x++) {
      const char = spriteData[y][x];
      if (char !== '.') {
        ctx.fillStyle = COLOR_MAP[char];
        ctx.fillRect(x * SPRITE_SCALE, y * SPRITE_SCALE, SPRITE_SCALE, SPRITE_SCALE);
      }
    }
  }
  return canvas;
};

// --- SOUND ENGINE ---
let audioCtx: AudioContext | null = null;

const playTone = (freq: number, type: OscillatorType, duration: number, vol = 0.1, slideFreq?: number) => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, audioCtx.currentTime + duration);
    }
    
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error("Audio error:", e);
  }
};

const sfx = {
  jump: () => playTone(300, 'square', 0.2, 0.05, 600),
  dash: () => playTone(150, 'sawtooth', 0.3, 0.05, 50),
  collect: () => playTone(800, 'sine', 0.1, 0.05, 1200),
  deposit: () => { 
    playTone(400, 'square', 0.1, 0.05); 
    setTimeout(() => playTone(600, 'square', 0.15, 0.05), 100); 
  },
  hurt: () => playTone(150, 'sawtooth', 0.4, 0.1, 50),
  gate: () => { 
    playTone(300, 'square', 0.2, 0.05); 
    setTimeout(() => playTone(400, 'square', 0.2, 0.05), 200); 
    setTimeout(() => playTone(500, 'square', 0.4, 0.05), 400); 
  },
  levelUp: () => {
    playTone(400, 'sine', 0.2, 0.05);
    setTimeout(() => playTone(500, 'sine', 0.2, 0.05), 150);
    setTimeout(() => playTone(600, 'sine', 0.4, 0.05), 300);
  }
};

let musicStarted = false;
const startMusic = () => {
  if (musicStarted) return;
  musicStarted = true;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();

  const melody = [220.00, 261.63, 329.63, 261.63, 220.00, 329.63, 440.00, 329.63];
  const bass = [110.00, 110.00, 87.31, 87.31, 98.00, 98.00, 82.41, 82.41];
  let step = 0;

  const playNext = () => {
    if (!audioCtx) return;
    const time = audioCtx.currentTime;
    
    // Melody
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.value = melody[step % melody.length];
    gain.gain.setValueAtTime(0.015, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.2);

    // Bass
    if (step % 2 === 0) {
      const bassOsc = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.value = bass[Math.floor(step / 2) % bass.length];
      bassGain.gain.setValueAtTime(0.03, time);
      bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      bassOsc.connect(bassGain);
      bassGain.connect(audioCtx.destination);
      bassOsc.start(time);
      bassOsc.stop(time + 0.4);
    }

    step++;
    setTimeout(playNext, 250);
  };
  playNext();
};

function Game({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    
    // Resize canvas to fit window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Pre-render sprites
    const renderedSprites = {
      idle: renderSprite(SPRITES.idle),
      run1: renderSprite(SPRITES.run1),
      run2: renderSprite(SPRITES.run2),
      jump: renderSprite(SPRITES.jump),
      fall: renderSprite(SPRITES.fall),
      dash: renderSprite(SPRITES.dash),
      wallSlide: renderSprite(SPRITES.wallSlide),
      bgWall: renderSprite(SPRITES.bgWall),
      bgPillar: renderSprite(SPRITES.bgPillar),
      groundTop: renderSprite(SPRITES.groundTop),
      groundBottom: renderSprite(SPRITES.groundBottom),
      bossIdle: renderSprite(SPRITES.bossIdle),
      bossCharge: renderSprite(SPRITES.bossCharge),
      bossHurt: renderSprite(SPRITES.bossHurt),
    };

    const bgWallPattern = ctx.createPattern(renderedSprites.bgWall, 'repeat');
    const bgPillarPattern = ctx.createPattern(renderedSprites.bgPillar, 'repeat');
    const groundTopPattern = ctx.createPattern(renderedSprites.groundTop, 'repeat');
    const groundBottomPattern = ctx.createPattern(renderedSprites.groundBottom, 'repeat');

    const renderedCollectibles = {
      carrot: renderSprite(SPRITES.carrot),
      key: renderSprite(SPRITES.key),
      gold: renderSprite(SPRITES.gold),
      gem: renderSprite(SPRITES.gem),
      potion: renderSprite(SPRITES.potion),
      scroll: renderSprite(SPRITES.scroll),
    };
    const renderedStation = renderSprite(SPRITES.station);
    const renderedGateClosed = renderSprite(SPRITES.gateClosed);
    const renderedGateOpen = renderSprite(SPRITES.gateOpen);
    const renderedPlatform = renderSprite(SPRITES.platform);
    const renderedSpike = renderSprite(SPRITES.spike);
    const renderedSpring = renderSprite(SPRITES.spring);
    const renderedSpringCompressed = renderSprite(SPRITES.springCompressed);
    const platformPattern = ctx.createPattern(renderedPlatform, 'repeat');

    // Game State
    const keys = { ArrowLeft: false, ArrowRight: false, ArrowUp: false, ArrowDown: false, Space: false, KeyD: false };
    
    const camera = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      lerp: 0.1
    };

    const GROUND_HEIGHT = 100;
    const groundY = window.innerHeight - GROUND_HEIGHT;

    const player = {
      x: window.innerWidth / 2,
      y: groundY - SPRITE_SIZE * SPRITE_SCALE,
      vx: 0,
      vy: 0,
      width: SPRITE_SIZE * SPRITE_SCALE,
      height: SPRITE_SIZE * SPRITE_SCALE,
      speed: 6,
      jumpForce: -14,
      gravity: 0.8,
      friction: 0.82,
      grounded: false,
      facingRight: true,
      state: 'idle', // idle, run, jump
      animFrame: 0,
      animTimer: 0,
      isDashing: false,
      dashTimer: 0,
      dashCooldown: 0,
      hasAirDashed: false,
      coyoteTime: 0,
      jumpBuffer: 0,
      wasUpPressed: false,
      ghosts: [] as {x: number, y: number, facingRight: boolean, alpha: number}[],
    };

    let gameState = {
      level: parseInt(localStorage.getItem('dungeon_save_level') || '1'),
      inventory: 0,
      maxInventory: parseInt(localStorage.getItem('dungeon_save_maxInv') || '3'),
      deposited: 0,
      quota: 5,
      coins: parseInt(localStorage.getItem('dungeon_save_coins') || '0'),
      platforms: [] as any[],
      collectibles: [] as any[],
      spikes: [] as any[],
      springs: [] as any[],
      particles: [] as any[],
      screenShake: 0,
      station: { x: window.innerWidth / 2 - 100, y: groundY - 64, width: 64, height: 64 },
      gate: { x: window.innerWidth / 2 + 100, y: groundY - 64, width: 64, height: 64, open: false },
      boss: null as {
        x: number, y: number, width: number, height: number, 
        health: number, maxHealth: number, vx: number, vy: number,
        state: 'idle' | 'charge' | 'jump' | 'hurt' | 'dead',
        stateTimer: number, facingRight: boolean, active: boolean,
        hurtTimer: number
      } | null,
      shopOpen: false
    };

    const generateLevel = (levelNum: number) => {
      const isBossLevel = levelNum % 5 === 0;
      const newPlatforms = [];
      const newCollectibles = [];
      const newSpikes = [];
      const newSprings = [];
      let newBoss = null;

      if (isBossLevel) {
        // Boss Level: Large arena
        newPlatforms.push({ x: 0, y: groundY - 200, width: 300, height: 16, vx: 0 });
        newPlatforms.push({ x: window.innerWidth - 300, y: groundY - 200, width: 300, height: 16, vx: 0 });
        newPlatforms.push({ x: window.innerWidth / 2 - 150, y: groundY - 400, width: 300, height: 16, vx: 0 });

        newBoss = {
          x: window.innerWidth / 2 - 64,
          y: groundY - 128,
          width: 128,
          height: 128,
          health: 10 + levelNum * 2,
          maxHealth: 10 + levelNum * 2,
          vx: 0,
          vy: 0,
          state: 'idle' as const,
          stateTimer: 60,
          facingRight: false,
          active: true,
          hurtTimer: 0
        };

        return {
          platforms: newPlatforms,
          collectibles: [],
          spikes: [],
          springs: [],
          quota: 0,
          boss: newBoss
        };
      }

      const quota = 3 + levelNum * 2;
      const numCollectibles = quota + 2; // Limit junk to just barely enough
      const numPlatforms = Math.max(numCollectibles + 5, 10 + levelNum * 3); // Fewer platforms, but enough for junk
      let currentY = groundY - 120;

      const maxGap = Math.min(260, 90 + levelNum * 20);
      const minGap = Math.min(180, 60 + levelNum * 15);
      const maxPlatWidthBlocks = Math.max(2, 5 - Math.floor(levelNum / 4));
      const spikeChance = Math.min(0.6, (levelNum - 1) * 0.15);
      const movingChance = Math.min(0.8, (levelNum - 1) * 0.2);

      for (let i = 0; i < numPlatforms; i++) {
        const widthBlocks = Math.floor(Math.random() * (maxPlatWidthBlocks - 1) + 2); // 2 to max blocks
        const width = widthBlocks * (SPRITE_SIZE * SPRITE_SCALE);
        const x = Math.random() * (window.innerWidth - width);
        
        const isMoving = Math.random() < movingChance;
        const vx = isMoving ? (Math.random() > 0.5 ? 1 : -1) * (1 + levelNum * 0.3) : 0;

        newPlatforms.push({ x, y: currentY, width, height: 16, vx });

        if (Math.random() < spikeChance && widthBlocks >= 3) {
          newSpikes.push({
            x: x + (SPRITE_SIZE * SPRITE_SCALE) + Math.random() * (width - 3 * SPRITE_SIZE * SPRITE_SCALE),
            y: currentY - SPRITE_SIZE * SPRITE_SCALE,
            width: SPRITE_SIZE * SPRITE_SCALE,
            height: SPRITE_SIZE * SPRITE_SCALE,
            platformIndex: i
          });
        } else if (Math.random() < 0.2 && widthBlocks >= 2) {
          newSprings.push({
            x: x + Math.random() * (width - SPRITE_SIZE * SPRITE_SCALE),
            y: currentY - SPRITE_SIZE * SPRITE_SCALE,
            width: SPRITE_SIZE * SPRITE_SCALE,
            height: SPRITE_SIZE * SPRITE_SCALE,
            platformIndex: i,
            animTimer: 0
          });
        }

        currentY -= (Math.random() * (maxGap - minGap) + minGap);
      }

      // Distribute limited collectibles randomly across platforms
      const availablePlatforms = newPlatforms.map((_, index) => index);
      for (let i = 0; i < numCollectibles; i++) {
        if (availablePlatforms.length === 0) break;
        const randIdx = Math.floor(Math.random() * availablePlatforms.length);
        const pIndex = availablePlatforms[randIdx];
        availablePlatforms.splice(randIdx, 1);

        const p = newPlatforms[pIndex];
        const types = ['carrot', 'key', 'gold', 'gem', 'potion', 'scroll'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        // Ensure collectible doesn't spawn inside a spike
        const itemSize = SPRITE_SIZE * SPRITE_SCALE;
        let cX = p.x + p.width / 2 - itemSize / 2;
        const pSpike = newSpikes.find(s => s.platformIndex === pIndex);
        
        if (pSpike) {
           const cRight = cX + itemSize;
           const sRight = pSpike.x + pSpike.width;
           
           // Check for overlap between the centered item and the spike
           if (cX < sRight && cRight > pSpike.x) {
              const spikeCenter = pSpike.x + pSpike.width / 2;
              const platCenter = p.x + p.width / 2;
              
              if (spikeCenter < platCenter) {
                 // Spike is on the left half, put item on the far right edge
                 cX = p.x + p.width - itemSize;
              } else {
                 // Spike is on the right half, put item on the far left edge
                 cX = p.x;
              }
           }
        }

        newCollectibles.push({
          x: cX,
          y: p.y - (SPRITE_SIZE * SPRITE_SCALE),
          width: SPRITE_SIZE * SPRITE_SCALE,
          height: SPRITE_SIZE * SPRITE_SCALE,
          type,
          collected: false,
          deposited: false,
          platformIndex: pIndex
        });
      }

      return {
        platforms: newPlatforms,
        collectibles: newCollectibles,
        spikes: newSpikes,
        springs: newSprings,
        quota: quota,
        boss: null
      };
    };

    const initLevel = (levelNum: number) => {
       const levelData = generateLevel(levelNum);
       gameState.platforms = levelData.platforms;
       gameState.collectibles = levelData.collectibles;
       gameState.spikes = levelData.spikes;
       gameState.springs = levelData.springs;
       gameState.boss = levelData.boss;
       gameState.particles = [];
       gameState.screenShake = 0;
       gameState.quota = levelData.quota;
       gameState.deposited = 0;
       gameState.inventory = 0;
       gameState.gate.open = false;
       player.x = window.innerWidth / 2;
       player.y = groundY - player.height;
       player.vx = 0;
       player.vy = 0;
    };

    initLevel(gameState.level);

    const checkCollision = (rect1: any, rect2: any) => {
      return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
      );
    };

    // Input Handling
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') onExit();
      if (e.code === 'ArrowLeft') keys.ArrowLeft = true;
      if (e.code === 'ArrowRight') keys.ArrowRight = true;
      if (e.code === 'ArrowUp' || e.code === 'Space') keys.ArrowUp = true;
      if (e.code === 'ArrowDown') keys.ArrowDown = true;
      if (e.code === 'KeyD' || e.code === 'ShiftLeft') keys.KeyD = true;
      if (e.code === 'KeyE') {
         if (checkCollision(player, gameState.station)) {
            gameState.shopOpen = !gameState.shopOpen;
         }
      }
      if (gameState.shopOpen) {
        if (e.code === 'Digit1') {
           if (gameState.coins >= 5) {
              gameState.coins -= 5;
              gameState.maxInventory++;
              localStorage.setItem('dungeon_save_maxInv', gameState.maxInventory.toString());
              localStorage.setItem('dungeon_save_coins', gameState.coins.toString());
              sfx.collect();
           }
        }
        if (e.code === 'Digit2') {
           if (gameState.coins >= 10) {
              gameState.coins -= 10;
              player.jumpForce -= 1;
              localStorage.setItem('dungeon_save_coins', gameState.coins.toString());
              sfx.collect();
           }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft') keys.ArrowLeft = false;
      if (e.code === 'ArrowRight') keys.ArrowRight = false;
      if (e.code === 'ArrowUp' || e.code === 'Space') keys.ArrowUp = false;
      if (e.code === 'ArrowDown') keys.ArrowDown = false;
      if (e.code === 'KeyD' || e.code === 'ShiftLeft') keys.KeyD = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    let animationFrameId: number;
    let lastTime = performance.now();

    // Game Loop
    const update = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      const groundY = canvas.height - GROUND_HEIGHT;
      // Update station and gate Y if canvas resizes
      gameState.station.y = groundY - 64;
      gameState.gate.y = groundY - 64;

      // Boss Logic
      if (gameState.boss && gameState.boss.active) {
        const boss = gameState.boss;
        boss.stateTimer--;

        if (boss.hurtTimer > 0) boss.hurtTimer--;

        if (boss.state === 'idle') {
          boss.vx *= 0.8;
          if (boss.stateTimer <= 0) {
            const rand = Math.random();
            if (rand < 0.5) {
              boss.state = 'charge';
              boss.stateTimer = 60;
              boss.vx = (player.x > boss.x ? 1 : -1) * 10;
              boss.facingRight = boss.vx > 0;
            } else {
              boss.state = 'jump';
              boss.stateTimer = 100;
              boss.vy = -18;
              boss.vx = (player.x > boss.x ? 1 : -1) * 5;
              boss.facingRight = boss.vx > 0;
            }
          }
        } else if (boss.state === 'charge') {
          if (boss.stateTimer <= 0 || boss.x <= 0 || boss.x + boss.width >= window.innerWidth) {
            boss.state = 'idle';
            boss.stateTimer = 40;
          }
        } else if (boss.state === 'jump') {
          if (boss.vy > 0 && boss.y + boss.height >= groundY) {
            boss.state = 'idle';
            boss.stateTimer = 40;
            gameState.screenShake = 15;
            sfx.hurt(); // Use hurt sound for slam
          }
        } else if (boss.state === 'hurt') {
          boss.vx = 0;
          if (boss.stateTimer <= 0) {
            boss.state = 'idle';
            boss.stateTimer = 30;
          }
        }

        // Apply gravity to boss
        boss.vy += 0.6;
        boss.x += boss.vx;
        boss.y += boss.vy;

        // Boss bounds
        if (boss.x < 0) { boss.x = 0; boss.vx *= -1; }
        if (boss.x + boss.width > window.innerWidth) { boss.x = window.innerWidth - boss.width; boss.vx *= -1; }
        if (boss.y + boss.height > groundY) {
          boss.y = groundY - boss.height;
          boss.vy = 0;
        }

        // Player vs Boss Collision
        const bossHitbox = { x: boss.x + 20, y: boss.y + 20, width: boss.width - 40, height: boss.height - 20 };
        if (checkCollision(player, bossHitbox)) {
          // Check if player is stomping
          if (player.vy > 0 && player.y + player.height < boss.y + boss.height / 2) {
            if (boss.hurtTimer <= 0) {
              boss.health--;
              boss.hurtTimer = 30;
              boss.state = 'hurt';
              boss.stateTimer = 20;
              player.vy = -12;
              gameState.screenShake = 10;
              sfx.jump(); // Use jump sound for hit
              
              if (boss.health <= 0) {
                boss.active = false;
                gameState.gate.open = true;
                gameState.screenShake = 30;
                sfx.levelUp();
                
                // Spawn massive loot
                for (let i = 0; i < 20; i++) {
                  gameState.collectibles.push({
                    x: boss.x + Math.random() * boss.width,
                    y: boss.y + Math.random() * boss.height,
                    width: SPRITE_SIZE * SPRITE_SCALE,
                    height: SPRITE_SIZE * SPRITE_SCALE,
                    type: Math.random() > 0.5 ? 'gold' : 'gem',
                    collected: false,
                    deposited: false,
                    platformIndex: -1
                  });
                }
              }
            }
          } else if (boss.hurtTimer <= 0) {
            // Player hit by boss
            player.y = groundY - player.height;
            player.x = window.innerWidth / 2;
            player.vy = 0;
            gameState.inventory = 0;
            gameState.screenShake = 20;
            sfx.hurt();
          }
        }
      }

      // Move platforms and attached entities
      for (let i = 0; i < gameState.platforms.length; i++) {
        const p = gameState.platforms[i];
        if (p.vx !== 0) {
          p.x += p.vx;
          if (p.x <= 0 || p.x + p.width >= window.innerWidth) {
            p.vx *= -1;
          }
          for (const c of gameState.collectibles) {
            if (c.platformIndex === i) c.x += p.vx;
          }
          for (const s of gameState.spikes) {
            if (s.platformIndex === i) s.x += p.vx;
          }
          for (const sp of gameState.springs) {
            if (sp.platformIndex === i) sp.x += p.vx;
          }
        }
      }

      // Spike Collision
      for (const s of gameState.spikes) {
        const spikeHitbox = { x: s.x + 20, y: s.y + 28, width: s.width - 40, height: s.height - 28 };
        if (checkCollision(player, spikeHitbox)) {
          player.y = groundY - player.height;
          player.x = window.innerWidth / 2;
          player.vy = 0;
          
          // Respawn held items back to their platforms
          for (const c of gameState.collectibles) {
            if (c.collected && !c.deposited) {
              c.collected = false;
            }
          }
          
          gameState.inventory = 0;
          gameState.screenShake = 20; // Shake
          sfx.hurt();
        }
      }

      // Spring Collision
      for (const sp of gameState.springs) {
        if (sp.animTimer > 0) sp.animTimer--;
        const springHitbox = { x: sp.x, y: sp.y + 16, width: sp.width, height: sp.height - 16 };
        if (player.vy >= 0 && checkCollision(player, springHitbox)) {
          player.vy = player.jumpForce * 1.5; // Big jump
          player.y = sp.y - player.height;
          player.grounded = false;
          player.hasAirDashed = false; // Reset dash on spring
          sp.animTimer = 10;
          sfx.jump();
          
          // Add particles
          for (let i = 0; i < 10; i++) {
            gameState.particles.push({
              x: sp.x + sp.width / 2,
              y: sp.y + sp.height,
              vx: (Math.random() - 0.5) * 10,
              vy: -Math.random() * 10,
              life: 20 + Math.random() * 20,
              color: '#00ff00'
            });
          }
        }
      }

      // Dash Logic
      if (keys.KeyD && player.dashCooldown <= 0 && !player.isDashing && (player.grounded || !player.hasAirDashed)) {
        player.isDashing = true;
        player.dashTimer = 12; // frames of dash
        player.dashCooldown = 45; // frames of cooldown
        sfx.dash();
        
        if (!player.grounded) {
          player.hasAirDashed = true;
        }
        
        let dx = 0;
        let dy = 0;
        if (keys.ArrowLeft) dx -= 1;
        if (keys.ArrowRight) dx += 1;
        if (keys.ArrowUp) dy -= 1;
        if (keys.ArrowDown) dy += 1;
        
        // Default to facing direction if no keys pressed
        if (dx === 0 && dy === 0) {
          dx = player.facingRight ? 1 : -1;
        }
        
        const length = Math.sqrt(dx * dx + dy * dy);
        const dashSpeed = 22;
        player.vx = (dx / length) * dashSpeed;
        player.vy = (dy / length) * dashSpeed;
      }

      if (player.dashCooldown > 0) player.dashCooldown--;

      if (player.isDashing) {
        player.dashTimer--;
        
        // Add ghost trail
        if (player.dashTimer % 2 === 0) {
           player.ghosts.push({
             x: player.x,
             y: player.y,
             facingRight: player.facingRight,
             alpha: 0.6
           });
        }

        if (player.dashTimer <= 0) {
          player.isDashing = false;
          // Dampen velocity after dash ends so you don't fly to space
          if (player.vx > player.speed) player.vx = player.speed;
          if (player.vx < -player.speed) player.vx = -player.speed;
          if (player.vy < player.jumpForce) player.vy = player.jumpForce;
          if (player.vy > 10) player.vy = 10;
        }
      } else {
        // Normal Movement
        if (keys.ArrowLeft) {
          player.vx -= 1.5;
          player.facingRight = false;
        }
        if (keys.ArrowRight) {
          player.vx += 1.5;
          player.facingRight = true;
        }

        // Apply friction and speed limits
        player.vx *= player.friction;
        if (player.vx > player.speed) player.vx = player.speed;
        if (player.vx < -player.speed) player.vx = -player.speed;

        // Gravity
        player.vy += player.gravity;

        // Jump Buffering and Coyote Time
        if (player.grounded) {
          player.coyoteTime = 8;
        } else {
          player.coyoteTime--;
        }

        if (keys.ArrowUp) {
          if (!player.wasUpPressed) {
            player.jumpBuffer = 8;
          }
          player.wasUpPressed = true;
        } else {
          player.wasUpPressed = false;
        }

        if (player.jumpBuffer > 0) {
          player.jumpBuffer--;
        }

        let touchingWall = 0;
        if (player.x <= 0) touchingWall = -1;
        if (player.x + player.width >= window.innerWidth) touchingWall = 1;

        // Wall Slide
        if (touchingWall !== 0 && !player.grounded && player.vy > 0) {
           if ((touchingWall === -1 && keys.ArrowLeft) || (touchingWall === 1 && keys.ArrowRight)) {
             player.vy = 2; // Slide down slowly
             // Add slide particles
             if (Math.random() < 0.3) {
               gameState.particles.push({
                 x: touchingWall === -1 ? 0 : window.innerWidth,
                 y: player.y + player.height,
                 vx: touchingWall * Math.random() * 2,
                 vy: -Math.random() * 2,
                 life: 10,
                 color: '#aaa'
               });
             }
           }
        }

        // Jump
        if (player.jumpBuffer > 0) {
          if (player.coyoteTime > 0) {
            player.vy = player.jumpForce;
            player.jumpBuffer = 0;
            player.coyoteTime = 0;
            player.grounded = false;
            sfx.jump();
          } else if (touchingWall !== 0 && !player.grounded) {
            // Wall Jump
            player.vy = player.jumpForce;
            player.vx = touchingWall === -1 ? 12 : -12;
            player.jumpBuffer = 0;
            player.hasAirDashed = false; // Reset dash on wall jump!
            sfx.jump();
            
            // Wall jump particles
            for (let i=0; i<5; i++) {
               gameState.particles.push({
                 x: touchingWall === -1 ? 0 : window.innerWidth,
                 y: player.y + player.height,
                 vx: touchingWall * Math.random() * 5,
                 vy: -Math.random() * 5,
                 life: 15,
                 color: '#fff'
               });
            }
          }
        }
      }

      // Apply velocity
      player.x += player.vx;
      
      // Level walls
      if (player.x < 0) {
        player.x = 0;
        player.vx = 0;
      } else if (player.x + player.width > window.innerWidth) {
        player.x = window.innerWidth - player.width;
        player.vx = 0;
      }

      player.y += player.vy;

      // Collision with ground
      let onGround = false;
      let platformVelocityX = 0;
      if (player.y + player.height >= groundY) {
        player.y = groundY - player.height;
        player.vy = 0;
        onGround = true;
      } else {
        // Platform collision (one-way jump through)
        for (const p of gameState.platforms) {
          const oldBottom = player.y + player.height - player.vy;
          const newBottom = player.y + player.height;
          
          if (player.vy >= 0 && 
              oldBottom <= p.y + 1 && 
              newBottom >= p.y && 
              player.x + player.width > p.x && 
              player.x < p.x + p.width) {
            player.y = p.y - player.height;
            player.vy = 0;
            onGround = true;
            platformVelocityX = p.vx || 0;
            break;
          }
        }
      }
      
      player.grounded = onGround;
      if (onGround) {
        player.hasAirDashed = false;
        if (!keys.ArrowLeft && !keys.ArrowRight && platformVelocityX !== 0) {
          player.x += platformVelocityX;
        }
      }

      // Collectibles Logic
      for (const c of gameState.collectibles) {
        if (!c.collected && checkCollision(player, c)) {
          if (gameState.inventory < gameState.maxInventory) {
            c.collected = true;
            gameState.inventory++;
            sfx.collect();
            
            // Explosion particles
            for (let i = 0; i < 15; i++) {
              let pColor = '#cccccc';
              if (c.type === 'gold') pColor = '#ffff00';
              else if (c.type === 'carrot') pColor = '#ff8800';
              else if (c.type === 'gem') pColor = '#4a90e2';
              else if (c.type === 'potion') pColor = '#800080';
              else if (c.type === 'scroll') pColor = '#ffffff';

              gameState.particles.push({
                x: c.x + c.width / 2,
                y: c.y + c.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 20 + Math.random() * 20,
                color: pColor
              });
            }
          }
        }
      }

      // Particles Logic
      for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const pt = gameState.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.5; // Gravity
        pt.life--;
        if (pt.life <= 0) gameState.particles.splice(i, 1);
      }

      // Station Logic
      if (checkCollision(player, gameState.station)) {
        if (gameState.inventory > 0) {
          gameState.deposited += gameState.inventory;
          gameState.coins += gameState.inventory; // Give coins for deposited junk
          gameState.inventory = 0;
          localStorage.setItem('dungeon_save_coins', gameState.coins.toString());
          
          // Mark items as permanently deposited
          for (const c of gameState.collectibles) {
            if (c.collected && !c.deposited) {
              c.deposited = true;
            }
          }
          
          sfx.deposit();
          if (gameState.deposited >= gameState.quota && !gameState.gate.open && (!gameState.boss || !gameState.boss.active)) {
            gameState.gate.open = true;
            sfx.gate();
          }
        }
      } else {
        gameState.shopOpen = false; // Close shop if walk away
      }

      // Gate Logic
      if (gameState.gate.open && checkCollision(player, gameState.gate)) {
        gameState.level++;
        localStorage.setItem('dungeon_save_level', gameState.level.toString());
        sfx.levelUp();
        initLevel(gameState.level);
      }

      // Camera Logic
      camera.targetX = player.x + player.width / 2 - canvas.width / 2;
      camera.targetY = player.y + player.height / 2 - canvas.height / 2;
      
      // Clamp camera so we don't see below ground
      const maxCamY = groundY + GROUND_HEIGHT - canvas.height;
      if (camera.targetY > maxCamY) camera.targetY = maxCamY;
      
      camera.x += (camera.targetX - camera.x) * camera.lerp;
      camera.y += (camera.targetY - camera.y) * camera.lerp;

      if (gameState.screenShake > 0) {
        camera.x += (Math.random() - 0.5) * gameState.screenShake;
        camera.y += (Math.random() - 0.5) * gameState.screenShake;
        gameState.screenShake *= 0.9;
        if (gameState.screenShake < 0.5) gameState.screenShake = 0;
      }

      // Update ghosts
      for (let i = player.ghosts.length - 1; i >= 0; i--) {
        player.ghosts[i].alpha -= 0.05;
        if (player.ghosts[i].alpha <= 0) {
          player.ghosts.splice(i, 1);
        }
      }

      // Animation State Machine
      let touchingWall = 0;
      if (player.x <= 0) touchingWall = -1;
      if (player.x + player.width >= window.innerWidth) touchingWall = 1;

      if (player.isDashing) {
        player.state = 'dash';
      } else if (touchingWall !== 0 && !player.grounded && player.vy > 0 && ((touchingWall === -1 && keys.ArrowLeft) || (touchingWall === 1 && keys.ArrowRight))) {
        player.state = 'wallSlide';
      } else if (!player.grounded) {
        if (player.vy > 0) {
          player.state = 'fall';
        } else {
          player.state = 'jump';
        }
      } else if (Math.abs(player.vx) > 0.5) {
        player.state = 'run';
      } else {
        player.state = 'idle';
      }

      // Animation Timer
      player.animTimer += deltaTime * 1000;
      if (player.animTimer > 100) { // 100ms per frame
        player.animTimer = 0;
        player.animFrame = (player.animFrame + 1) % 2; // Toggle between 0 and 1 for run cycle
      }

      // --- RENDER ---
      
      // Clear screen
      ctx.fillStyle = '#1a1a24';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Parallax Layer 1: Wall
      ctx.save();
      const wallParallax = 0.2;
      ctx.translate(-camera.x * wallParallax, -camera.y * wallParallax);
      if (bgWallPattern) {
        ctx.fillStyle = bgWallPattern;
        ctx.fillRect(camera.x * wallParallax - canvas.width, camera.y * wallParallax - canvas.height, canvas.width * 3, canvas.height * 3);
      }
      ctx.restore();

      // Parallax Layer 2: Pillars
      ctx.save();
      const pillarParallax = 0.5;
      const pillarSpacing = 300;
      const pillarWidth = SPRITE_SIZE * SPRITE_SCALE;
      
      ctx.translate(-camera.x * pillarParallax, -camera.y * pillarParallax);
      
      if (bgPillarPattern) {
        ctx.fillStyle = bgPillarPattern;
        const startXPillar = Math.floor((camera.x * pillarParallax) / pillarSpacing) * pillarSpacing;
        for (let i = startXPillar - pillarSpacing; i < (camera.x * pillarParallax) + canvas.width + pillarSpacing; i += pillarSpacing) {
          ctx.fillRect(i, camera.y * pillarParallax - canvas.height, pillarWidth, canvas.height * 3);
        }
      }
      ctx.restore();

      // Layer 3: Main game world (Ground, Player, etc.)
      ctx.save();
      ctx.translate(-camera.x, -camera.y);

      // Draw Ground (Dungeon Stone)
      if (groundTopPattern && groundBottomPattern) {
        ctx.fillStyle = groundTopPattern;
        ctx.fillRect(camera.x - canvas.width, groundY, canvas.width * 3, SPRITE_SIZE * SPRITE_SCALE);
        
        ctx.fillStyle = groundBottomPattern;
        ctx.fillRect(camera.x - canvas.width, groundY + SPRITE_SIZE * SPRITE_SCALE, canvas.width * 3, Math.max(GROUND_HEIGHT, canvas.height - groundY + camera.y));
      }

      // Draw Station
      ctx.drawImage(renderedStation, gameState.station.x, gameState.station.y);

      // Draw Gate
      const gateSprite = gameState.gate.open ? renderedGateOpen : renderedGateClosed;
      ctx.drawImage(gateSprite, gameState.gate.x, gameState.gate.y);

      // Draw Platforms
      if (platformPattern) {
        ctx.fillStyle = platformPattern;
        for (const p of gameState.platforms) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.fillRect(0, 0, p.width, p.height);
          ctx.restore();
        }
      }

      // Draw Collectibles
      for (const c of gameState.collectibles) {
        if (!c.collected) {
          const sprite = renderedCollectibles[c.type as keyof typeof renderedCollectibles];
          ctx.drawImage(sprite, c.x, c.y);
        }
      }

      // Draw Spikes
      for (const s of gameState.spikes) {
        ctx.drawImage(renderedSpike, s.x, s.y);
      }

      // Draw Springs
      for (const sp of gameState.springs) {
        const sprite = sp.animTimer > 0 ? renderedSpringCompressed : renderedSpring;
        ctx.drawImage(sprite, sp.x, sp.y);
      }

      // Draw Particles
      for (const pt of gameState.particles) {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.life / 40;
        ctx.fillRect(pt.x, pt.y, 6, 6);
        ctx.globalAlpha = 1;
      }

      // Draw Dash Trail (Ghosting)
      for (const ghost of player.ghosts) {
        ctx.save();
        ctx.globalAlpha = ghost.alpha;
        if (!ghost.facingRight) {
          ctx.translate(ghost.x + player.width, ghost.y);
          ctx.scale(-1, 1);
          ctx.drawImage(renderedSprites.run1, 0, 0);
        } else {
          ctx.drawImage(renderedSprites.run1, ghost.x, ghost.y);
        }
        ctx.restore();
      }

      // Determine which sprite to draw
      let currentSprite = renderedSprites.idle;
      if (player.state === 'jump') {
        currentSprite = renderedSprites.jump;
      } else if (player.state === 'fall') {
        currentSprite = renderedSprites.fall;
      } else if (player.state === 'dash') {
        currentSprite = renderedSprites.dash;
      } else if (player.state === 'wallSlide') {
        currentSprite = renderedSprites.wallSlide;
      } else if (player.state === 'run') {
        currentSprite = player.animFrame === 0 ? renderedSprites.run1 : renderedSprites.run2;
      }

      // Draw Boss
      if (gameState.boss && gameState.boss.active) {
        const boss = gameState.boss;
        const bossSprite = boss.hurtTimer > 0 ? renderedSprites.bossHurt : (boss.state === 'charge' ? renderedSprites.bossCharge : renderedSprites.bossIdle);
        
        ctx.save();
        if (!boss.facingRight) {
          ctx.translate(boss.x + boss.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(bossSprite, 0, boss.y, boss.width, boss.height);
        } else {
          ctx.drawImage(bossSprite, boss.x, boss.y, boss.width, boss.height);
        }
        ctx.restore();
      }

      // Draw Player
      ctx.save();
      if (!player.facingRight) {
        // Flip horizontally
        ctx.translate(player.x + player.width, player.y);
        ctx.scale(-1, 1);
        ctx.drawImage(currentSprite, 0, 0);
      } else {
        ctx.drawImage(currentSprite, player.x, player.y);
      }
      ctx.restore();
      
      // Draw Stacked Items
      let stackIndex = 0;
      for (const c of gameState.collectibles) {
        if (c.collected && !c.deposited) {
          const sprite = renderedCollectibles[c.type as keyof typeof renderedCollectibles];
          ctx.drawImage(sprite, player.x, player.y - 40 * (stackIndex + 1));
          stackIndex++;
        }
      }
      
      ctx.restore(); // Restore camera transform

      // Draw Boss Health Bar (Fixed on Screen)
      if (gameState.boss && gameState.boss.active) {
        const boss = gameState.boss;
        const barWidth = 400;
        const barHeight = 20;
        const barX = window.innerWidth / 2 - barWidth / 2;
        const barY = 60;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX - 5, barY - 30, barWidth + 10, barHeight + 40);
        
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = '#ff004d';
        ctx.fillRect(barX, barY, barWidth * (boss.health / boss.maxHealth), barHeight);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('SHADOW GOLEM', window.innerWidth / 2, barY - 10);
      }

      // Draw Game UI
      const uiHeight = gameState.inventory >= gameState.maxInventory ? 100 : 70;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 450, uiHeight);
      
      ctx.fillStyle = '#ffccaa';
      ctx.font = '16px monospace';
      ctx.fillText(`Level: ${gameState.level} | Coins: ${gameState.coins}`, 20, 35);
      ctx.fillText(`Junk: ${gameState.inventory}/${gameState.maxInventory} | Deposited: ${gameState.deposited}/${gameState.quota}`, 20, 60);
      
      if (gameState.inventory >= gameState.maxInventory) {
        ctx.fillStyle = '#ff5555';
        ctx.fillText(`INVENTORY FULL! Return to the blue station.`, 20, 85);
      }
      
      if (gameState.boss && gameState.boss.active) {
        ctx.fillStyle = '#ff004d';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('BOSS LEVEL', window.innerWidth / 2, 120);
      }
      
      if (checkCollision(player, gameState.station)) {
         ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
         ctx.fillRect(canvas.width / 2 - 200, canvas.height - 250, 400, 150);
         ctx.fillStyle = 'white';
         ctx.textAlign = 'center';
         if (!gameState.shopOpen) {
            ctx.fillText("Press 'E' to open Shop", canvas.width / 2, canvas.height - 180);
         } else {
            ctx.fillStyle = '#ffd700';
            ctx.fillText("--- UPGRADES ---", canvas.width / 2, canvas.height - 220);
            ctx.fillStyle = 'white';
            ctx.fillText(`[1] +1 Max Inventory (5 Coins)`, canvas.width / 2, canvas.height - 180);
            ctx.fillText(`[2] Higher Jump (10 Coins)`, canvas.width / 2, canvas.height - 150);
         }
         ctx.textAlign = 'left';
      }
      
      if (gameState.gate.open) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width / 2 - 150, 20, 300, 40);
        ctx.fillStyle = '#00ff00';
        ctx.textAlign = 'center';
        ctx.fillText('GATE OPEN! Enter the purple gate.', canvas.width / 2, 45);
        ctx.textAlign = 'left';
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-black relative">
      <canvas 
        ref={canvasRef} 
        className="block touch-none"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="absolute top-4 right-4 text-white/50 font-mono text-xs">
        Press ESC to Menu
      </div>
    </div>
  );
}

function MainMenu({ onStart, onReset }: { onStart: () => void, onReset: () => void }) {
  const savedLevel = localStorage.getItem('dungeon_save_level');
  const hasSave = savedLevel && parseInt(savedLevel) > 1;

  return (
    <div className="w-full h-screen bg-[#1a1a24] flex flex-col items-center justify-center font-mono text-white" style={{ backgroundImage: 'radial-gradient(circle at center, #2a2a34 0%, #1a1a24 100%)' }}>
      <h1 className="text-7xl font-bold text-[#ffccaa] mb-12 tracking-widest" style={{ textShadow: '4px 4px 0 #000, 8px 8px 0 #555' }}>DUNGEON JUNK</h1>
      
      <div className="flex flex-col gap-6 items-center bg-black/50 p-12 rounded-xl border-4 border-[#ffccaa]">
        {hasSave ? (
          <>
            <button onClick={onStart} className="text-3xl font-bold text-white hover:text-[#00ff00] transition-colors uppercase tracking-wider">
              Continue (Level {savedLevel})
            </button>
            <button onClick={() => { onReset(); onStart(); }} className="text-3xl font-bold text-white hover:text-[#ff5555] transition-colors uppercase tracking-wider">
              New Game
            </button>
          </>
        ) : (
          <>
            <button onClick={onStart} className="text-4xl font-bold text-white hover:text-[#00ff00] transition-colors uppercase tracking-wider animate-pulse">
              Start Game
            </button>
          </>
        )}
      </div>

      <div className="mt-16 text-[#ffccaa] text-lg text-center opacity-80 max-w-xl">
        <p className="mb-2">Use <span className="text-white font-bold">Arrow Keys</span> to Move & Jump</p>
        <p className="mb-2">Press <span className="text-white font-bold">D</span> to Dash (8-Way)</p>
        <p className="mb-2">Press <span className="text-white font-bold">E</span> at the blue station to open Shop</p>
        <p className="mt-6 text-sm opacity-60">Collect junk, deposit it, and escape the dungeon!</p>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'game'>('menu');

  useEffect(() => {
    const fixed = localStorage.getItem('dungeon_coins_fixed_v1');
    if (!fixed) {
      const coins = parseInt(localStorage.getItem('dungeon_save_coins') || '0');
      localStorage.setItem('dungeon_save_coins', Math.max(0, coins - 20).toString());
      localStorage.setItem('dungeon_coins_fixed_v1', 'true');
    }
  }, []);

  const handleStart = () => {
    startMusic();
    setScreen('game');
  };

  const handleReset = () => {
    localStorage.removeItem('dungeon_save_level');
    localStorage.removeItem('dungeon_save_maxInv');
    localStorage.removeItem('dungeon_save_coins');
  };

  return screen === 'menu' ? (
    <MainMenu onStart={handleStart} onReset={handleReset} />
  ) : (
    <Game onExit={() => setScreen('menu')} />
  );
}
