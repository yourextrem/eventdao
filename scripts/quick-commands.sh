#!/bin/bash

# EventDAO Quick Commands Reference
# Copy and paste these commands for quick testing

echo "🚀 EventDAO Quick Commands"
echo "=========================="
echo ""

echo "📋 Setup Commands:"
echo "cd /home/nicholas/projects/eventdao"
echo "solana config set --url devnet"
echo "solana balance"
echo ""

echo "🔨 Build & Deploy:"
echo "cd eventdao-anchor/eventdao"
echo "anchor build"
echo "anchor deploy"
echo ""

echo "🧪 Run Tests:"
echo "anchor test --skip-local-validator"
echo ""

echo "🔍 Check Status:"
echo "solana program show [PROGRAM_ID]"
echo "solana account [ACCOUNT_ADDRESS]"
echo ""

echo "💰 Get SOL:"
echo "solana airdrop 2"
echo ""

echo "🌐 Explorer Links:"
echo "Program: https://explorer.solana.com/address/[PROGRAM_ID]?cluster=devnet"
echo "Transaction: https://explorer.solana.com/tx/[TX_SIGNATURE]?cluster=devnet"
echo ""

echo "📊 Test Results to Expect:"
echo "✅ Program deployed successfully"
echo "✅ EventDAO initialized"
echo "✅ Event created"
echo "✅ Ticket purchased"
echo "✅ Ticket used"
echo "❌ Sold out event (expected failure)"
echo "❌ Wrong wallet (expected failure)"
echo "❌ Already used ticket (expected failure)"
