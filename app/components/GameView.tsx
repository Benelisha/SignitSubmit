import React, { useCallback } from "react"
import { View, StyleSheet, Dimensions, TouchableOpacity } from "react-native"
import { GameEngine } from "react-native-game-engine"

// Entity renderer component used by GameEngine — props are spread directly from entity data
const EntityRenderer = ({ color, size, position }: { color?: string; size?: number; position: { x: number; y: number } }) => (
  <View
    style={[
      styles.entity,
      {
        backgroundColor: color || "#fff",
        width: size || 20,
        height: size || 20,
        left: position.x,
        top: position.y,
      },
    ]}
  />
)

// Physics system — moves entities based on velocity
const physicsSystem = (entities: any, { time }: { time: { delta: number } }) => {
  const delta = time.delta / 1000
  return Object.keys(entities).reduce((acc: any, key) => {
    const entity = entities[key]
    if (entity.position && entity.velocity) {
      acc[key] = {
        ...entity,
        position: {
          x: entity.position.x + entity.velocity.x * delta,
          y: entity.position.y + entity.velocity.y * delta,
        },
      }
    } else {
      acc[key] = entity
    }
    return acc
  }, {})
}

// Player control system — handles dispatched touch events
const playerControlSystem = (entities: any, { events }: { events: any[] }) => {
  if (!events || !events.length) return entities
  const player = entities.player
  if (!player) return entities

  let updated = player
  events.forEach((event) => {
    if (event.type === "player-move") {
      updated = { ...updated, velocity: event.velocity }
    } else if (event.type === "player-stop") {
      updated = { ...updated, velocity: { x: 0, y: 0 } }
    }
  })
  return { ...entities, player: updated }
}

// Boundary collision system — keeps entities in the game area
const collisionSystem = (entities: any) => {
  return Object.keys(entities).reduce((acc: any, key) => {
    const entity = entities[key]
    if (entity.position && entity.velocity) {
      acc[key] = {
        ...entity,
        velocity: {
          x: entity.position.x <= 0 ? Math.abs(entity.velocity.x) : entity.velocity.x,
          y: entity.position.y <= 0 ? Math.abs(entity.velocity.y) : entity.velocity.y,
        },
      }
    } else {
      acc[key] = entity
    }
    return acc
  }, {})
}

const SYSTEMS = [playerControlSystem, physicsSystem, collisionSystem]

const INITIAL_ENTITIES = {
  player: {
    position: { x: 100, y: 100 },
    velocity: { x: 0, y: 0 },
    color: "#00ff00",
    size: 30,
    renderer: EntityRenderer,
  },
  enemy1: {
    position: { x: 80, y: 200 },
    velocity: { x: 0, y: 0 },
    color: "#ff0000",
    size: 20,
    renderer: EntityRenderer,
  },
  enemy2: {
    position: { x: 220, y: 300 },
    velocity: { x: 0, y: 0 },
    color: "#ff0000",
    size: 20,
    renderer: EntityRenderer,
  },
}

// Main GameView component
export function GameView() {
  const { width, height } = Dimensions.get("window")
  const gameEngineRef = React.useRef<any>(null)

  const handleTouchStart = useCallback(() => {
    gameEngineRef.current?.dispatch({ type: "player-move", velocity: { x: -5, y: -5 } })
  }, [])

  const handleTouchEnd = useCallback(() => {
    gameEngineRef.current?.dispatch({ type: "player-stop" })
  }, [])

  return (
    <View style={styles.gameContainer}>
      <TouchableOpacity
        style={styles.touchArea}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        activeOpacity={1}
      />
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameArea}
        systems={SYSTEMS}
        entities={INITIAL_ENTITIES}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    ...StyleSheet.absoluteFillObject,
  },
  touchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gameArea: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#16213e",
  },
  entity: {
    position: "absolute" as const,
    borderRadius: 4,
  },
})