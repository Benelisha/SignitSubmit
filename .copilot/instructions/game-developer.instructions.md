# Game Developer Skill - bberak/react-native-game-engine

## Overview

This skill provides expertise for developing games using the `bberak/react-native-game-engine` package. It focuses on Component-Entity-System (CES) architecture patterns, performance optimization, and best practices for React Native game development.

## When to Use Game Engine vs Native React Native UI

### Use react-native-game-engine When:
- Building interactive games with continuous animation loops
- Need precise control over frame timing (~60fps)
- Implementing physics-based interactions
- Creating games with multiple moving entities
- Building touch/gesture-heavy interactive experiences
- Developing side-scrollers, platformers, or puzzle games

### Use Native React Native UI When:
- Building static or semi-static game UI overlays (HUD, menus, scoreboards)
- Creating turn-based games with infrequent updates
- Implementing settings screens, leaderboards, or shop interfaces
- Building games with minimal animation requirements
- Prioritizing accessibility and native platform conventions

### Hybrid Approach:
Use GameEngine for the game canvas and native React Native components for UI overlays rendered as children of the GameEngine component.

## Core Patterns

### Component-Entity-System (CES) Architecture

```typescript
// ENTITIES - Data containers with unique IDs
const entities = {
  player: {
    position: [100, 200],
    velocity: [0, 0],
    health: 100,
    renderer: <PlayerSprite />,
    physics: { mass: 1.0 }
  },
  enemy: {
    position: [300, 150],
    velocity: [2, 0],
    health: 50,
    renderer: <EnemySprite />,
    physics: { mass: 2.0 },
    ai: { behavior: 'chase' }
  }
};

// SYSTEMS - Pure functions that process entities
const MovementSystem = (entities, { touches, screen }) => {
  // Update positions based on velocity and input
  Object.keys(entities).forEach(id => {
    const entity = entities[id];
    if (entity.velocity && entity.position) {
      entity.position[0] += entity.velocity[0];
      entity.position[1] += entity.velocity[1];
    }
  });
  return entities;
};

const CollisionSystem = (entities) => {
  // Check for collisions between entities
  Object.keys(entities).forEach(id1 => {
    Object.keys(entities).forEach(id2 => {
      if (id1 !== id2) {
        const dist = calculateDistance(entities[id1], entities[id2]);
        if (dist < entities[id1].radius + entities[id2].radius) {
          handleCollision(entities[id1], entities[id2]);
        }
      }
    });
  });
  return entities;
};

// GAME ENGINE SETUP
<GameEngine
  systems={[MovementSystem, CollisionSystem, RenderSystem]}
  entities={entities}
/>
```

## Sprite Sheet Rendering

### Basic Sprite Sheet Implementation

```typescript
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

class SpriteRenderer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      frameIndex: 0,
      lastUpdate: 0
    };
  }

  updateSprite(dt, entities) {
    const { animationFrames, fps, position } = this.props;
    const now = Date.now();
    
    if (now - this.state.lastUpdate > 1000 / fps) {
      this.setState({
        frameIndex: (this.state.frameIndex + 1) % animationFrames,
        lastUpdate: now
      });
    }
    
    return entities;
  }

  render() {
    const { position, spriteSheet, frameWidth, frameHeight } = this.props;
    const { frameIndex } = this.state;
    
    const source = {
      uri: spriteSheet,
      method: 'GET' // For local assets
    };

    return (
      <Image
        style={[
          styles.sprite,
          {
            left: position[0],
            top: position[1],
            width: frameWidth,
            height: frameHeight,
            // Clip to specific frame using transform or source
          }
        ]}
        source={source}
      />
    );
  }
}

const styles = StyleSheet.create({
  sprite: {
    position: 'absolute',
    resizeMode: 'cover'
  }
});

export default SpriteRenderer;
```

### Advanced Sprite Animation with State

