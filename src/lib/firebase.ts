import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Auth instance
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Firestore instance
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Helper to save or update user in Firestore
export async function saveUserToFirestore(user: User, customDisplayName?: string) {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: customDisplayName || user.displayName || 'Atleta',
      email: user.email || '',
      photoURL: user.photoURL || '',
      lastLoginAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not update user document:', err);
  }
}

// Translate Firebase Auth error codes to friendly Portuguese messages
export function formatAuthErrorMessage(error: any): string {
  const code = error?.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-mail ou senha incorretos. Verifique os dados digitados.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está cadastrado. Tente entrar ou recuperar a senha.';
    case 'auth/weak-password':
      return 'Senha muito fraca. Digite pelo menos 6 caracteres com números ou letras.';
    case 'auth/invalid-email':
      return 'O formato do e-mail digitado é inválido.';
    case 'auth/popup-closed-by-user':
      return 'A janela de autenticação foi fechada antes de concluir.';
    case 'auth/operation-not-allowed':
      return 'O login por e-mail/senha precisa ser habilitado no Firebase Console (Authentication > Sign-in method).';
    case 'auth/too-many-requests':
      return 'Muitas tentativas consecutivas. Aguarde alguns instantes e tente novamente.';
    case 'auth/network-request-failed':
      return 'Falha na conexão de rede. Verifique seu sinal de internet.';
    default:
      return error?.message || 'Ocorreu um erro durante a autenticação.';
  }
}

// Sign up with Email & Password
export async function signUpWithEmail(email: string, pass: string, name: string): Promise<User> {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    const user = cred.user;
    if (name.trim()) {
      await updateProfile(user, { displayName: name.trim() });
    }
    await saveUserToFirestore(user, name.trim());
    return user;
  } catch (error) {
    console.error('Error signing up with email:', error);
    throw error;
  }
}

// Sign in with Email & Password
export async function signInWithEmail(email: string, pass: string): Promise<User> {
  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const user = cred.user;
    await saveUserToFirestore(user);
    return user;
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
}

// Send Password Reset Email
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      await saveUserToFirestore(user);
    }
    return user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

// Sign out
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

