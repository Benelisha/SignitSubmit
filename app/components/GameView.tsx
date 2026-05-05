import React, { useEffect } from "react"
import { View, StyleSheet, Dimensions } from "react-native"
import { GameEngine } from "react-native-game-engine"

// Define game entities
interface Entity {
  id: string
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  color?: string
  size?: number
}

// Player entity
const createPlayer = (): Entity => ({
  id: "player",
  position: { x: 100, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "#00ff00",
  size: 30,
})

// Enemy entity
const createEnemy = (id: string): Entity => ({
  id,
  position: { x: Math.random() * 300, y: Math.random() * 400 },
  velocity: { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 },
  color: "#ff0000",
  size: 20,
})

// Physics system - updates entity positions
const physicsSystem = {
  update: (entities: Entity[], deltaTime: number) => {
    return entities.map((entity) => ({
        ...entity,
      position: {
        x: entity.position.x + entity.velocity.x * deltaTime,
        y: entity.position.y + entity.velocity.y * deltaTime,
        },
      }))
    },
}

// Collision detection system
const collisionSystem = {
  update: (entities: Entity[]) => {
    return entities.map((entity) => {
      if (entity.id === "player") {
          // Simple boundary collision
        const width = 400
        const height = 600
        return {
            ...entity,
          velocity: {
            x: entity.position.x <= 0 ? Math.abs(entity.velocity.x) : entity.velocity.x,
            y: entity.position.y <= 0 ? Math.abs(entity.velocity.y) : entity.velocity.y,
            },
          }
        }
      return entity
      })
    },
}

// Render system
const renderSystem = {
  update: (entities: Entity[]) => {
    return entities
    },
}

// Main GameView component
export function GameView() {
  const [entities, setEntities] = React.useState<Entity[]>([
    createPlayer(),
    createEnemy("enemy1"),
    createEnemy("enemy2"),
    ])

  const { width, height } = Dimensions.get("window")

  useEffect(() => {
      // Add touch controls for mobile
    const handleTouchStart = (e: any) => {
      const touch = e.touches[0]
      setEntities((prev) =>
        prev.map((entity) => {
          if (entity.id === "player") {
            return {
                ...entity,
              velocity: {
                x: touch.clientX < width / 2 ? -5 : 5,
                y: touch.clientY < height / 2 ? -5 : 5,
                },
              }
            }
          return entity
          }),
        )
     }

    const handleTouchEnd = () => {
      setEntities((prev) =>
        prev.map((entity) => {
          if (entity.id === "player") {
            return {
                ...entity,
              velocity: { x: 0, y: 0 },
              }
            }
          return entity
          }),
        )
     }

    return () => {
        // Cleanup if needed
      }
    }, [width, height])

  return (
      <View style={styles.gameContainer}>
        <GameEngine
        systems={[physicsSystem, collisionSystem, renderSystem]}
        entities={{
          player: {
              ...entities[0],
            render: (entity: Entity) => (
                <View
                style={[
                  styles.entity,
                    {
                    backgroundColor: entity.color,
                    width: entity.size,
                    height: entity.size,
                    left: entity.position.x,
                    top: entity.position.y,
                    },
                 ]}
                />
              ),
            },
          enemy1: {
              ...entities[1],
            render: (entity: Entity) => (
                <View
                style={[
                  styles.entity,
                    {
                    backgroundColor: entity.color,
                    width: entity.size,
                    height: entity.size,
                    left: entity.position.x,
                    top: entity.position.y,
                    },
                 ]}
                />
              ),
            },
          enemy2: {
              ...entities[2],
            render: (entity: Entity) => (
                <View
                style={[
                  styles.entity,
                    {
                    backgroundColor: entity.color,
                    width: entity.size,
                    height: entity.size,
                    left: entity.position.x,
                    top: entity.position.y,
                    },
                 ]}
                />
              ),
            },
          }}
        onUpdate={(dt) => {
          setEntities([
              { ...entities[0], velocity: { x: 0, y: 0 } },
              { ...entities[1], velocity: { x: 1, y: 1 } },
              { ...entities[2], velocity: { x: -1, y: -1 } },
            ])
          }}
        >
          <View
          style={[
            styles.gameArea,
              {
              width: Math.min(400, width - 40),
              height: Math.min(600, height - 200),
              },
            ]}
          >
            {entities.map((entity) => (
              <View
              key={entity.id}
              style={[
                styles.entity,
                  {
                  backgroundColor: entity.color,
                  width: entity.size,
                  height: entity.size,
                  left: entity.position.x,
                  top: entity.position.y,
                  position: "absolute" as const,
                  },
                ]}
              />
            ))}
          </View>
        </GameEngine>
      </View>
    )
}

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    },
  gameArea: {
    width: 400,
    height: 600,
    backgroundColor: "#16213e",
    marginHorizontal: "auto",
    marginTop: 20,
    borderRadius: 8,
    overflow: "hidden",
    },
  entity: {
    position: "absolute" as const,
    borderRadius: 4,
    },
})
