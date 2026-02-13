import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

export type AuthUser = FirebaseAuthTypes.User;

// Sign up with email and password
export async function signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
  const credential = await auth().createUserWithEmailAndPassword(email, password);
  await credential.user.updateProfile({ displayName });
  return credential.user;
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<AuthUser> {
  const credential = await auth().signInWithEmailAndPassword(email, password);
  return credential.user;
}

// Sign out
export async function signOut(): Promise<void> {
  await auth().signOut();
}

// Get current user
export function getCurrentUser(): AuthUser | null {
  return auth().currentUser;
}

// Listen to auth state changes
export function onAuthStateChanged(callback: (user: AuthUser | null) => void) {
  return auth().onAuthStateChanged(callback);
}

// Send password reset email
export async function sendPasswordReset(email: string): Promise<void> {
  await auth().sendPasswordResetEmail(email);
}
