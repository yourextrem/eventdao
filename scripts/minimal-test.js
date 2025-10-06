const anchor = require("@coral-xyz/anchor");
const { PublicKey, Keypair, SystemProgram } = require("@solana/web3.js");

// Configure the client
anchor.setProvider(anchor.AnchorProvider.env());
const provider = anchor.getProvider();

// Program ID from our deployment
const PROGRAM_ID = new PublicKey("8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK");

// Load the IDL
const idl = require("../eventdao-anchor/eventdao/target/idl/eventdao.json");
const program = new anchor.Program(idl, PROGRAM_ID, provider);

async function minimalTest() {
  console.log("🧪 Minimal EventDAO Test (Cost-Effective)");
  console.log("==========================================");
  console.log(`Program ID: ${PROGRAM_ID.toBase58()}`);
  console.log(`Wallet: ${provider.wallet.publicKey.toBase58()}`);
  console.log(`Balance: ${(await provider.connection.getBalance(provider.wallet.publicKey)) / 1e9} SOL`);
  
  try {
    // Use existing wallet as authority to save SOL
    const authority = provider.wallet;
    const organizer = Keypair.generate();
    const buyer = Keypair.generate();
    
    console.log("\n🪂 Airdropping minimal SOL (0.1 SOL each)...");
    
    // Airdrop minimal SOL to test accounts
    await airdropToAccount(organizer.publicKey, 0.1);
    await airdropToAccount(buyer.publicKey, 0.1);
    
    console.log("✅ Minimal airdrop completed");
    
    // Derive PDAs
    const [eventDAOPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_dao")],
      PROGRAM_ID
    );
    
    console.log(`\n🔧 Initializing EventDAO...`);
    console.log(`EventDAO PDA: ${eventDAOPDA.toBase58()}`);
    
    // Initialize EventDAO (using existing wallet to save SOL)
    const initTx = await program.methods
      .initialize()
      .accounts({
        eventDao: eventDAOPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
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
        "Minimal Test Event",
        "Cost-effective test event",
        2, // Small max participants
        new anchor.BN(10000000) // 0.01 SOL (very cheap)
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
    console.log(`✅ Ticket Price: ${eventAccount.ticketPrice.toString()} lamports (${eventAccount.ticketPrice.toNumber() / 1e9} SOL)`);
    
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
    
    // Check final balance
    const finalBalance = await provider.connection.getBalance(provider.wallet.publicKey);
    console.log(`\n💰 Final wallet balance: ${finalBalance / 1e9} SOL`);
    
    console.log("\n🎉 All tests passed successfully!");
    console.log("\n📊 Test Summary:");
    console.log("✅ Program deployed to devnet");
    console.log("✅ EventDAO initialized");
    console.log("✅ Event created");
    console.log("✅ Ticket purchased");
    console.log("✅ Ticket used (check-in)");
    console.log("💰 Used minimal SOL for testing");
    
    return { success: true };
    
  } catch (error) {
    console.error("❌ Test failed:", error);
    return { success: false, error: error.message };
  }
}

// Helper function to airdrop minimal SOL
async function airdropToAccount(publicKey, solAmount) {
  const signature = await provider.connection.requestAirdrop(
    publicKey,
    solAmount * anchor.web3.LAMPORTS_PER_SOL
  );
  await provider.connection.confirmTransaction(signature);
}

// Run the test
minimalTest().then(result => {
  if (result.success) {
    console.log("\n🎉 Minimal QA Testing completed successfully!");
    process.exit(0);
  } else {
    console.log("\n❌ Minimal QA Testing failed!");
    process.exit(1);
  }
});
