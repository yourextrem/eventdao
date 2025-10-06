# EventDAO QA Testing Guide

## 🎯 Overview
This guide provides comprehensive testing procedures for the EventDAO project on Solana devnet.

## 📋 Prerequisites

### 1. Environment Setup
```bash
# Ensure you're in WSL Ubuntu
cd /home/nicholas/projects/eventdao

# Check Solana CLI configuration
solana config get

# Set to devnet if not already
solana config set --url devnet

# Check wallet balance
solana balance
```

### 2. Required Tools
- Solana CLI (v1.18+)
- Anchor CLI (v0.30+)
- Node.js (v18+)
- TypeScript

## 🚀 Quick Start Testing

### Option 1: Automated Full Test Suite
```bash
# Run the complete automated test suite
./scripts/deploy-and-test.sh
```

### Option 2: Manual Step-by-Step Testing
```bash
# 1. Deploy program
cd eventdao-anchor/eventdao
anchor deploy

# 2. Run specific test scenarios
anchor test --skip-local-validator
```

## 📊 Test Scenarios

### 🟢 Happy Path Flow
1. **Deploy Program** → Verify deployment on Explorer
2. **Initialize EventDAO** → Check authority and total events
3. **Create Event** → Verify event metadata and PDA
4. **Buy Ticket** → Check ticket ownership and event participants
5. **Use Ticket** → Verify ticket is marked as used

### 🔴 Edge Cases
1. **Sold Out Event** → Attempt to buy ticket when max participants reached
2. **Wrong Wallet** → Try to use ticket with different wallet
3. **Already Used Ticket** → Attempt to use ticket twice
4. **Non-existent Event** → Try to fetch event that doesn't exist

## 🔍 Verification Methods

### Solana Explorer
For each transaction, verify on: https://explorer.solana.com/?cluster=devnet

Example transaction URL:
```
https://explorer.solana.com/tx/[TRANSACTION_SIGNATURE]?cluster=devnet
```

### Expected Results
- ✅ All happy path scenarios should succeed
- ❌ All edge cases should fail with specific error messages
- 📊 Account states should update correctly
- 🔗 All transactions should be visible on Explorer

## 🛠️ Troubleshooting

### Common Issues
1. **Insufficient SOL** → Request airdrop: `solana airdrop 2`
2. **Wrong Cluster** → Set to devnet: `solana config set --url devnet`
3. **Build Errors** → Clean and rebuild: `anchor clean && anchor build`

### Error Codes to Expect
- `EventNotActive` → Event is not active
- `EventFull` → Event has reached max participants
- `TicketAlreadyUsed` → Ticket has already been used
- `NotTicketOwner` → Wrong wallet trying to use ticket

## 📈 Success Criteria
- [ ] Program deploys successfully to devnet
- [ ] EventDAO initializes with correct authority
- [ ] Events can be created with proper metadata
- [ ] Tickets can be purchased and used
- [ ] Edge cases fail with appropriate errors
- [ ] All transactions are visible on Solana Explorer
- [ ] Account states update correctly

## 🎉 Test Completion
When all tests pass, you'll see:
```
✅ All tests passed! 🎉
📋 Test Summary:
✅ Program deployed to devnet
✅ EventDAO initialized
✅ Event created successfully
✅ Ticket purchased
✅ Ticket used (check-in)
✅ Edge cases handled correctly
```
