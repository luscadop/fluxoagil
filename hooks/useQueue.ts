import { useState, useEffect, useCallback } from 'react';
import { QueueState } from '../types';

const QUEUE_STORAGE_KEY = 'fluxoagil-queue';
const TICKET_PREFIX = 'A';

const getInitialState = (): QueueState => {
  return {
    currentTicket: null,
    queue: [],
    nextTicketNumber: 1,
    history: [],
  };
};

const getQueueStateFromStorage = (): QueueState => {
  try {
    const storedState = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (storedState) {
      const parsed = JSON.parse(storedState) as QueueState;
      // Ensure history is an array for backwards compatibility
      if (!Array.isArray(parsed.history)) {
        parsed.history = [];
      }
      return parsed;
    }
  } catch (error) {
    console.error("Failed to parse queue state from localStorage", error);
  }
  return getInitialState();
};

const setQueueStateInStorage = (state: QueueState) => {
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(state));
};

export const useQueue = () => {
  const [queueState, setQueueState] = useState<QueueState>(getQueueStateFromStorage);

  const handleStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === QUEUE_STORAGE_KEY) {
      setQueueState(getQueueStateFromStorage());
    }
  }, []);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  const generateTicket = useCallback(() => {
    const currentState = getQueueStateFromStorage();
    const newTicketNumber = currentState.nextTicketNumber;
    const newTicket = `${TICKET_PREFIX}-${String(newTicketNumber).padStart(3, '0')}`;
    
    const newState: QueueState = {
      ...currentState,
      queue: [...currentState.queue, newTicket],
      nextTicketNumber: newTicketNumber + 1,
    };
    
    setQueueStateInStorage(newState);
    setQueueState(newState); // Update local state immediately
    return newTicket;
  }, []);

  const callNextTicket = useCallback(() => {
    const currentState = getQueueStateFromStorage();
    if (currentState.queue.length === 0) {
      return;
    }
    
    const [nextTicket, ...remainingQueue] = currentState.queue;
    
    // Add the ticket that was being served to the history
    const newHistory = currentState.currentTicket
      ? [currentState.currentTicket, ...(currentState.history || [])]
      : [...(currentState.history || [])];

    const newState: QueueState = {
      ...currentState,
      currentTicket: nextTicket,
      queue: remainingQueue,
      history: newHistory.slice(0, 50), // Keep last 50 tickets in history
    };
    
    setQueueStateInStorage(newState);
    setQueueState(newState);
  }, []);
  
  const finishCurrentTicket = useCallback(() => {
    const currentState = getQueueStateFromStorage();
    if (!currentState.currentTicket) {
      return; // No ticket to finish
    }

    const newHistory = [currentState.currentTicket, ...(currentState.history || [])];
    
    const newState: QueueState = {
      ...currentState,
      currentTicket: null, // Clear current ticket
      history: newHistory.slice(0, 50),
    };

    setQueueStateInStorage(newState);
    setQueueState(newState);
  }, []);

  const markCurrentAsAttended = useCallback(() => {
    const currentState = getQueueStateFromStorage();
    // Only act if there is a ticket being currently served
    if (!currentState.currentTicket) {
      return;
    }

    const newHistory = [currentState.currentTicket, ...(currentState.history || [])];

    const newState: QueueState = {
      ...currentState,
      currentTicket: null, // Clear the current ticket
      history: newHistory.slice(0, 50),
    };

    setQueueStateInStorage(newState);
    setQueueState(newState);
  }, []);

  const resetQueue = useCallback(() => {
    // This will reset everything, including the history, back to the initial state.
    const newState = getInitialState();
    setQueueStateInStorage(newState);
    setQueueState(newState);
  }, []);

  return { queueState, generateTicket, callNextTicket, resetQueue, markCurrentAsAttended, finishCurrentTicket };
};