import { world, BlockVolume, system } from "@minecraft/server";

const volumeQueue = [];
const directions = [
  { x: 1, y: 0, z: 0 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 1, z: 0 },
  { x: 0, y: -1, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: 0, y: 0, z: -1 }
];

system.runInterval(() => {
  if (volumeQueue.length === 0) {
    for (const player of world.getPlayers()) enqueuePlayerChunks(player);
    return;
  }

  const { cx, cz } = volumeQueue.shift();

  const dimension = world.getPlayers()[0].dimension;
  const volume = new BlockVolume(
    { x: cx * 16, y: -62, z: cz * 16 },
    { x: cx * 16 + 15, y: 150, z: cz * 16 + 15 }
  );

  const result = dimension.getBlocks(volume, { includeTypes: ["minecraft:iron_ore","minecraft:coal_ore", "minecraft:copper_ore", "minecraft:gold_ore", "minecraft:diamond_ore", "minecraft:emerald_ore", "minecraft:lapis_ore", "minecraft:redstone_ore",
    "minecraft:deepslate_iron_ore", "minecraft:deepslate_coal_ore", "minecraft:deepslate_copper_ore", "minecraft:deepslate_gold_ore", "minecraft:deepslate_diamond_ore", "minecraft:deepslate_emerald_ore", "minecraft:deepslate_lapis_ore", "minecraft:deepslate_redstone_ore",
    "minecraft:quartz_ore", "minecraft:nether_gold_ore", "minecraft:ancient_debris",
  ] }, true);

  for (const block of result.getBlockLocationIterator()) {
    const blockData = dimension.getBlock(block);
    if(isCovered(blockData, dimension)) blockData.setType(blockData.typeId.replace("minecraft:", "essentialcc:"));
  }
});

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

function enqueuePlayerChunks(player) {
  const pos = player.location;
  const chunkX = Math.floor(pos.x / 16);
  const chunkZ = Math.floor(pos.z / 16);
  const R = 8;

  for (let dx = -R; dx <= R; dx++) {
    for (let dz = -R; dz <= R; dz++) {
      volumeQueue.push({ cx: chunkX + dx, cz: chunkZ + dz, dimension: player.dimension.id});
    }
  }
}