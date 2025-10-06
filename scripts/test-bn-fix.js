// Test script to verify BN fix
const { BN } = require('@coral-xyz/anchor');

console.log("🧪 Testing BN Fix");
console.log("=================");

try {
  // Test creating BN objects
  const maxParticipants = new BN(10);
  const ticketPrice = new BN(10000000); // 0.01 SOL in lamports
  
  console.log("✅ BN objects created successfully:");
  console.log(`Max Participants: ${maxParticipants.toString()}`);
  console.log(`Ticket Price: ${ticketPrice.toString()} lamports`);
  
  // Test toNumber method
  console.log(`Max Participants (number): ${maxParticipants.toNumber()}`);
  console.log(`Ticket Price (number): ${ticketPrice.toNumber()}`);
  
  // Test toArrayLike method (this was causing the error)
  const eventIdBuffer = maxParticipants.toArrayLike(Buffer, 'le', 4);
  console.log(`Event ID Buffer: ${eventIdBuffer.toString('hex')}`);
  
  console.log("\n🎉 All BN operations working correctly!");
  console.log("The TypeError should be fixed now.");
  
} catch (error) {
  console.error("❌ BN test failed:", error.message);
}
