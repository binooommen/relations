
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import SettingsScreen from './screens/SettingsScreen';

export default function App() {
  const [screen, setScreen] = useState('signIn'); // 'signIn', 'signUp', 'welcome', 'settings'
  const [user, setUser] = useState(null);

  // Persist and restore user session for web (localStorage) and mobile (AsyncStorage)
  useEffect(() => {
    const restoreUser = async () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          const saved = window.localStorage.getItem('user');
          if (saved) {
            setUser(JSON.parse(saved));
            setScreen('welcome');
          }
        }
      } else {
        try {
          const saved = await AsyncStorage.getItem('user');
          if (saved) {
            setUser(JSON.parse(saved));
            setScreen('welcome');
          }
        } catch (e) {
          // handle error if needed
        }
      }
    };
    restoreUser();
  }, []);

  useEffect(() => {
    const persistUser = async () => {
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.localStorage) {
          if (user) {
            window.localStorage.setItem('user', JSON.stringify(user));
          } else {
            window.localStorage.removeItem('user');
          }
        }
      } else {
        try {
          if (user) {
            await AsyncStorage.setItem('user', JSON.stringify(user));
          } else {
            await AsyncStorage.removeItem('user');
          }
        } catch (e) {
          // handle error if needed
        }
      }
    };
    persistUser();
  }, [user]);

  if (screen === 'signIn') {
    return (
      <SignInScreen
        onSignIn={u => { setUser(u); setScreen('welcome'); }}
        onSwitch={() => setScreen('signUp')}
      />
    );
  }
  if (screen === 'signUp') {
    return (
      <SignUpScreen
        onSwitch={() => setScreen('signIn')}
      />
    );
  }
  if (screen === 'welcome' && user) {
    return (
      <WelcomeScreen
        user={user}
        onSettings={() => setScreen('settings')}
        onSignOut={() => { setUser(null); setScreen('signIn'); }}
      />
    );
  }
  if (screen === 'settings' && user) {
    return (
      <SettingsScreen
        user={user}
        onSave={newName => { setUser({ ...user, name: newName }); setScreen('welcome'); }}
        onCancel={() => setScreen('welcome')}
      />
    );
  }
  return null;
}