```typescript
class AnimatedSprite extends React.PureComponent {
  constructor(props) {
    super(props);
    this.animationState = {
      currentFrame: 0,
      frameTimer: 0,
      isPlaying: true,
      direction: 1 // 1 for forward, -1 for reverse
    };
  }

  updateAnimation(dt, entities) {
    const { fps, totalFrames } = this.props;
    
    if (!this.animationState.isPlaying) return entities;
    
    this.animationState.frameTimer += dt;
    
    if (this.animationState.frameTimer > 1000 / fps) {
      this.animationState.frameTimer = 0;
      this.animationState.currentFrame += this.animationState.direction;
      
      if (this.animationState.currentFrame >= totalFrames || 
          this.animationState.currentFrame < 0) {
        this.animationState.direction *= -1;
      }
    }
    
    return entities;
  }

  render() {
    const { position, texture, frameWidth, frameHeight } = this.props;
    const { currentFrame } = this.animationState;
    
    // Calculate UV coordinates for sprite sheet
    const uvStart = {
      s: (currentFrame % 4) * (1 / 4),
      t: Math.floor(currentFrame / 4) * 0.25
    };
    
    return (
      <Image
        style={{
          position: 'absolute',
          left: position[0],
          top: position[1],
          width: frameWidth,
          height: frameHeight
        }}
        source={{ uri: texture }}
      />
    );
  }
}
```

## Particle Systems

### Basic Particle System

```typescript
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.maxParticles = 100;
  }

  spawnParticle(x, y, options = {}) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift(); // Remove oldest
    }

    this.particles.push({
      position: [x, y],
      velocity: options.velocity || [0, 0],
      life: options.life || 1.0,
      maxLife: options.life || 1.0,
      color: options.color || '#ffffff',
      size: options.size || 5.0,
      ...options
    });
  }

  updateParticles(dt, entities) {
    const activeParticles = [];
    
    this.particles.forEach(particle => {
      // Update life
      particle.life -= dt;
      
      if (particle.life <= 0) return;
      
      // Update position
      particle.position[0] += particle.velocity[0];
      particle.position[1] += particle.velocity[1];
      
      // Apply gravity if present
      if (particle.gravity) {
        particle.velocity[1] += particle.gravity * dt;
      }
      
      // Update size based on life
      particle.size *= 0.98;
      
      activeParticles.push(particle);
    });
    
    this.particles = activeParticles;
    
    // Add particles to entities for rendering
    this.particles.forEach((p, index) => {
      entities[`particle_${index}`] = {
        position: p.position,
        renderer: <ParticleRenderer particle={p} />
      };
    });
    
    return entities;
  }
}

// Particle Renderer Component
class ParticleRenderer extends React.PureComponent {
  render() {
    const { particle } = this.props;
    const { position, size, color } = particle;
    
    return (
      <View
        style={{
          position: 'absolute',
          left: position[0] - size / 2,
          top: position[1] - size / 2,
          width: size,
          height: size,
          backgroundColor: color,
          opacity: particle.life / particle.maxLife
        }}
      />
    );
  }
}
```

### Advanced Particle System with Emitter

```typescript
class EmitterParticleSystem {
  constructor(options = {}) {
    this.particles = [];
    this.emitter = {
      position: options.position || [0, 0],
      angle: options.angle || 0,
      spread: options.spread || Math.PI / 4,
      speed: options.speed || 100,
      rate: options.rate || 10, // particles per second
      lifetime: options.lifetime || 2.0,
      size: options.size || 5
    };
    this.emitterTimer = 0;
  }

  updateEmitter(dt, entities) {
    this.emitterTimer += dt;
    
    if (this.emitterTimer > 1 / this.emitter.rate) {
      this.emitterTimer = 0;
      
      // Spawn particle at emitter position
      const angle = this.emitter.angle + 
        (Math.random() - 0.5) * this.emitter.spread;
      
      const velocity = [
        Math.cos(angle) * this.emitter.speed,
        Math.sin(angle) * this.emitter.speed
      ];
      
      this.particles.push({
        position: [...this.emitter.position],
        velocity: [...velocity],
        life: this.emitter.lifetime,
        maxLife: this.emitter.lifetime,
        size: this.emitter.size,
        color: this.emitter.color || '#fff'
      });
    }
    
    // Update existing particles
    this.particles = this.particles.filter(p => {
      p.life -= dt;
      if (p.life <= 0) return false;
      
      p.position[0] += p.velocity[0] * dt;
      p.position[1] += p.velocity[1] * dt;
      
      return true;
    });
    
    // Add particles to entities
    this.particles.forEach((p, i) => {
      entities[`particle_${i}`] = {
        position: p.position,
        renderer: <ParticleRenderer particle={p} />
      };
    });
    
    return entities;
  }
}
```

## Sound/Audio Management

### Audio System Pattern

