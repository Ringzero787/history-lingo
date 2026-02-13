import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase is auto-initialized by @react-native-firebase via native config files
// (google-services.json for Android, GoogleService-Info.plist for iOS)

export { firebase, auth, firestore };

// Firestore collection references
export const db = firestore();
export const usersCollection = db.collection('users');
export const erasCollection = db.collection('eras');
export const leaderboardCollection = db.collection('leaderboard');
export const battlesCollection = db.collection('battles');
export const dailyChallengesCollection = db.collection('dailyChallenges');

// Helper to get user document reference
export function userDoc(uid: string) {
  return usersCollection.doc(uid);
}

// Helper to get user progress subcollection
export function userProgressCollection(uid: string) {
  return usersCollection.doc(uid).collection('progress');
}

// Helper to get lessons subcollection for an era
export function eraLessonsCollection(eraId: string) {
  return erasCollection.doc(eraId).collection('lessons');
}
