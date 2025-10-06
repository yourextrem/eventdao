import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { EventDAO } from "../eventdao-anchor/eventdao/target/types/eventdao";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";

/**
 * Manual Testing Scenarios for EventDAO
 * 
 * This script provides individual test functions that can be run manually
 * to test specific scenarios without running the full test suite.
 * 
 * Usage:
 * 1. Deploy the program first: `anchor deploy`
 * 2. Run individual scenarios as needed
 * 3. Check results on Solana Explorer
 */

// Configure the client
anchor.setProvider(anchor.AnchorProvider.env());
const program = anchor.workspace.EventDAO as Program<EventDAO>;
const provider = anchor.getProvider();

// Test accounts
const authority = Keypair.generate();
const organizer = Keypair.generate();
const buyer1 = Keypair.generate();
const buyer2 = Keypair.generate();

// PDAs
const [eventDAOPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("event_dao")],
  program.programId
);

/**
 * Scenario 1: Deploy and Initialize
 * Tests: Program deployment and EventDAO initialization
 */
export async function scenario1_DeployAndInitialize() {
  console.log("🚀 Scenario 1: Deploy and Initialize");
  console.log("=====================================");

  try {
    // Airdrop SOL to authority
    await airdropToAccount(authority.publicKey, 2);
    console.log(`✅ Airdropped 2 SOL to authority: ${authority.publicKey.toBase58()}`);

    // Initialize EventDAO
    const tx = await program.methods
      .initialize()
      .accounts({
        eventDao: eventDAOPDA,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([authority])
      .rpc();

    console.log(`✅ EventDAO initialized`);
    console.log(`Transaction: ${tx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify
    const eventDAOAccount = await program.account.eventDAO.fetch(eventDAOPDA);
    console.log(`✅ Authority: ${eventDAOAccount.authority.toBase58()}`);
    console.log(`✅ Total Events: ${eventDAOAccount.totalEvents.toNumber()}`);

    return { success: true, transaction: tx };
  } catch (error) {
    console.error("❌ Scenario 1 failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Scenario 2: Create Event
 * Tests: Event creation with proper metadata
 */
export async function scenario2_CreateEvent() {
  console.log("🎪 Scenario 2: Create Event");
  console.log("============================");

  try {
    // Airdrop SOL to organizer
    await airdropToAccount(organizer.publicKey, 2);
    console.log(`✅ Airdropped 2 SOL to organizer: ${organizer.publicKey.toBase58()}`);

    // Derive event PDA
    const [eventPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), new anchor.BN(0).toArrayLike(Buffer, "le", 4)],
      program.programId
    );

    const eventData = {
      title: "Blockchain Conference 2024",
      description: "Annual blockchain and Web3 conference featuring industry leaders",
      maxParticipants: 100,
      ticketPrice: new anchor.BN(500000000), // 0.5 SOL
    };

    const tx = await program.methods
      .createEvent(
        eventData.title,
        eventData.description,
        eventData.maxParticipants,
        eventData.ticketPrice
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
    console.log(`Transaction: ${tx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify
    const eventAccount = await program.account.event.fetch(eventPDA);
    console.log(`✅ Event ID: ${eventAccount.id.toNumber()}`);
    console.log(`✅ Title: ${eventAccount.title}`);
    console.log(`✅ Max Participants: ${eventAccount.maxParticipants}`);
    console.log(`✅ Ticket Price: ${eventAccount.ticketPrice.toString()} lamports`);

    return { success: true, transaction: tx, eventPDA };
  } catch (error) {
    console.error("❌ Scenario 2 failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Scenario 3: Buy Ticket
 * Tests: Ticket purchasing functionality
 */
export async function scenario3_BuyTicket(eventPDA: PublicKey) {
  console.log("🎫 Scenario 3: Buy Ticket");
  console.log("=========================");

  try {
    // Airdrop SOL to buyer
    await airdropToAccount(buyer1.publicKey, 2);
    console.log(`✅ Airdropped 2 SOL to buyer: ${buyer1.publicKey.toBase58()}`);

    // Derive ticket PDA
    const [ticketPDA] = PublicKey.findProgramAddressSync(
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

    console.log(`✅ Ticket purchased`);
    console.log(`Transaction: ${tx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify
    const ticketAccount = await program.account.ticket.fetch(ticketPDA);
    console.log(`✅ Ticket Owner: ${ticketAccount.owner.toBase58()}`);
    console.log(`✅ Event ID: ${ticketAccount.eventId.toNumber()}`);
    console.log(`✅ Is Used: ${ticketAccount.isUsed}`);

    // Check event participants
    const eventAccount = await program.account.event.fetch(eventPDA);
    console.log(`✅ Current Participants: ${eventAccount.currentParticipants}`);

    return { success: true, transaction: tx, ticketPDA };
  } catch (error) {
    console.error("❌ Scenario 3 failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Scenario 4: Use Ticket
 * Tests: Ticket usage (check-in) functionality
 */
export async function scenario4_UseTicket(ticketPDA: PublicKey) {
  console.log("✅ Scenario 4: Use Ticket");
  console.log("==========================");

  try {
    const tx = await program.methods
      .useTicket()
      .accounts({
        ticket: ticketPDA,
        user: buyer1.publicKey,
      })
      .signers([buyer1])
      .rpc();

    console.log(`✅ Ticket used (check-in completed)`);
    console.log(`Transaction: ${tx}`);
    console.log(`🔗 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

    // Verify
    const ticketAccount = await program.account.ticket.fetch(ticketPDA);
    console.log(`✅ Ticket is now used: ${ticketAccount.isUsed}`);

    return { success: true, transaction: tx };
  } catch (error) {
    console.error("❌ Scenario 4 failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Scenario 5: Edge Case - Sold Out Event
 * Tests: Error handling when event is sold out
 */
export async function scenario5_SoldOutEvent(eventPDA: PublicKey) {
  console.log("🚫 Scenario 5: Sold Out Event");
  console.log("==============================");

  try {
    // Create a small event (max 1 participant)
    const [smallEventPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("event"), new anchor.BN(1).toArrayLike(Buffer, "le", 4)],
      program.programId
    );

    // Create small event
    await program.methods
      .createEvent(
        "Small Event",
        "Event with only 1 ticket",
        1, // Max 1 participant
        new anchor.BN(100000000) // 0.1 SOL
      )
      .accounts({
        eventDao: eventDAOPDA,
        event: smallEventPDA,
        organizer: organizer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([organizer])
      .rpc();

    console.log("✅ Small event created (max 1 participant)");

    // Buy the first (and only) ticket
    const [firstTicketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new anchor.BN(1).toArrayLike(Buffer, "le", 4),
        buyer1.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .buyTicket()
      .accounts({
        event: smallEventPDA,
        ticket: firstTicketPDA,
        buyer: buyer1.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([buyer1])
      .rpc();

    console.log("✅ First ticket purchased (event now sold out)");

    // Try to buy a second ticket (should fail)
    const [secondTicketPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("ticket"),
        new anchor.BN(1).toArrayLike(Buffer, "le", 4),
        buyer2.publicKey.toBuffer(),
      ],
      program.programId
    );

    try {
      await program.methods
        .buyTicket()
        .accounts({
          event: smallEventPDA,
          ticket: secondTicketPDA,
          buyer: buyer2.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([buyer2])
        .rpc();

      console.log("❌ ERROR: Should have failed for sold out event");
      return { success: false, error: "Expected failure but succeeded" };
    } catch (error) {
      console.log("✅ Correctly failed to buy ticket for sold out event");
      console.log(`Error: ${error.message}`);
      return { success: true, error: error.message };
    }
  } catch (error) {
    console.error("❌ Scenario 5 failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Scenario 6: Edge Case - Wrong Wallet
 * Tests: Error handling when wrong wallet tries to use ticket
 */
export async function scenario6_WrongWallet(ticketPDA: PublicKey) {
  console.log("🚫 Scenario 6: Wrong Wallet");
  console.log("============================");

  try {
    const wrongWallet = Keypair.generate();
    await airdropToAccount(wrongWallet.publicKey, 1);

    try {
      await program.methods
        .useTicket()
        .accounts({
          ticket: ticketPDA, // This ticket belongs to buyer1
          user: wrongWallet.publicKey, // But we're using wrongWallet
        })
        .signers([wrongWallet])
        .rpc();

      console.log("❌ ERROR: Should have failed for wrong wallet");
      return { success: false, error: "Expected failure but succeeded" };
    } catch (error) {
      console.log("✅ Correctly failed to use ticket with wrong wallet");
      console.log(`Error: ${error.message}`);
      return { success: true, error: error.message };
    }
  } catch (error) {
    console.error("❌ Scenario 6 failed:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper function to airdrop SOL to an account
 */
async function airdropToAccount(publicKey: PublicKey, solAmount: number): Promise<void> {
  const signature = await provider.connection.requestAirdrop(
    publicKey,
    solAmount * anchor.web3.LAMPORTS_PER_SOL
  );
  await provider.connection.confirmTransaction(signature);
}

/**
 * Run all scenarios in sequence
 */
export async function runAllScenarios() {
  console.log("🎯 Running All Manual Test Scenarios");
  console.log("=====================================");

  const results = [];

  // Scenario 1: Deploy and Initialize
  const result1 = await scenario1_DeployAndInitialize();
  results.push({ scenario: "Deploy and Initialize", ...result1 });

  if (!result1.success) {
    console.log("❌ Stopping tests due to initialization failure");
    return results;
  }

  // Scenario 2: Create Event
  const result2 = await scenario2_CreateEvent();
  results.push({ scenario: "Create Event", ...result2 });

  if (!result2.success) {
    console.log("❌ Stopping tests due to event creation failure");
    return results;
  }

  // Scenario 3: Buy Ticket
  const result3 = await scenario3_BuyTicket(result2.eventPDA);
  results.push({ scenario: "Buy Ticket", ...result3 });

  if (!result3.success) {
    console.log("❌ Stopping tests due to ticket purchase failure");
    return results;
  }

  // Scenario 4: Use Ticket
  const result4 = await scenario4_UseTicket(result3.ticketPDA);
  results.push({ scenario: "Use Ticket", ...result4 });

  // Scenario 5: Sold Out Event
  const result5 = await scenario5_SoldOutEvent(result2.eventPDA);
  results.push({ scenario: "Sold Out Event", ...result5 });

  // Scenario 6: Wrong Wallet
  const result6 = await scenario6_WrongWallet(result3.ticketPDA);
  results.push({ scenario: "Wrong Wallet", ...result6 });

  // Summary
  console.log("\n📊 Test Results Summary");
  console.log("========================");
  results.forEach((result, index) => {
    const status = result.success ? "✅ PASS" : "❌ FAIL";
    console.log(`${index + 1}. ${result.scenario}: ${status}`);
    if (result.transaction) {
      console.log(`   Transaction: ${result.transaction}`);
    }
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });

  const passedTests = results.filter(r => r.success).length;
  console.log(`\n🎉 ${passedTests}/${results.length} tests passed`);

  return results;
}