```typescript
import { Audio } from 'expo-av';

class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.music = null;
    this.volume = { master: 1.0, music: 0.7, sfx: 0.5 };
  }

  async loadSound(name, asset) {
    const sound = new Audio.Sound();
    await sound.loadAsync(asset);
    this.sounds.set(name, sound);
  }

  playSound(name, options = {}) {
    const sound = this.sounds.get(name);
    if (sound) {
      const playbackStatus = {
        volume: this.volume.sfx * (options.volume || 1.0),
        pitch: options.pitch || 1.0
      };
      sound.setPlaybackRateAsync(playbackStatus.pitch);
      sound.setVolumeAsync(playbackStatus.volume);
      sound.playAsync();
    }
  }

  stopSound(name) {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.stopAsync();
    }
  }

  async loadMusic(asset) {
    if (this.music) {
      await this.music.stopAsync();
    }
    
    this.music = new Audio.Sound();
    await this.music.loadAsync(asset);
    await this.music.setVolumeAsync(this.volume.music);
  }

  playMusic(loop = true) {
    if (this.music) {
      this.music.setIsLoopingAsync(loop);
      this.music.playAsync();
    }
  }

  stopMusic() {
    if (this.music) {
      this.music.stopAsync();
    }
  }

  setMasterVolume(volume) {
    this.volume.master = volume;
    // Apply to all playing sounds
  }
}

// Usage in GameEngine
const audioManager = new AudioManager();

// Load sounds in constructor or useEffect
async function initAudio() {
  await audioManager.loadSound('jump', require('./assets/sounds/jump.mp3'));
  await audioManager.loadSound('coin', require('./assets/sounds/coin.mp3'));
  await audioManager.loadMusic(require('./assets/music/background.mp3'));
}

// System that plays sounds
const AudioSystem = (entities, { events }) => {
  events?.forEach(event => {
    if (event.type === 'player_jump') {
      audioManager.playSound('jump');
    }
    if (event.type === 'collect_coin') {
      audioManager.playSound('coin');
    }
  });
  
  return entities;
};
```

## Game Loop and Update Cycles

### GameLoop Component Usage

```typescript
import { GameLoop } from 'react-native-game-engine';

class SimpleGame extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      playerX: 100,
      playerY: 200
    };
  }

  updateHandler = ({ touches, screen, layout, time, delta }) => {
    // delta contains timing information
    // time: current time in ms
    // delta: time since last frame
    
    const move = touches.find(t => t.type === 'move');
    
    if (move) {
      this.setState(prev => ({
        playerX: prev.playerX + move.delta.pageX,
        playerY: prev.playerY + move.delta.pageY
      }));
    }
  };

  render() {
    return (
      <GameLoop
        style={{ flex: 1 }}
        onUpdate={this.updateHandler}
      >
        <View
          style={{
            position: 'absolute',
            left: this.state.playerX,
            top: this.state.playerY,
            width: 50,
            height: 50,
            backgroundColor: 'blue'
          }}
        />
      </GameLoop>
    );
  }
}
```

### GameEngine Component Usage

```typescript
import { GameEngine } from 'react-native-game-engine';

class AdvancedGame extends React.PureComponent {
  constructor() {
    super();
    this.gameEngineRef = React.createRef();
    
    this.state = {
      entities: {
        player: {
          position: [100, 200],
          velocity: [0, 0],
          renderer: <PlayerSprite />
        },
        enemy: {
          position: [300, 150],
          velocity: [2, 0],
          renderer: <EnemySprite />
        }
      }
    };
  }

  // Movement System
  movementSystem = (entities, { touches }) => {
    Object.keys(entities).forEach(id => {
      const entity = entities[id];
      if (entity.velocity && entity.position) {
        entity.position[0] += entity.velocity[0];
        entity.position[1] += entity.velocity[1];
      }
    });
    return entities;
  };

  // Input System
  inputSystem = (entities, { touches }) => {
    touches.filter(t => t.type === 'start').forEach(touch => {
      const entity = entities[touch.id];
      if (entity && entity.controls) {
        entity.controls.active = true;
      }
    });
    
    return entities;
  };

  // Collision System
  collisionSystem = (entities) => {
    const entityIds = Object.keys(entities);
    
    for (let i = 0; i < entityIds.length; i++) {
      for (let j = i + 1; j < entityIds.length; j++) {
        const id1 = entityIds[i];
        const id2 = entityIds[j];
        
        const pos1 = entities[id1].position;
        const pos2 = entities[id2].position;
        
        const dist = Math.sqrt(
          Math.pow(pos1[0] - pos2[0], 2) + 
          Math.pow(pos1[1] - pos2[1], 2)
        );
        
        if (dist < (entities[id1].radius || 20) + (entities[id2].radius || 20)) {
          // Handle collision
          this.handleCollision(entities[id1], entities[id2]);
        }
      }
    }
    
    return entities;
  };

  handleCollision(entity1, entity2) {
    // Apply collision response
    const tempVel = {...entity1.velocity};
    entity1.velocity = {...entity2.velocity};
    entity2.velocity = tempVel;
  }

  render() {
    return (
      <GameEngine
        ref={this.gameEngineRef}
        systems={[
          this.inputSystem,
          this.movementSystem,
          this.collisionSystem
        ]}
        entities={this.state.entities}
        style={{ flex: 1 }}
      />
    );
  }
}
```

