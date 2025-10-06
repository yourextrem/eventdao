import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EventDAO } from "../target/types/eventdao";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("EventDAO Minimal QA Test", () => {
  // Configure the client to use devnet
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.EventDAO as Program<EventDAO>;
  const provider = anchor.getProvider();

  // Test accounts - reuse wallet to save SOL
  let authority: Keypair;
  let organizer: Keypair;
  let buyer: Keypair;

  // PDAs
  let eventDAOPDA: PublicKey;
  let eventPDA: PublicKey;
  let ticketPDA: PublicKey;

  before(async () => {
    // Use existing wallet as authority to save SOL
    authority = provider.wallet as any;
    organizer = Keypair.generate();
    buyer = Keypair.generate();

    // Airdrop minimal SOL to test accounts
    console.log("🪂 Airdropping minimal SOL (0.1 SOL each)...");
    await airdropToAccounts([organizer, buyer], 0.1);

    // Derive PDAs
    [eventDAOPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_dao")],
      program.programId
    );

    console.log("📋 Minimal Test Setup Complete");
    console.log(`Authority: ${authority.publicKey.toBase58()}`);
    console.log(`Organizer: ${organizer.publicKey.toBase58()}`);
    console.log(`Buyer: ${buyer.publicKey.toBase58()}`);
    console.log(`EventDAO PDA: ${eventDAOPDA.toBase58()}`);
  });

  it("Should initialize EventDAO with minimal cost", async () => {
    console.log("🔧 Initializing EventDAO...");
    
    const tx = await program.methods
      .initialize()
      .accounts({
        eventDao: eventDAOPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ EventDAO initialized. Transaction: ${tx}`);
    console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify EventDAO account
    const eventDAOAccount = await program.account.eventDAO.fetch(eventDAOPDA);
    expect(eventDAOAccount.authority.toBase58()).to.equal(authority.publicKey.toBase58());
    expect(eventDAOAccount.totalEvents.toNumber()).to.equal(0);

    console.log("✅ EventDAO account verified");
  });

  it("Should create a minimal event", async () => {
    console.log("🎪 Creating minimal event...");

    // Derive event PDA
    [eventPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), new anchor.BN(0).toArrayLike(Buffer, "le", 4)],
      program.programId
    );

    const tx = await program.methods
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

    console.log(`✅ Event created. Transaction: ${tx}`);
    console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify event account
    const eventAccount = await program.account.event.fetch(eventPDA);
    expect(eventAccount.id.toNumber()).to.equal(0);
    expect(eventAccount.title).to.equal("Minimal Test Event");
    expect(eventAccount.maxParticipants).to.equal(2);
    expect(eventAccount.ticketPrice.toString()).to.equal("10000000"); // 0.01 SOL

    console.log("✅ Event account verified");
  });

  it("Should buy a ticket with minimal cost", async () => {
    console.log("🎫 Buying ticket...");

    // Derive ticket PDA
    [ticketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new anchor.BN(0).toArrayLike(Buffer, "le", 4),
        buyer.publicKey.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .buyTicket()
      .accounts({
        event: eventPDA,
        ticket: ticketPDA,
        buyer: buyer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer])
      .rpc();

    console.log(`✅ Ticket purchased. Transaction: ${tx}`);
    console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify ticket account
    const ticketAccount = await program.account.ticket.fetch(ticketPDA);
    expect(ticketAccount.eventId.toNumber()).to.equal(0);
    expect(ticketAccount.owner.toBase58()).to.equal(buyer.publicKey.toBase58());
    expect(ticketAccount.isUsed).to.be.false;

    // Verify event account updated
    const eventAccount = await program.account.event.fetch(eventPDA);
    expect(eventAccount.currentParticipants).to.equal(1);

    console.log("✅ Ticket account verified");
  });

  it("Should use the ticket (check-in)", async () => {
    console.log("✅ Using ticket (check-in)...");

    const tx = await program.methods
      .useTicket()
      .accounts({
        ticket: ticketPDA,
        user: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();

    console.log(`✅ Ticket used. Transaction: ${tx}`);
    console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify ticket is marked as used
    const ticketAccount = await program.account.ticket.fetch(ticketPDA);
    expect(ticketAccount.isUsed).to.be.true;

    console.log("✅ Ticket usage verified");
  });

  it("Should verify final state", async () => {
    console.log("📊 Verifying final state...");

    // Check EventDAO
    const eventDAOAccount = await program.account.eventDAO.fetch(eventDAOPDA);
    expect(eventDAOAccount.totalEvents.toNumber()).to.equal(1);

    // Check Event
    const eventAccount = await program.account.event.fetch(eventPDA);
    expect(eventAccount.currentParticipants).to.equal(1);

    // Check Ticket
    const ticketAccount = await program.account.ticket.fetch(ticketPDA);
    expect(ticketAccount.isUsed).to.be.true;

    console.log("✅ All final states verified");
    console.log("🎉 Minimal QA Test completed successfully!");
    console.log("💰 Used minimal SOL for testing");
  });
});

// Helper function to airdrop minimal SOL to multiple accounts
async function airdropToAccounts(accounts: Keypair[], solAmount: number): Promise<void> {
  const provider = anchor.getProvider();
  const airdropPromises = accounts.map(async (account) => {
    const signature = await provider.connection.requestAirdrop(
      account.publicKey,
      solAmount * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);
  });
  
  await Promise.all(airdropPromises);
  console.log(`✅ Airdropped ${solAmount} SOL to ${accounts.length} accounts`);
}
