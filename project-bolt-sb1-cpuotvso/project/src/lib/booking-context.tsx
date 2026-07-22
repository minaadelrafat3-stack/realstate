import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { BookingDraft } from './types';

interface BookingContextValue {
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft) => void;
  clearDraft: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraftState] = useState<BookingDraft | null>(null);

  const setDraft = useCallback((d: BookingDraft) => setDraftState(d), []);
  const clearDraft = useCallback(() => setDraftState(null), []);

  return (
    <BookingContext.Provider value={{ draft, setDraft, clearDraft }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
}
