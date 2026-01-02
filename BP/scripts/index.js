import { world, system, BlockVolume } from "@minecraft/server"
import "./events/Handler.js"

console.info("Runtime AntiXray has started.")

let queuePlayers = []
let currentPlayer = ''
const directions = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 }
];
const filter = {
  includeTypes: ["minecraft:iron_ore","minecraft:coal_ore", "minecraft:copper_ore", "minecraft:gold_ore", "minecraft:diamond_ore", "minecraft:emerald_ore", "minecraft:lapis_ore", "minecraft:redstone_ore",
    "minecraft:deepslate_iron_ore", "minecraft:deepslate_coal_ore", "minecraft:deepslate_copper_ore", "minecraft:deepslate_gold_ore", "minecraft:deepslate_diamond_ore", "minecraft:deepslate_emerald_ore", "minecraft:deepslate_lapis_ore", "minecraft:deepslate_redstone_ore",
    "minecraft:quartz_ore", "minecraft:nether_gold_ore", "minecraft:ancient_debris",
  ]
}


//
// North: -180 (135 to -135) (Horizontal: -x and +x, Vertical: -z)
// East: -90 (-135 to -45) (Horizotal: -z and +z, Vertical: +x)
// South: 0 (-45 to 45) (Horizontal: +x and -x, Vertical: +z)
// West:: 90 (45 to 135) (Horizontal: +z and -z, Vertical: -x)

system.runInterval(async () => {
  if(queuePlayers.length < 1) {
    // Thread Maker
    for(const player of world.getPlayers()) {
      queuePlayers.push(player.name)
    }
  } else {
    const player = world.getPlayers().find(p => p.name === queuePlayers[0])
    const rotation = player?.getRotation()?.y
    const dimension = player?.dimension
    if(player?.name === currentPlayer) return;
    if(!player) return queuePlayers.shift();
    currentPlayer = player.name;
    
    if(rotation > 135 || rotation < -135) {
      // North
      for(let i = 1; i <= 5; i++) {
        const volume = new BlockVolume(
          { x: player.location.x -32, y: -62, z: player.location.z - (48*i)},
          { x: player.location.x +32, y: 150, z: player.location.z - (48*(i-1))}
        )
        replacementProcess(volume, dimension)
        await system.waitTicks(1)
      }
    } else if(rotation > -135 && rotation < -45) {
      // East
      for(let i = 1; i <= 5; i++) {
        const volume = new BlockVolume(
          { x: player.location.x + (48*i), y: -62, z: player.location.z - 32 },
          { x: player.location.x + (48*(i-1)), y: 150, z: player.location.z + 32 }
        )
        replacementProcess(volume, dimension)
        await system.waitTicks(1)
      }
    } else if(rotation > -45 && rotation < 45) {
      // Souths
      for(let i = 1; i <= 5; i++) {
        const volume = new BlockVolume(
          { x: player.location.x -32, y: -62, z: player.location.z + (48*i)},
          { x: player.location.x +32, y: 150, z: player.location.z + (48*(i-1))}
        )
        replacementProcess(volume, dimension)
        await system.waitTicks(1)
      }
    } else if(rotation > 45 && rotation < 135) {
      // West
      for(let i = 1; i <= 5; i++) {
        const volume = new BlockVolume(
          { x: player.location.x - (48*i), y: -62, z: player.location.z - 32 },
          { x: player.location.x - (48*(i-1)), y: 150, z: player.location.z + 32 }
        )
        replacementProcess(volume, dimension)
        await system.waitTicks(1)
      }
    }

    currentPlayer = ''
    queuePlayers.shift()
  }
}, 1)

function replacementProcess(volume, dimension) {
  const result = dimension.getBlocks(volume, filter, true);
  for (const block of result.getBlockLocationIterator()) {
    const blockData = dimension.getBlock(block);
    if(isCovered(blockData, dimension)) blockData.setType(blockData.typeId.replace("minecraft:", "essentialcc:"));
  }
}

function isCovered(block, dimension) {
  const { x, y, z } = block.location

  for (const d of directions) {
    const neighbor = dimension.getBlock({
      x: x + d.x,
      y: y + d.y,
      z: z + d.z
    });
    if (!neighbor || neighbor.typeId === "minecraft:air") {
      return false;
    }
  }
  return true;
}