## Collision Detection

### AABB (Axis-Aligned Bounding Box) Collision

```typescript
const AABBSystem = (entities) => {
  Object.keys(entities).forEach(id1 => {
    Object.keys(entities).forEach(id2 => {
      if (id1 !== id2) {
        const e1 = entities[id1];
        const e2 = entities[id2];
        
        if (e1.position && e2.position && 
            e1.width && e2.width &&
            e1.height && e2.height) {
          
          const xOverlap = (e1.position[0] < e2.position[0] + e2.width) &&
                          (e1.position[0] + e1.width > e2.position[0]);
          
          const yOverlap = (e1.position[1] < e2.position[1] + e2.height) &&
                          (e1.position[1] + e1.height > e2.position[1]);
          
          if (xOverlap && yOverlap) {
            // Collision detected
            e1.onCollision?.(e2);
            e2.onCollision?.(e1);
          }
        }
      }
    });
  });
  
  return entities;
};
```

### Circle Collision Detection

```typescript
const CircleCollisionSystem = (entities) => {
  Object.keys(entities).forEach(id1 => {
    Object.keys(entities).forEach(id2 => {
      if (id1 !== id2) {
        const e1 = entities[id1];
        const e2 = entities[id2];
        
        if (e1.position && e2.position && 
            e1.radius && e2.radius) {
          
          const dx = e1.position[0] - e2.position[0];
          const dy = e1.position[1] - e2.position[1];
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < e1.radius + e2.radius) {
            // Collision detected
            const overlap = e1.radius + e2.radius - distance;
            
            // Separate circles
            const nx = dx / distance;
            const ny = dy / distance;
            
            e1.position[0] += nx * overlap * 0.5;
            e1.position[1] += ny * overlap * 0.5;
            e2.position[0] -= nx * overlap * 0.5;
            e2.position[1] -= ny * overlap * 0.5;
            
            // Trigger collision events
            e1.onCollision?.(e2);
            e2.onCollision?.(e1);
          }
        }
      }
    });
  });
  
  return entities;
};
```

## Touch/Interaction Handling

### Multi-Touch System

```typescript
const TouchSystem = (entities, { touches }) => {
  // Track touch state
  const touchMap = new Map();
  
  touches.forEach(touch => {
    const entityId = touch.id;
    
    switch (touch.type) {
      case 'start':
        // New touch - create or activate entity
        if (!entities[entityId]) {
          entities[entityId] = {
            position: [touch.pageX, touch.pageY],
            velocity: [0, 0],
            renderer: <TouchTarget />
          };
        } else {
          entities[entityId].position = [touch.pageX, touch.pageY];
          entities[entityId].isActive = true;
        }
        break;
        
      case 'move':
        // Update position
        if (entities[entityId]) {
          entities[entityId].position = [
            entities[entityId].position[0] + touch.delta.pageX,
            entities[entityId].position[1] + touch.delta.pageY
          ];
        }
        break;
        
      case 'end':
      case 'cancel':
        // Remove entity
        delete entities[entityId];
        break;
    }
  });
  
  return entities;
};
```

### Gesture Recognition System

