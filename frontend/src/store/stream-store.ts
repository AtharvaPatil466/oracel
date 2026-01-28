import { create } from 'zustand';
import { MonsoonData } from '../types/monsoon.types';

interface StreamState {
    monsoonData: MonsoonData | null;
    isLoading: boolean;
    error: string | null;

    // Actions
    setMonsoonData: (data: MonsoonData) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useStreamStore = create<StreamState>((set) => ({
    monsoonData: null,
    isLoading: false,
    error: null,

    setMonsoonData: (data) => set({ monsoonData: data }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error }),
}));
