import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

// Configure the client
anchor.setProvider(anchor.AnchorProvider.env());
const provider = anchor.getProvider();

// Program ID from our deployment
const PROGRAM_ID = new PublicKey("8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK");

// Load the IDL
const idl = require("../eventdao-anchor/eventdao/target/idl/eventdao.json");
const program = new Program(idl, PROGRAM_ID, provider);

async function simpleTest() {
  console.log("🧪 Simple EventDAO Test");
  console.log("=======================");
  console.log(`Program ID: ${PROGRAM_ID.toBase58()}`);
  console.log(`Wallet: ${provider.wallet.publicKey.toBase58()}`);
  console.log(`Cluster: ${provider.connection.rpcEndpoint}`);
  
  try {
    // Test accounts
    const authority = Keypair.generate();
    const organizer = Keypair.generate();
    const buyer = Keypair.generate();
    
    console.log("\n🪂 Airdropping SOL to test accounts...");
    
    // Airdrop SOL to test accounts
    await airdropToAccount(authority.publicKey, 1);
    await airdropToAccount(organizer.publicKey, 1);
    await airdropToAccount(buyer.publicKey, 1);
    
    console.log("✅ Airdrop completed");
    
    // Derive PDAs
    const [eventDAOPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_dao")],
      PROGRAM_ID
    );
    
    console.log(`\n🔧 Initializing EventDAO...`);
    console.log(`EventDAO PDA: ${eventDAOPDA.toBase58()}`);
    
    // Initialize EventDAO
    const initTx = await program.methods
      .initialize()
      .accounts({
        eventDao: eventDAOPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();
    
    console.log(`✅ EventDAO initialized`);
    console.log(`Transaction: ${initTx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${initTx}?cluster=devnet`);
    
    // Verify EventDAO
    const eventDAOAccount = await program.account.eventDAO.fetch(eventDAOPDA);
    console.log(`✅ Authority: ${eventDAOAccount.authority.toBase58()}`);
    console.log(`✅ Total Events: ${eventDAOAccount.totalEvents.toNumber()}`);
    
    // Create Event
    const [eventPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), new anchor.BN(0).toArrayLike(Buffer, "le", 4)],
      PROGRAM_ID
    );
    
    console.log(`\n🎪 Creating event...`);
    console.log(`Event PDA: ${eventPDA.toBase58()}`);
    
    const createTx = await program.methods
      .createEvent(
        "Test Event 2024",
        "This is a test event for QA testing",
        10, // max participants
        new anchor.BN(100000000) // 0.1 SOL
      )
      .accounts({
        eventDao: eventDAOPDA,
        event: eventPDA,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();
    
    console.log(`✅ Event created`);
    console.log(`Transaction: ${createTx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${createTx}?cluster=devnet`);
    
    // Verify Event
    const eventAccount = await program.account.event.fetch(eventPDA);
    console.log(`✅ Event ID: ${eventAccount.id.toNumber()}`);
    console.log(`✅ Title: ${eventAccount.title}`);
    console.log(`✅ Max Participants: ${eventAccount.maxParticipants}`);
    console.log(`✅ Current Participants: ${eventAccount.currentParticipants}`);
    
    // Buy Ticket
    const [ticketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new anchor.BN(0).toArrayLike(Buffer, "le", 4),
        buyer.publicKey.toBuffer(),
      ],
      PROGRAM_ID
    );
    
    console.log(`\n🎫 Buying ticket...`);
    console.log(`Ticket PDA: ${ticketPDA.toBase58()}`);
    
    const buyTx = await program.methods
      .buyTicket()
      .accounts({
        event: eventPDA,
        ticket: ticketPDA,
        buyer: buyer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();
    
    console.log(`✅ Ticket purchased`);
    console.log(`Transaction: ${buyTx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${buyTx}?cluster=devnet`);
    
    // Verify Ticket
    const ticketAccount = await program.account.ticket.fetch(ticketPDA);
    console.log(`✅ Ticket Owner: ${ticketAccount.owner.toBase58()}`);
    console.log(`✅ Event ID: ${ticketAccount.eventId.toNumber()}`);
    console.log(`✅ Is Used: ${ticketAccount.isUsed}`);
    
    // Use Ticket
    console.log(`\n✅ Using ticket (check-in)...`);
    
    const useTx = await program.methods
      .useTicket()
      .accounts({
        ticket: ticketPDA,
        user: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();
    
    console.log(`✅ Ticket used`);
    console.log(`Transaction: ${useTx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${useTx}?cluster=devnet`);
    
    // Verify final state
    const finalTicketAccount = await program.account.ticket.fetch(ticketPDA);
    console.log(`✅ Ticket is now used: ${finalTicketAccount.isUsed}`);
    
    const finalEventAccount = await program.account.event.fetch(eventPDA);
    console.log(`✅ Event participants: ${finalEventAccount.currentParticipants}`);
    
    console.log("\n🎉 All tests passed successfully!");
    console.log("\n📊 Test Summary:");
    console.log("✅ Program deployed to devnet");
    console.log("✅ EventDAO initialized");
    console.log("✅ Event created");
    console.log("✅ Ticket purchased");
    console.log("✅ Ticket used (check-in)");
    
    return { success: true };
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to airdrop SOL
async function airdropToAccount(publicKey: PublicKey, solAmount: number): Promise<void> {
  const signature = await provider.connection.requestAirdrop(
    publicKey,
    solAmount * anchor.web3.LAMPORTS_PER_SOL
  );
  await provider.connection.confirmTransaction(signature);
}

// Run the test
simpleTest().then(result => {
  if (result.success) {
    console.log("\n🎉 QA Testing completed successfully!");
    process.exit(0);
  } else {
    console.log("\n❌ QA Testing failed!");
    process.exit(1);
  }
});
