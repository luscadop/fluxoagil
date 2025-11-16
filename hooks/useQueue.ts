import { useState, useEffect, useCallback } from 'react';
import { QueueState } from '../types';

const getStorageKey = (companyId: string | null) => companyId ? `fluxoagil-queue-${companyId}` : null;
const TICKET_PREFIX = 'A';

const getInitialState = (): QueueState => {
  return {
    currentTicket: null,
    queue: [],
    nextTicketNumber: 1,
    history: [],
  };
};

const getQueueStateFromStorage = (companyId: string | null): QueueState => {
  const QUEUE_STORAGE_KEY = getStorageKey(companyId);
  if (!QUEUE_STORAGE_KEY) return getInitialState();

  try {
    const storedState = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (storedState) {
      const parsed = JSON.parse(storedState) as QueueState;
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

const setQueueStateInStorage = (state: QueueState, companyId: string | null) => {
  const QUEUE_STORAGE_KEY = getStorageKey(companyId);
  if (QUEUE_STORAGE_KEY) {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(state));
  }
};

export const useQueue = (companyId: string | null) => {
  const [queueState, setQueueState] = useState<QueueState>(() => getQueueStateFromStorage(companyId));

  useEffect(() => {
    // If companyId changes, we need to reload the state from storage
    setQueueState(getQueueStateFromStorage(companyId));
  }, [companyId]);

  const handleStorageChange = useCallback((event: StorageEvent) => {
    const QUEUE_STORAGE_KEY = getStorageKey(companyId);
    if (event.key === QUEUE_STORAGE_KEY) {
      setQueueState(getQueueStateFromStorage(companyId));
    }
  }, [companyId]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  const generateTicket = useCallback(() => {
    if (!companyId) return null;
    const currentState = getQueueStateFromStorage(companyId);
    const newTicketNumber = currentState.nextTicketNumber;
    const newTicket = `${TICKET_PREFIX}-${String(newTicketNumber).padStart(3, '0')}`;
    
    const newState: QueueState = {
      ...currentState,
      queue: [...currentState.queue, newTicket],
      nextTicketNumber: newTicketNumber + 1,
    };
    
    setQueueStateInStorage(newState, companyId);
    setQueueState(newState);
    return newTicket;
  }, [companyId]);

  const callNextTicket = useCallback(() => {
    if (!companyId) return;
    const currentState = getQueueStateFromStorage(companyId);
    if (currentState.queue.length === 0) {
      return;
    }
    
    const [nextTicket, ...remainingQueue] = currentState.queue;
    
    const newHistory = currentState.currentTicket
      ? [currentState.currentTicket, ...(currentState.history || [])]
      : [...(currentState.history || [])];

    const newState: QueueState = {
      ...currentState,
      currentTicket: nextTicket,
      queue: remainingQueue,
      history: newHistory.slice(0, 50),
    };
    
    setQueueStateInStorage(newState, companyId);
    setQueueState(newState);
  }, [companyId]);
  
  const finishCurrentTicket = useCallback(() => {
    if (!companyId) return;
    const currentState = getQueueStateFromStorage(companyId);
    if (!currentState.currentTicket) {
      return;
    }

    const newHistory = [currentState.currentTicket, ...(currentState.history || [])];
    
    const newState: QueueState = {
      ...currentState,
      currentTicket: null,
      history: newHistory.slice(0, 50),
    };

    setQueueStateInStorage(newState, companyId);
    setQueueState(newState);
  }, [companyId]);

  const resetQueue = useCallback(() => {
    if (!companyId) return;
    const newState = getInitialState();
    setQueueStateInStorage(newState, companyId);
    setQueueState(newState);
  }, [companyId]);

  return { queueState, generateTicket, callNextTicket, resetQueue, finishCurrentTicket };
};