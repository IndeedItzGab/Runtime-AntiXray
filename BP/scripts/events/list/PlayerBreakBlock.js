import { world } from "@minecraft/server"

const directions = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 }
];

world.afterEvents.playerBreakBlock.subscribe(event => {
  const block = event.block
  const dimension = event.dimension

  for(const d of directions) {
    const neighbor = dimension.getBlock({
      x: block.location.x + d.x,
      y: block.location.y + d.y,
      z: block.location.z + d.z
    })

    if(neighbor.typeId.includes("essentialcc:")) {
      neighbor.setType(neighbor.typeId.replace("essentialcc:", "minecraft:"))
    }
  }
})