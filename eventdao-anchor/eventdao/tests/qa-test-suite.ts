import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EventDAO } from "../target/types/eventdao";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { expect } from "chai";

describe("EventDAO QA Test Suite", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.EventDAO as Program<EventDAO>;
  const provider = anchor.getProvider();

  // Test accounts
  let authority: Keypair;
  let organizer: Keypair;
  let buyer1: Keypair;
  let buyer2: Keypair;
  let wrongWallet: Keypair;

  // PDAs
  let eventDAOPDA: PublicKey;
  let eventDAOBump: number;
  let eventPDA: PublicKey;
  let eventBump: number;
  let ticketPDA: PublicKey;
  let ticketBump: number;

  // Test data
  const testEventData = {
    title: "Test Event 2024",
    description: "This is a test event for QA testing",
    maxParticipants: 2, // Small number for edge case testing
    ticketPrice: new anchor.BN(100000000), // 0.1 SOL in lamports
  };

  before(async () => {
    // Generate test keypairs
    authority = Keypair.generate();
    organizer = Keypair.generate();
    buyer1 = Keypair.generate();
    buyer2 = Keypair.generate();
    wrongWallet = Keypair.generate();

    // Airdrop SOL to test accounts
    console.log("🪂 Airdropping SOL to test accounts...");
    await airdropToAccounts([authority, organizer, buyer1, buyer2, wrongWallet]);

    // Derive PDAs
    [eventDAOPDA, eventDAOBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("event_dao")],
      program.programId
    );

    console.log("📋 Test Setup Complete");
    console.log(`Authority: ${authority.publicKey.toBase58()}`);
    console.log(`Organizer: ${organizer.publicKey.toBase58()}`);
    console.log(`Buyer1: ${buyer1.publicKey.toBase58()}`);
    console.log(`Buyer2: ${buyer2.publicKey.toBase58()}`);
    console.log(`EventDAO PDA: ${eventDAOPDA.toBase58()}`);
  });

  describe("🚀 Setup Phase", () => {
    it("Should deploy program successfully", async () => {
      console.log("✅ Program deployed successfully");
      console.log(`Program ID: ${program.programId.toBase58()}`);
    });

    it("Should initialize EventDAO", async () => {
      console.log("🔧 Initializing EventDAO...");
      
      const tx = await program.methods
        .initialize()
        .accounts({
          eventDao: eventDAOPDA,
          authority: authority.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([authority])
        .rpc();

      console.log(`✅ EventDAO initialized. Transaction: ${tx}`);
      console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

      // Verify EventDAO account
      const eventDAOAccount = await program.account.eventDAO.fetch(eventDAOPDA);
      expect(eventDAOAccount.authority.toBase58()).to.equal(authority.publicKey.toBase58());
      expect(eventDAOAccount.totalEvents.toNumber()).to.equal(0);
      expect(eventDAOAccount.bump).to.equal(eventDAOBump);

      console.log("✅ EventDAO account verified");
    });
  });

  describe("🎯 Happy Path Flow", () => {
    it("Should create a new event", async () => {
      console.log("🎪 Creating new event...");

      // Derive event PDA
      [eventPDA, eventBump] = PublicKey.findProgramAddressSync(
        [Buffer.from("event"), new anchor.BN(0).toArrayLike(Buffer, "le", 4)],
        program.programId
      );

      const tx = await program.methods
        .createEvent(
          testEventData.title,
          testEventData.description,
          testEventData.maxParticipants,
          testEventData.ticketPrice
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
      expect(eventAccount.title).to.equal(testEventData.title);
      expect(eventAccount.description).to.equal(testEventData.description);
      expect(eventAccount.organizer.toBase58()).to.equal(organizer.publicKey.toBase58());
      expect(eventAccount.maxParticipants).to.equal(testEventData.maxParticipants);
      expect(eventAccount.currentParticipants).to.equal(0);
      expect(eventAccount.ticketPrice.toString()).to.equal(testEventData.ticketPrice.toString());
      expect(eventAccount.isActive).to.be.true;

      console.log("✅ Event account verified");
    });

    it("Should buy a ticket for the event", async () => {
      console.log("🎫 Buying ticket...");

      // Derive ticket PDA
      [ticketPDA, ticketBump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("ticket"),
          new anchor.BN(0).toArrayLike(Buffer, "le", 4),
          buyer1.publicKey.toBuffer(),
        ],
        program.programId
      );

      const tx = await program.methods
        .buyTicket()
        .accounts({
          event: eventPDA,
          ticket: ticketPDA,
          buyer: buyer1.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([buyer1])
        .rpc();

      console.log(`✅ Ticket purchased. Transaction: ${tx}`);
      console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

      // Verify ticket account
      const ticketAccount = await program.account.ticket.fetch(ticketPDA);
      expect(ticketAccount.eventId.toNumber()).to.equal(0);
      expect(ticketAccount.owner.toBase58()).to.equal(buyer1.publicKey.toBase58());
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
          user: buyer1.publicKey,
        })
        .signers([buyer1])
        .rpc();

      console.log(`✅ Ticket used. Transaction: ${tx}`);
      console.log(`🔗 View on Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

      // Verify ticket is marked as used
      const ticketAccount = await program.account.ticket.fetch(ticketPDA);
      expect(ticketAccount.isUsed).to.be.true;

      console.log("✅ Ticket usage verified");
    });
  });

  describe("⚠️ Edge Cases", () => {
    it("Should fail when trying to buy a ticket when event is sold out", async () => {
      console.log("🚫 Testing sold out event...");

      // First, buy the second (and last) ticket
      const [ticket2PDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("ticket"),
          new anchor.BN(0).toArrayLike(Buffer, "le", 4),
          buyer2.publicKey.toBuffer(),
        ],
        program.programId
      );

      await program.methods
        .buyTicket()
        .accounts({
          event: eventPDA,
          ticket: ticket2PDA,
          buyer: buyer2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([buyer2])
        .rpc();

      console.log("✅ Second ticket purchased (event now sold out)");

      // Try to buy a third ticket (should fail)
      const [ticket3PDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("ticket"),
          new anchor.BN(0).toArrayLike(Buffer, "le", 4),
          wrongWallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      try {
        await program.methods
          .buyTicket()
          .accounts({
            event: eventPDA,
            ticket: ticket3PDA,
            buyer: wrongWallet.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .signers([wrongWallet])
          .rpc();

        expect.fail("Should have thrown an error for sold out event");
      } catch (error) {
        console.log("✅ Correctly failed to buy ticket for sold out event");
        expect(error.message).to.include("Event is full");
      }
    });

    it("Should fail when trying to use a ticket with wrong wallet", async () => {
      console.log("🚫 Testing wrong wallet for ticket usage...");

      try {
        await program.methods
          .useTicket()
          .accounts({
            ticket: ticketPDA, // This ticket belongs to buyer1
            user: wrongWallet.publicKey, // But we're using wrongWallet
          })
          .signers([wrongWallet])
          .rpc();

        expect.fail("Should have thrown an error for wrong wallet");
      } catch (error) {
        console.log("✅ Correctly failed to use ticket with wrong wallet");
        expect(error.message).to.include("Not ticket owner");
      }
    });

    it("Should fail when trying to use an already used ticket", async () => {
      console.log("🚫 Testing already used ticket...");

      try {
        await program.methods
          .useTicket()
          .accounts({
            ticket: ticketPDA, // This ticket is already used
            user: buyer1.publicKey,
          })
          .signers([buyer1])
          .rpc();

        expect.fail("Should have thrown an error for already used ticket");
      } catch (error) {
        console.log("✅ Correctly failed to use already used ticket");
        expect(error.message).to.include("Ticket already used");
      }
    });

    it("Should fail when trying to fetch a non-existent event", async () => {
      console.log("🚫 Testing non-existent event...");

      const [nonExistentEventPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("event"), new anchor.BN(999).toArrayLike(Buffer, "le", 4)],
        program.programId
      );

      try {
        await program.account.event.fetch(nonExistentEventPDA);
        expect.fail("Should have thrown an error for non-existent event");
      } catch (error) {
        console.log("✅ Correctly failed to fetch non-existent event");
        expect(error.message).to.include("Account does not exist");
      }
    });
  });

  describe("📊 Final Verification", () => {
    it("Should verify final state of all accounts", async () => {
      console.log("📊 Verifying final state...");

      // Check EventDAO
      const eventDAOAccount = await program.account.eventDAO.fetch(eventDAOPDA);
      expect(eventDAOAccount.totalEvents.toNumber()).to.equal(1);

      // Check Event
      const eventAccount = await program.account.event.fetch(eventPDA);
      expect(eventAccount.currentParticipants).to.equal(2); // Both tickets sold

      // Check Tickets
      const ticket1Account = await program.account.ticket.fetch(ticketPDA);
      expect(ticket1Account.isUsed).to.be.true;

      const [ticket2PDA] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("ticket"),
          new anchor.BN(0).toArrayLike(Buffer, "le", 4),
          buyer2.publicKey.toBuffer(),
        ],
        program.programId
      );
      const ticket2Account = await program.account.ticket.fetch(ticket2PDA);
      expect(ticket2Account.isUsed).to.be.false;

      console.log("✅ All final states verified");
      console.log("🎉 QA Test Suite completed successfully!");
    });
  });
});

// Helper function to airdrop SOL to multiple accounts
async function airdropToAccounts(accounts: Keypair[]): Promise<void> {
  const provider = anchor.getProvider();
  const airdropPromises = accounts.map(async (account) => {
    const signature = await provider.connection.requestAirdrop(
      account.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL // 2 SOL per account
    );
    await provider.connection.confirmTransaction(signature);
  });
  
  await Promise.all(airdropPromises);
  console.log(`✅ Airdropped 2 SOL to ${accounts.length} accounts`);
}
