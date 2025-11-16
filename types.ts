export interface QueueState {
  currentTicket: string | null;
  queue: string[];
  nextTicketNumber: number;
  history: string[];
}

export interface CompanyProfile {
  displayName: string;
  logoBase64?: string;
  address?: string;
  phone?: string;
  socials?: {
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}
