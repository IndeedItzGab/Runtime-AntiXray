import { world } from "@minecraft/server"

const directions = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 }
];

// sand, gravy, and etc event (falling block)
world.afterEvents.entitySpawn.subscribe(event => {
  if(event.entity.typeId === "minecraft:falling_block") {
    for(const d of directions) {
      const neighbor = event.entity.dimension.getBlock({
        x: event.entity.location.x - 0.5 + d.x,
        y: Math.ceil(event.entity.location.y) + d.y,
        z: event.entity.location.z - 0.5 + d.z
      })

      if(neighbor?.typeId.includes("essentialcc:")) {
        neighbor.setType(neighbor.typeId.replace("essentialcc:", "minecraft:"))
      }
    }
  }
})