```typescript
const GestureSystem = (entities, { touches }) => {
  const gestures = {
    swipes: [],
    taps: [],
    longPresses: []
  };
  
  // Detect swipe gestures
  touches.forEach(touch => {
    if (touch.type === 'start') {
      gestures.swipes.push({
        id: touch.id,
        startX: touch.pageX,
        startY: touch.pageY,
        startTime: Date.now()
      });
    } else if (touch.type === 'end' && gestures.swipes.length > 0) {
      const swipe = gestures.swipes.find(s => s.id === touch.id);
      if (swipe) {
        const dx = touch.pageX - swipe.startX;
        const dy = touch.pageY - swipe.startY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 50) { // Minimum swipe distance
          gestures.swipes.push({
            ...swipe,
            dx,
            dy,
            distance,
            type: 'swipe'
          });
        }
      }
    }
  });
  
  // Process gestures
  gestures.swipes.forEach(swipe => {
    if (swipe.type === 'swipe') {
      // Find entity under swipe start
      const entity = Object.values(entities).find(e => 
        e.position &&
        Math.abs(e.position[0] - swipe.startX) < 50 &&
        Math.abs(e.position[1] - swipe.startY) < 50
      );
      
      if (entity) {
        // Apply swipe effect
        entity.velocity = [swipe.dx * 0.1, swipe.dy * 0.1];
      }
    }
  });
  
  return entities;
};
```

## Performance Optimization Patterns

### Entity Pooling

```typescript
class EntityPool {
  constructor(factory, initialSize = 10) {
    this.factory = factory;
    this.pool = [];
    this.active = new Map();
    
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.factory());
    }
  }
  
  acquire() {
    if (this.pool.length > 0) {
      const entity = this.pool.pop();
      this.active.set(entity.id, entity);
      return entity;
    }
    
    // Create new if pool empty
    const entity = this.factory();
    this.active.set(entity.id, entity);
    return entity;
  }
  
  release(entityId) {
    const entity = this.active.get(entityId);
    if (entity) {
      this.active.delete(entityId);
      this.pool.push(entity);
    }
  }
  
  getAll() {
    return Array.from(this.active.values());
  }
}

// Usage
const enemyPool = new EntityPool(() => ({
  id: `enemy_${Date.now()}_${Math.random()}`,
  position: [0, 0],
  velocity: [0, 0],
  renderer: <EnemySprite />
}));

const SpawningSystem = (entities, { time }) => {
  // Spawn enemies at intervals
  if (time % 2000 < 16) { // Every ~2 seconds
    const enemy = enemyPool.acquire();
    enemy.position = [Math.random() * 300, -50];
    entities[enemy.id] = enemy;
  }
  
  return entities;
};
```

### Batch Rendering

```typescript
// Instead of rendering individual entities, batch them
const BatchRenderer = (entities, { screen }) => {
  const batches = {
    sprites: [],
    particles: [],
    ui: []
  };
  
  Object.values(entities).forEach(entity => {
    if (entity.rendererType === 'sprite') {
      batches.sprites.push(entity);
    } else if (entity.rendererType === 'particle') {
      batches.particles.push(entity);
    }
  });
  
  // Render batches efficiently
  return (
    <React.Fragment>
      <BatchSpriteRenderer sprites={batches.sprites} />
      <BatchParticleRenderer particles={batches.particles} />
    </React.Fragment>
  );
};
```

### Object Pooling for Particles

```typescript
class ParticlePool {
  constructor(maxParticles = 200) {
    this.maxParticles = maxParticles;
    this.particles = [];
    this.activeCount = 0;
  }
  
  acquire() {
    if (this.particles.length > 0) {
      return this.particles.pop();
    }
    return this.createParticle();
  }
  
  release(particle) {
    if (this.activeCount < this.maxParticles) {
      this.particles.push(particle);
    }
  }
  
  createParticle() {
    return {
      position: [0, 0],
      velocity: [0, 0],
      life: 0,
      maxLife: 0,
      active: false
    };
  }
  
  update(dt, entities) {
    const entitiesToUpdate = {};
    
    this.particles.forEach(particle => {
      if (!particle.active) return;
      
      particle.life -= dt;
      
      if (particle.life <= 0) {
        particle.active = false;
        this.release(particle);
      } else {
        particle.position[0] += particle.velocity[0] * dt;
        particle.position[1] += particle.velocity[1] * dt;
        
        const id = `particle_${particle.id}`;
        entitiesToUpdate[id] = {
          position: particle.position,
          renderer: <ParticleRenderer particle={particle} />
        };
      }
    });
    
    return { ...entities, ...entitiesToUpdate };
  }
}
```

## Separation of Game Logic and UI Overlays

### Clean Architecture Pattern

