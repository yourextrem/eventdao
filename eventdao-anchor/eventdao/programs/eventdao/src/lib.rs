use anchor_lang::prelude::*;

declare_id!("8fESbva8KnNirFj6EoyS5ep6Y6XMPMTJgyPufvphV1HK");

#[program]
pub mod eventdao {
    use super::*;

    // Initialize EventDAO
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let event_dao = &mut ctx.accounts.event_dao;
        event_dao.authority = ctx.accounts.authority.key();
        event_dao.total_events = 0;
        event_dao.bump = ctx.bumps.event_dao;
        
        msg!("EventDAO initialized by: {:?}", ctx.accounts.authority.key());
        Ok(())
    }

    // Create a new event
    pub fn create_event(
        ctx: Context<CreateEvent>,
        title: String,
        description: String,
        max_participants: u32,
        ticket_price: u64,
    ) -> Result<()> {
        let event = &mut ctx.accounts.event;
        let event_dao = &mut ctx.accounts.event_dao;
        
        event.id = event_dao.total_events;
        event.title = title;
        event.description = description;
        event.organizer = ctx.accounts.organizer.key();
        event.max_participants = max_participants;
        event.current_participants = 0;
        event.ticket_price = ticket_price;
        event.is_active = true;
        event.created_at = Clock::get()?.unix_timestamp;
        event.bump = ctx.bumps.event;
        
        event_dao.total_events += 1;
        
        msg!("Event created with ID: {}", event.id);
        Ok(())
    }

    // Buy ticket for an event
    pub fn buy_ticket(ctx: Context<BuyTicket>) -> Result<()> {
        let event = &mut ctx.accounts.event;
        let ticket = &mut ctx.accounts.ticket;
        
        require!(event.is_active, ErrorCode::EventNotActive);
        require!(event.current_participants < event.max_participants, ErrorCode::EventFull);
        
        ticket.event_id = event.id;
        ticket.owner = ctx.accounts.buyer.key();
        ticket.purchase_time = Clock::get()?.unix_timestamp;
        ticket.is_used = false;
        ticket.bump = ctx.bumps.ticket;
        
        event.current_participants += 1;
        
        msg!("Ticket purchased for event ID: {}", event.id);
        Ok(())
    }

    // Use ticket (check-in)
    pub fn use_ticket(ctx: Context<UseTicket>) -> Result<()> {
        let ticket = &mut ctx.accounts.ticket;
        
        require!(!ticket.is_used, ErrorCode::TicketAlreadyUsed);
        require!(ticket.owner == ctx.accounts.user.key(), ErrorCode::NotTicketOwner);
        
        ticket.is_used = true;
        
        msg!("Ticket used for event ID: {}", ticket.event_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + EventDAO::INIT_SPACE,
        seeds = [b"event_dao"],
        bump
    )]
    pub event_dao: Account<'info, EventDAO>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(
        mut,
        seeds = [b"event_dao"],
        bump = event_dao.bump
    )]
    pub event_dao: Account<'info, EventDAO>,
    
    #[account(
        init,
        payer = organizer,
        space = 8 + Event::INIT_SPACE,
        seeds = [b"event", event_dao.total_events.to_le_bytes().as_ref()],
        bump
    )]
    pub event: Account<'info, Event>,
    
    #[account(mut)]
    pub organizer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(
        mut,
        seeds = [b"event", event.id.to_le_bytes().as_ref()],
        bump = event.bump
    )]
    pub event: Account<'info, Event>,
    
    #[account(
        init,
        payer = buyer,
        space = 8 + Ticket::INIT_SPACE,
        seeds = [b"ticket", event.key().as_ref(), buyer.key().as_ref()],
        bump
    )]
    pub ticket: Account<'info, Ticket>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UseTicket<'info> {
    #[account(
        mut,
        seeds = [b"ticket", ticket.event_id.to_le_bytes().as_ref(), user.key().as_ref()],
        bump = ticket.bump
    )]
    pub ticket: Account<'info, Ticket>,
    
    pub user: Signer<'info>,
}

#[account]
#[derive(InitSpace)]
pub struct EventDAO {
    pub authority: Pubkey,
    pub total_events: u32,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Event {
    pub id: u32,
    #[max_len(100)]
    pub title: String,
    #[max_len(500)]
    pub description: String,
    pub organizer: Pubkey,
    pub max_participants: u32,
    pub current_participants: u32,
    pub ticket_price: u64,
    pub is_active: bool,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Ticket {
    pub event_id: u32,
    pub owner: Pubkey,
    pub purchase_time: i64,
    pub is_used: bool,
    pub bump: u8,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Event is not active")]
    EventNotActive,
    #[msg("Event is full")]
    EventFull,
    #[msg("Ticket already used")]
    TicketAlreadyUsed,
    #[msg("Not ticket owner")]
    NotTicketOwner,
}
