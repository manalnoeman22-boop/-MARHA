import React, { useState, useEffect } from 'react';
import { ChildProfile, WorldType, AudioSettings } from './types';
import { loadProfile, saveProfile, getInitialProfile } from './utils/storage';
import { stopSpeech, speakText } from './utils/audio';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { GameScreen } from './components/GameScreen';
import { ReadingPracticeScreen } from './components/ReadingPracticeScreen';
import { MamaSection } from './components/MamaSection';
import { ChildProgressModal } from './components/ChildProgressModal';
import { SettingsModal } from './components/SettingsModal';

type AppView = 'splash' | 'onboarding' | 'home' | 'game' | 'reading_practice';

export default function App() {
  const [profile, setProfile] = useState<ChildProfile>(() => {
    const saved = loadProfile();
    return saved || getInitialProfile();
  });

  const [currentView, setCurrentView] = useState<AppView>('splash');
  const [activeWorld, setActiveWorld] = useState<WorldType>('letters');
  
  // Modals state
  const [isMamaOpen, setIsMamaOpen] = useState(false);
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Splash Screen completion logic
  const handleSplashComplete = () => {
    if (profile && profile.name.trim().length > 0) {
      setCurrentView('home');
    } else {
      setCurrentView('onboarding');
    }
  };

  // Save new child name on first entry
  const handleSaveChildName = (name: string) => {
    const updated = {
      ...profile,
      name,
    };
    setProfile(updated);
    saveProfile(updated);
    setCurrentView('home');
  };

  // Update profile handler (persisting to state and localStorage)
  const handleUpdateProfile = (newProfile: ChildProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Quick sound toggle from header
  const handleToggleSound = () => {
    const nextEnabled = !profile.audioSettings.enabled;
    if (!nextEnabled) {
      stopSpeech();
    }
    const updatedSettings: AudioSettings = {
      ...profile.audioSettings,
      enabled: nextEnabled,
    };
    const updated = {
      ...profile,
      audioSettings: updatedSettings,
    };
    handleUpdateProfile(updated);
    if (nextEnabled) {
      speakText('تم تفعيل الصوت!', updatedSettings);
    }
  };

  // Select world to enter game
  const handleSelectWorld = (world: WorldType) => {
    setActiveWorld(world);
    setCurrentView('game');
  };

  // Reset progress from Mama Section
  const handleResetProgress = (freshProfile: ChildProfile) => {
    setProfile(freshProfile);
    setCurrentView(freshProfile.name ? 'home' : 'onboarding');
  };

  return (
    <div id="marha-app" className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/40 to-amber-100/30 text-slate-800 flex flex-col font-sans">
      {/* 1. Splash Screen */}
      {currentView === 'splash' && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}

      {/* 2. First-time Onboarding */}
      {currentView === 'onboarding' && (
        <OnboardingScreen
          audioSettings={profile.audioSettings}
          onSaveName={handleSaveChildName}
        />
      )}

      {/* 3. Main Application Flow (Header + Views) */}
      {(currentView === 'home' || currentView === 'game' || currentView === 'reading_practice') && (
        <>
          <Header
            profile={profile}
            onOpenProgress={() => setIsProgressOpen(true)}
            onOpenMama={() => setIsMamaOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onToggleSound={handleToggleSound}
            onHomeClick={() => setCurrentView('home')}
          />

          <main className="flex-1 w-full max-w-5xl mx-auto pt-2">
            {currentView === 'home' && (
              <HomeScreen
                profile={profile}
                onSelectWorld={handleSelectWorld}
                onOpenReadingPractice={() => setCurrentView('reading_practice')}
                onOpenProgress={() => setIsProgressOpen(true)}
              />
            )}

            {currentView === 'game' && (
              <GameScreen
                world={activeWorld}
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onExitGame={() => setCurrentView('home')}
              />
            )}

            {currentView === 'reading_practice' && (
              <ReadingPracticeScreen
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onBack={() => setCurrentView('home')}
              />
            )}
          </main>
        </>
      )}

      {/* 4. Mama / Teacher Protected Dashboard Modal */}
      <MamaSection
        isOpen={isMamaOpen}
        profile={profile}
        onClose={() => setIsMamaOpen(false)}
        onResetProgress={handleResetProgress}
      />

      {/* 5. Child Visual Progress & Badges Modal */}
      <ChildProgressModal
        isOpen={isProgressOpen}
        profile={profile}
        onClose={() => setIsProgressOpen(false)}
      />

      {/* 6. Settings Modal (Audio rate, volume, sound fx) */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={profile.audioSettings}
        onUpdateSettings={(newSettings) => {
          handleUpdateProfile({
            ...profile,
            audioSettings: newSettings,
          });
        }}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
