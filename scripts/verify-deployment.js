const { Connection, PublicKey } = require("@solana/web3.js");

async function verifyDeployment() {
  console.log("🔍 EventDAO Deployment Verification");
  console.log("===================================");
  
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");
  const programId = new PublicKey("8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK");
  
  try {
    // Check if program exists
    const programInfo = await connection.getAccountInfo(programId);
    
    if (programInfo) {
      console.log("✅ Program successfully deployed!");
      console.log(`Program ID: ${programId.toBase58()}`);
      console.log(`Owner: ${programInfo.owner.toBase58()}`);
      console.log(`Data Length: ${programInfo.data.length} bytes`);
      console.log(`Executable: ${programInfo.executable}`);
      
      // Check program balance
      const balance = await connection.getBalance(programId);
      console.log(`Balance: ${balance / 1e9} SOL`);
      
      console.log("\n🔗 View on Solana Explorer:");
      console.log(`https://explorer.solana.com/address/${programId.toBase58()}?cluster=devnet`);
      
      console.log("\n🎉 Deployment verification successful!");
      console.log("Your EventDAO program is ready for testing!");
      
      return true;
    } else {
      console.log("❌ Program not found on devnet");
      return false;
    }
  } catch (error) {
    console.error("❌ Error verifying deployment:", error.message);
    return false;
  }
}

// Run verification
verifyDeployment().then(success => {
  if (success) {
    console.log("\n📋 Next Steps:");
    console.log("1. Your program is deployed and ready");
    console.log("2. You can now test with the frontend");
    console.log("3. Use minimal SOL for testing (0.1 SOL per account)");
    console.log("4. All transactions will be visible on Solana Explorer");
    process.exit(0);
  } else {
    console.log("\n❌ Deployment verification failed");
    process.exit(1);
  }
});
