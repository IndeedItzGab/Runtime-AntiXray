import { world, system } from "@minecraft/server"

const directions = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 }
];

// For ancient debris only (explosion)
world.beforeEvents.explosion.subscribe(event => {
  const impactedBlocks = event.getImpactedBlocks();
  event.setImpactedBlocks(impactedBlocks.filter(b => b.typeId !== "essentialcc:ancient_debris"))
  
  for(const block of impactedBlocks) {
    if(block.typeId === "essentialcc:ancient_debris") {
      system.run(() => block.setType("minecraft:ancient_debris"));
    }
  }
})

// For the after mat of the explosion
world.afterEvents.explosion.subscribe(event => {
  const impactedBlocks = event.getImpactedBlocks();
  

  for(const block of impactedBlocks) {
    for(const d of directions) {
      const neighbor = event.dimension.getBlock({
        x: block.location.x + d.x,
        y: block.location.y + d.y,
        z: block.location.z + d.z
      })

      if(impactedBlocks.some(b => b.location === neighbor.location)) continue;
      if(neighbor.typeId.includes("essentialcc:")) {
        neighbor.setType(neighbor.typeId.replace("essentialcc:", "minecraft:"))
      }
    }

  }
})