```typescript
// game/GameEngine.tsx - Game Logic
import { GameEngine } from 'react-native-game-engine';

class GameLogic extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      entities: {
        player: {
          position: [100, 200],
          velocity: [0, 0],
          health: 100,
          score: 0,
          renderer: <GamePlayerSprite />
        }
      },
      gameState: 'playing' // 'playing', 'paused', 'gameover'
    };
  }

  // Pure game logic systems
  movementSystem = (entities, { touches }) => {
    // Update positions, velocities
    return entities;
  };

  collisionSystem = (entities) => {
    // Handle collisions
    return entities;
  };

  // Game state management
  gameStateSystem = (entities, { time }) => {
    if (this.state.entities.player.health <= 0) {
      this.setState({ gameState: 'gameover' });
    }
    return entities;
  };

  render() {
    return (
      <GameEngine
        systems={[
          this.movementSystem,
          this.collisionSystem,
          this.gameStateSystem
        ]}
        entities={this.state.entities}
        style={{ flex: 1 }}
      >
        {/* UI Overlays - Separate from game logic */}
        <UIOverlay 
          score={this.state.entities.player.score}
          health={this.state.entities.player.health}
          gameState={this.state.gameState}
        />
      </GameEngine>
    );
  }
}

// UI Components - Pure React Native
class UIOverlay extends React.PureComponent {
  render() {
    const { score, health, gameState } = this.props;
    
    return (
      <View style={styles.overlay}>
        <Text style={styles.score}>Score: {score}</Text>
        <View style={styles.healthBar}>
          <View style={[styles.healthFill, { width: `${health}%` }]} />
        </View>
        
        {gameState === 'gameover' && (
          <GameOverScreen onRestart={() => this.props.onRestart()} />
        )}
        
        {gameState === 'paused' && (
          <PauseMenu onResume={() => this.props.onResume()} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10
  }
});
```

### Event-Driven Communication

```typescript
// Game Engine with Event System
<GameEngine
  systems={[gameLogicSystem]}
  entities={gameEntities}
  onEvent={(event) => {
    // Handle game events
    if (event.type === 'score_changed') {
      this.updateScore(event.value);
    }
    if (event.type === 'level_complete') {
      this.showLevelCompleteUI();
    }
  }}
>
  {/* UI Components listen to events */}
  <ScoreDisplay onScoreChange={this.handleScoreChange} />
  <HealthDisplay onHealthChange={this.handleHealthChange} />
</GameEngine>

// Game Logic System
const gameLogicSystem = (entities, { events, dispatch }) => {
  // When player collects coin
  if (entities.player.score + 10 > entities.player.score) {
    // Dispatch event for UI to react
    dispatch({
      type: 'score_changed',
      value: entities.player.score
    });
  }
  
  return entities;
};
```

## Best Practices Summary

### Do's:
- ✅ Use CES architecture for complex games
- ✅ Keep systems pure and focused on single responsibilities
- ✅ Pool entities and particles for performance
- ✅ Separate game logic from UI overlays
- ✅ Use events for game-to-UI communication
- ✅ Optimize render cycles with batch rendering
- ✅ Profile and monitor frame rates

### Don'ts:
- ❌ Don't use GameEngine for static UI
- ❌ Don't create too many entities (>1000)
- ❌ Don't perform heavy computations in update loops
- ❌ Don't mutate entities directly without consideration
- ❌ Don't forget to clean up sounds and resources
- ❌ Don't block the main thread with synchronous operations

## Common Patterns Reference

### Entity Factory Pattern
```typescript
const createEntity = (type, position) => {
  const base = {
    id: `entity_${Date.now()}`,
    position,
    renderer: null
  };
  
  switch (type) {
    case 'player':
      return {
        ...base,
        velocity: [0, 0],
        health: 100,
        renderer: <PlayerSprite />
      };
    case 'enemy':
      return {
        ...base,
        velocity: [2, 0],
        health: 50,
        renderer: <EnemySprite />
      };
    default:
      return base;
  }
};
```

### State Machine for Game States
```typescript
const gameStateMachine = {
  playing: {
    onEnter: () => startGameMusic(),
    systems: [movementSystem, collisionSystem],
    onExit: () => stopGameMusic()
  },
  paused: {
    onEnter: () => pauseGameMusic(),
    systems: [],
    onExit: () => resumeGameMusic()
  },
  gameover: {
    onEnter: () => playGameOverSound(),
    systems: [],
    onExit: () => stopGameOverSound()
  }
};
```

This skill file provides comprehensive guidance for developing games with react-native-game-engine, covering all essential patterns and best practices for creating performant, maintainable game applications.
