// ==========================================================================
// Firebase Authentication & Google Drive Scopes Configuration
// ==========================================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';

import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App safely without duplicate initializations
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

/**
 * Read-only, and only Drive.
 *
 * This asked for three scopes, one of which was `.../auth/drive` — full read,
 * write and delete over the whole of the signer's Drive. Everything the app
 * actually does with Drive is two GETs: `files?q=` to search, and
 * `files/{id}?alt=media` to download the one being imported. There is no POST,
 * PATCH or DELETE against Drive anywhere in the code, so it never needed
 * permission to change anything, and an editor importing a photograph was
 * handing over their whole account to get it.
 *
 * `drive.file` is narrower still and would have been the obvious choice, but it
 * grants access only to files the app itself created or the user picked through
 * the Google Picker. This code searches with `files.list` instead, which under
 * that scope returns nothing at all — so it would have quietly emptied the file
 * browser rather than tightened it. `drive.readonly` is the smallest scope that
 * covers both calls.
 *
 * Anyone already signed in holds a token minted under the old scopes. Sign out
 * and back in to move to this one; Google will show the narrower consent screen.
 */
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

// In-memory access token cache
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // We have a user but no cached token (e.g. page reload)
        // Set state to let the app know it needs to re-authenticate to get a fresh token
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Initiate Google Sign In via Popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google sign-in credential.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve currently cached token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Sign Out
export const logout = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};
