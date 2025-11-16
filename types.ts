export interface QueueState {
  currentTicket: string | null;
  queue: string[];
  nextTicketNumber: number;
  history: string[];
}
