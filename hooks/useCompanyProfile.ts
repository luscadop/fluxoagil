import { useState, useEffect, useCallback } from 'react';
import { CompanyProfile } from '../types';

const PROFILES_KEY = 'fluxoagil-company-profiles';

const getInitialProfiles = (): Record<string, CompanyProfile> => {
  // Setup default profiles
  return {
    'fluxo': { displayName: 'FluxoÁgil Demo' },
    'admin': { displayName: 'Admin Control' }
  };
};

const getProfilesFromStorage = (): Record<string, CompanyProfile> => {
  try {
    const stored = localStorage.getItem(PROFILES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse profiles from localStorage", error);
  }
  // If nothing is stored, create and store the initial profiles
  const initial = getInitialProfiles();
  localStorage.setItem(PROFILES_KEY, JSON.stringify(initial));
  return initial;
};

const saveProfilesToStorage = (profiles: Record<string, CompanyProfile>) => {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
};

export const useCompanyProfile = (companyId: string | null) => {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  const loadProfile = useCallback(() => {
    if (companyId) {
      const allProfiles = getProfilesFromStorage();
      setProfile(allProfiles[companyId] || { displayName: companyId });
    } else {
      setProfile(null);
    }
  }, [companyId]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);
  
  const handleStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === PROFILES_KEY) {
      loadProfile();
    }
  }, [loadProfile]);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleStorageChange]);

  const updateProfile = useCallback((newProfileData: Partial<CompanyProfile>) => {
    if (companyId) {
      const allProfiles = getProfilesFromStorage();
      const currentProfile = allProfiles[companyId] || { displayName: companyId };
      const updatedProfile = { ...currentProfile, ...newProfileData };
      allProfiles[companyId] = updatedProfile;
      saveProfilesToStorage(allProfiles);
      setProfile(updatedProfile); // Update local state immediately
    }
  }, [companyId]);

  return { profile, updateProfile };
};
