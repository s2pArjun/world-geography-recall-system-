import { create } from 'zustand';
import type { CountryFeature } from '../types';
import { loadCountries } from '../lib/geoData';

interface GeoDataState {
  countries: CountryFeature[];
  sovereignCountries: CountryFeature[];
  loading: boolean;
  error: string | null;
  init: () => Promise<void>;
}

export const useGeoDataStore = create<GeoDataState>((set, get) => ({
  countries: [],
  sovereignCountries: [],
  loading: true,
  error: null,

  init: async () => {
    if (get().countries.length > 0) return;
    set({ loading: true, error: null });
    try {
      const fc = await loadCountries();
      const sovereign = fc.features.filter((f) => f.properties.sovereign);
      set({ countries: fc.features, sovereignCountries: sovereign, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Failed to load country data' });
    }
  }
}));
