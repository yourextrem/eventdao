import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

// Use the already deployed program
const PROGRAM_ID = new PublicKey("8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK");

describe("EventDAO - Use Existing Program", () => {
  let program: Program;
  let provider: anchor.AnchorProvider;
  let authority: Keypair;
  let organizer: Keypair;
  let buyer: Keypair;

  before(async () => {
    // Configure the client
    provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Load the IDL and create program instance
    const idl = require("../target/idl/eventdao.json");
    program = new Program(idl, PROGRAM_ID, provider);

    // Use existing wallet as authority to save SOL
    authority = provider.wallet as any;
    organizer = Keypair.generate();
    buyer = Keypair.generate();

    console.log("📋 Using Existing Program");
    console.log(`Program ID: ${PROGRAM_ID.toBase58()}`);
    console.log(`Authority: ${authority.publicKey.toBase58()}`);
    console.log(`Organizer: ${organizer.publicKey.toBase58()}`);
    console.log(`Buyer: ${buyer.publicKey.toBase58()}`);
  });

  it("Should airdrop minimal SOL to test accounts", async () => {
    console.log("🪂 Airdropping minimal SOL (0.1 SOL each)...");
    
    await airdropToAccount(organizer.publicKey, 0.1);
    await airdropToAccount(buyer.publicKey, 0.1);
    
    console.log("✅ Minimal airdrop completed");
  });

  it("Should initialize EventDAO", async () => {
    console.log("🔧 Initializing EventDAO...");
    
    const [eventDAOPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_dao")],
      PROGRAM_ID
    );

    const tx = await program.methods
      .initialize()
      .accounts({
        eventDao: eventDAOPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log(`✅ EventDAO initialized. Transaction: ${tx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify EventDAO account
    const eventDAOAccount = await program.account.eventDAO.fetch(eventDAOPDA);
    expect(eventDAOAccount.authority.toBase58()).to.equal(authority.publicKey.toBase58());
    expect(eventDAOAccount.totalEvents.toNumber()).to.equal(0);

    console.log("✅ EventDAO account verified");
  });

  it("Should create a minimal event", async () => {
    console.log("🎪 Creating minimal event...");

    const [eventDAOPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_dao")],
      PROGRAM_ID
    );

    const [eventPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), new anchor.BN(0).toArrayLike(Buffer, "le", 4)],
      PROGRAM_ID
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
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify event account
    const eventAccount = await program.account.event.fetch(eventPDA);
    expect(eventAccount.id.toNumber()).to.equal(0);
    expect(eventAccount.title).to.equal("Minimal Test Event");
    expect(eventAccount.maxParticipants).to.equal(2);
    expect(eventAccount.ticketPrice.toString()).to.equal("10000000"); // 0.01 SOL

    console.log("✅ Event account verified");
  });

  it("Should buy a ticket", async () => {
    console.log("🎫 Buying ticket...");

    const [eventPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), new anchor.BN(0).toArrayLike(Buffer, "le", 4)],
      PROGRAM_ID
    );

    const [ticketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new anchor.BN(0).toArrayLike(Buffer, "le", 4),
        buyer.publicKey.toBuffer(),
      ],
      PROGRAM_ID
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
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

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

  it("Should use the ticket", async () => {
    console.log("✅ Using ticket (check-in)...");

    const [ticketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new anchor.BN(0).toArrayLike(Buffer, "le", 4),
        buyer.publicKey.toBuffer(),
      ],
      PROGRAM_ID
    );

    const tx = await program.methods
      .useTicket()
      .accounts({
        ticket: ticketPDA,
        user: buyer.publicKey,
      })
      .signers([buyer])
      .rpc();

    console.log(`✅ Ticket used. Transaction: ${tx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify ticket is marked as used
    const ticketAccount = await program.account.ticket.fetch(ticketPDA);
    expect(ticketAccount.isUsed).to.be.true;

    console.log("✅ Ticket usage verified");
  });

  it("Should verify final state", async () => {
    console.log("📊 Verifying final state...");

    const [eventDAOPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_dao")],
      PROGRAM_ID
    );

    const [eventPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), new anchor.BN(0).toArrayLike(Buffer, "le", 4)],
      PROGRAM_ID
    );

    const [ticketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new anchor.BN(0).toArrayLike(Buffer, "le", 4),
        buyer.publicKey.toBuffer(),
      ],
      PROGRAM_ID
    );

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

// Helper function to airdrop minimal SOL
async function airdropToAccount(publicKey: PublicKey, solAmount: number): Promise<void> {
  const provider = anchor.getProvider();
  const signature = await provider.connection.requestAirdrop(
    publicKey,
    solAmount * anchor.web3.LAMPORTS_PER_SOL
  );
  await provider.connection.confirmTransaction(signature);
}
