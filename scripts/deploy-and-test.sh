#!/bin/bash

# EventDAO QA Testing Script
# This script deploys the program to devnet and runs comprehensive tests

set -e  # Exit on any error

echo "🚀 EventDAO QA Testing Suite"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "eventdao-anchor/eventdao/Anchor.toml" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Navigate to anchor project
cd eventdao-anchor/eventdao

print_status "Current directory: $(pwd)"
print_status "Solana cluster: $(solana config get | grep 'RPC URL' | cut -d' ' -f3)"

# Check if solana CLI is configured for devnet
CURRENT_CLUSTER=$(solana config get | grep 'RPC URL' | cut -d' ' -f3)
if [[ "$CURRENT_CLUSTER" != *"devnet"* ]]; then
    print_warning "Current cluster is not devnet. Setting to devnet..."
    solana config set --url devnet
    print_success "Switched to devnet cluster"
fi

# Check wallet balance
WALLET_ADDRESS=$(solana address)
BALANCE=$(solana balance $WALLET_ADDRESS | cut -d' ' -f1)
print_status "Wallet: $WALLET_ADDRESS"
print_status "Balance: $BALANCE SOL"

# Check if wallet has enough SOL for deployment
if (( $(echo "$BALANCE < 2" | bc -l) )); then
    print_warning "Low balance detected. Requesting airdrop..."
    solana airdrop 2 $WALLET_ADDRESS
    print_success "Airdrop completed"
fi

# Build the program
print_status "Building Anchor program..."
anchor build

if [ $? -eq 0 ]; then
    print_success "Program built successfully"
else
    print_error "Build failed"
    exit 1
fi

# Deploy the program
print_status "Deploying program to devnet..."
DEPLOY_OUTPUT=$(anchor deploy 2>&1)
DEPLOY_EXIT_CODE=$?

if [ $DEPLOY_EXIT_CODE -eq 0 ]; then
    print_success "Program deployed successfully"
    echo "$DEPLOY_OUTPUT"
    
    # Extract program ID from output
    PROGRAM_ID=$(echo "$DEPLOY_OUTPUT" | grep "Program Id:" | cut -d' ' -f3)
    if [ ! -z "$PROGRAM_ID" ]; then
        print_status "Program ID: $PROGRAM_ID"
        print_status "View on Explorer: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
    fi
else
    print_error "Deployment failed"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

# Run the QA test suite
print_status "Running QA test suite..."
anchor test --skip-local-validator

if [ $? -eq 0 ]; then
    print_success "All tests passed! 🎉"
    echo ""
    echo "📋 Test Summary:"
    echo "✅ Program deployed to devnet"
    echo "✅ EventDAO initialized"
    echo "✅ Event created successfully"
    echo "✅ Ticket purchased"
    echo "✅ Ticket used (check-in)"
    echo "✅ Edge cases handled correctly"
    echo ""
    echo "🔗 View your program on Solana Explorer:"
    echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
else
    print_error "Tests failed"
    exit 1
fi

print_success "QA Testing completed successfully!"
