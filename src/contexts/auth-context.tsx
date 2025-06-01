// src/contexts/auth-context.tsx
// Este contexto gestiona la autenticación de usuarios con Firebase Authentication
// y la persistencia de datos de perfil en Cloud Firestore, incluyendo el flujo de onboarding.

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Define la estructura del usuario para tu aplicación
export interface User {
  id: string;
  email: string | null;
  name: string | null;
  emailVerified?: boolean;
  avatarUrl?: string;
  bio?: string;
  followers?: string[]; // IDs de usuarios que siguen a este usuario
  following?: string[]; // IDs de usuarios que este usuario sigue
  interests?: string[];
  personalityTags?: string[];
  bioSoundUrl?: string;
  dateOfBirth?: string; // ¡CAMBIO! Fecha de nacimiento como string (YYYY-MM-DD)
  hobbies?: string[];
  onboardingComplete: boolean; // Para saber si el usuario completó el onboarding
}

// Define la estructura de un mensaje directo
export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  recipientId: string;
  voiceUrl: string;
  createdAt: string;
  isRead: boolean;
}

// Define el tipo para el contexto de autenticación
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, dateOfBirth: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserAvatar: (avatarUrl: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  completeOnboarding: (data: { hobbies: string[]; bioSoundUrl: string; avatarUrl: string; }) => Promise<void>;
  followUser: (userIdToFollow: string) => Promise<void>;
  unfollowUser: (userIdToUnfollow: string) => Promise<void>;
  isFollowing: (userIdToCheck: string) => boolean;
  getUserById: (userId: string) => Promise<User | undefined>;
  getMutualFollows: () => User[];
  getDirectMessages: (chatPartnerId: string) => Message[];
  sendDirectMessage: (recipientId: string, voiceDataUri: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [allUsersInMemory, setAllUsersInMemory] = useState<User[]>([]); 
  const [directMessagesInMemory, setDirectMessagesInMemory] = useState<Message[]>([]);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as User;
          setUser({ 
            ...userData, 
            id: firebaseUser.uid, 
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified 
          });
          setAllUsersInMemory(prev => {
            const existing = prev.find(u => u.id === firebaseUser.uid);
            if (!existing) {
              return [...prev, { ...userData, id: firebaseUser.uid, email: firebaseUser.email, emailVerified: firebaseUser.emailVerified }];
            }
            return prev.map(u => u.id === firebaseUser.uid ? { ...userData, id: firebaseUser.uid, email: firebaseUser.email, emailVerified: firebaseUser.emailVerified } : u);
          });

        } else {
          const newUserData: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.email?.split('@')[0] || "Nuevo Usuario",
            emailVerified: firebaseUser.emailVerified,
            avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${firebaseUser.uid}`,
            bio: "",
            followers: [],
            following: [],
            interests: [],
            personalityTags: [],
            bioSoundUrl: "",
            dateOfBirth: undefined, 
            hobbies: [],
            onboardingComplete: false, 
          };
          await setDoc(userDocRef, newUserData);
          setUser(newUserData);
          setAllUsersInMemory(prev => [...prev, newUserData]);
        }
      } else {
        setUser(null);
        setAllUsersInMemory([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Controla la redirección después de la carga inicial de autenticación
  useEffect(() => {
    const authPages = ['/login', '/register', '/verify-email', '/onboarding']; // Páginas relacionadas con la autenticación

    if (!loading) {
        if (user) {
            // Usuario autenticado
            if (!user.emailVerified && pathname !== '/verify-email') {
                router.push('/verify-email');
            } else if (user.emailVerified && !user.onboardingComplete && pathname !== '/onboarding') {
                router.push('/onboarding');
            } else if (user.emailVerified && user.onboardingComplete) {
                // Usuario completamente autenticado y con onboarding completo
                // Si está en una de las páginas de autenticación, lo redirigimos a su perfil.
                if (authPages.includes(pathname)) { // ¡CAMBIO AQUÍ!
                    router.push('/profile'); // Redirige a /profile si está en una página de autenticación
                }
                // Si no está en una página de autenticación, lo dejamos en la página actual (ej. /settings/...)
            }
        } else {
            // Usuario NO autenticado
            // Si NO está en una de las páginas de autenticación, lo redirigimos a login.
            if (!authPages.includes(pathname)) { // ¡CAMBIO AQUÍ!
                router.push('/login');
            }
        }
    }
  }, [loading, user, router, pathname]);


  const signup = async (email: string, password: string, name: string, dateOfBirth: string) => { 
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await sendEmailVerification(firebaseUser);

      const newUserProfile: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: name,
        emailVerified: firebaseUser.emailVerified, 
        avatarUrl: `https://api.dicebear.com/7.x/personas/svg?seed=${firebaseUser.uid}`,
        bio: "",
        followers: [],
        following: [],
        interests: [],
        personalityTags: [],
        bioSoundUrl: "",
        dateOfBirth: dateOfBirth, 
        hobbies: [],
        onboardingComplete: false, 
      };
      await setDoc(doc(db, "users", firebaseUser.uid), newUserProfile);
      setUser(newUserProfile);
      setAllUsersInMemory(prev => [...prev, newUserProfile]);
      
      router.push('/verify-email'); 

    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged se encargará de establecer el usuario y la redirección
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      setAllUsersInMemory([]);
      router.push('/login');
    } catch (error: any) {
      setLoading(false);
      throw new Error(error.message);
    }
  };

  const updateUserAvatar = async (avatarUrl: string) => {
    if (!user) throw new Error("Usuario no autenticado.");
    const userDocRef = doc(db, "users", user.id);
    try {
      await updateDoc(userDocRef, { avatarUrl: avatarUrl });
      setUser(prev => prev ? { ...prev, avatarUrl } : null);
      setAllUsersInMemory(prev => prev.map(u => u.id === user.id ? { ...u, avatarUrl } : u));
    } catch (error: any) {
      throw new Error(`Error al actualizar avatar: ${error.message}`);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) throw new Error("Usuario no autenticado.");
    const userDocRef = doc(db, "users", user.id);
    try {
      await updateDoc(userDocRef, data);
      setUser(prev => prev ? { ...prev, ...data } : null);
      setAllUsersInMemory(prev => prev.map(u => u.id === user.id ? { ...u, ...data } : u));
    } catch (error: any) {
      throw new Error(`Error al actualizar perfil: ${error.message}`);
    }
  };

  const completeOnboarding = async (data: { hobbies: string[]; bioSoundUrl: string; avatarUrl: string; }) => {
    if (!user) throw new Error("Usuario no autenticado.");
    const userDocRef = doc(db, "users", user.id);
    try {
      await updateDoc(userDocRef, { 
        hobbies: data.hobbies,
        bioSoundUrl: data.bioSoundUrl,
        avatarUrl: data.avatarUrl,
        onboardingComplete: true, 
      });
      setUser(prev => prev ? { 
        ...prev, 
        hobbies: data.hobbies,
        bioSoundUrl: data.bioSoundUrl,
        avatarUrl: data.avatarUrl,
        onboardingComplete: true 
      } : null);
      setAllUsersInMemory(prev => prev.map(u => u.id === user.id ? { 
        ...u, 
        hobbies: data.hobbies,
        bioSoundUrl: data.bioSoundUrl,
        avatarUrl: data.avatarUrl,
        onboardingComplete: true 
      } : u));
      router.push('/profile');
    } catch (error: any) {
      throw new Error(`Error al completar onboarding: ${error.message}`);
    }
  };


  const getUserById = async (id: string): Promise<User | undefined> => {
    const userDocRef = doc(db, "users", id);
    try {
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        return userDocSnap.data() as User;
      }
      return undefined;
    } catch (error: any) {
      console.error(`Error fetching user ${id}:`, error.message);
      return undefined;
    }
  };

  const isFollowing = (userIdToCheck: string): boolean => {
    if (!user || !user.following) return false;
    return user.following.includes(userIdToCheck);
  };

  const followUser = async (userIdToFollow: string) => {
    if (!user || !user.following) throw new Error("Usuario no autenticado o siguiendo no inicializado.");
    if (isFollowing(userIdToFollow)) return; 

    const updatedFollowing = [...user.following, userIdToFollow];
    const userDocRef = doc(db, "users", user.id);
    
    let targetUserUpdatedFollowers: string[] | undefined; 
    try {
      await updateDoc(userDocRef, { following: updatedFollowing }); 
      setUser(prev => prev ? { ...prev, following: updatedFollowing } : null); 

      const userToFollowDocRef = doc(db, "users", userIdToFollow);
      const userToFollowSnap = await getDoc(userToFollowDocRef);
      if (userToFollowSnap.exists()) {
          const userToFollowData = userToFollowSnap.data() as User;
          targetUserUpdatedFollowers = Array.from(new Set([...(userToFollowData.followers || []), user.id])); 
          await updateDoc(userToFollowDocRef, { followers: targetUserUpdatedFollowers });
      }
      setAllUsersInMemory(prev => prev.map(u => {
        if (u.id === user.id) return { ...u, following: updatedFollowing };
        if (u.id === userIdToFollow) return { ...u, followers: targetUserUpdatedFollowers || u.followers };
        return u;
      }));

    } catch (error: any) {
      throw new Error(`Error al seguir usuario: ${error.message}`);
    }
  };

  const unfollowUser = async (userIdToUnfollow: string) => {
    if (!user || !user.following) throw new Error("Usuario no autenticado o siguiendo no inicializado.");
    if (!isFollowing(userIdToUnfollow)) return; 

    const updatedFollowing = user.following.filter(id => id !== userIdToUnfollow);
    const userDocRef = doc(db, "users", user.id);

    let targetUserUpdatedFollowers: string[] | undefined; 
    try {
      await updateDoc(userDocRef, { following: updatedFollowing }); 
      setUser(prev => prev ? { ...prev, following: updatedFollowing } : null);

      const userToUnfollowDocRef = doc(db, "users", userIdToUnfollow);
      const userToUnfollowSnap = await getDoc(userToUnfollowDocRef);
      if (userToUnfollowSnap.exists()) {
          const userToUnfollowData = userToUnfollowSnap.data() as User;
          targetUserUpdatedFollowers = (userToUnfollowData.followers || []).filter(id => id !== user.id);
          await updateDoc(userToUnfollowDocRef, { followers: targetUserUpdatedFollowers });
      }
      setAllUsersInMemory(prev => prev.map(u => {
        if (u.id === user.id) return { ...u, following: updatedFollowing };
        if (u.id === userIdToUnfollow) return { ...u, followers: targetUserUpdatedFollowers || u.followers };
        return u;
      }));
    } catch (error: any) {
      throw new Error(`Error al dejar de seguir usuario: ${error.message}`);
    }
  };

  const getMutualFollows = (): User[] => {
    if (!user || !user.following || !user.followers) return [];
    return allUsersInMemory.filter(otherUser => {
      if (otherUser.id === user.id) return false;
      const currentUserFollowsOther = user.following?.includes(otherUser.id);
      const otherUserFollowsCurrent = otherUser.following?.includes(user.id);
      return currentUserFollowsOther && otherUserFollowsCurrent;
    });
  };

  const getDirectMessages = (chatPartnerId: string): Message[] => {
    if (!user) return [];
    const chatId = [user.id, chatPartnerId].sort().join('_');
    return directMessagesInMemory
      .filter(msg => msg.chatId === chatId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  const sendDirectMessage = async (recipientId: string, voiceDataUri: string): Promise<void> => {
    if (!user) throw new Error("Usuario no autenticado.");

    const newMessage: Message = {
      id: `dm-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      chatId: [user.id, recipientId].sort().join('_'),
      senderId: user.id,
      recipientId: recipientId,
      voiceUrl: voiceDataUri,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    
    try {
      const messagesCollectionRef = doc(db, "messages", newMessage.id);
      await setDoc(messagesCollectionRef, newMessage);

      setDirectMessagesInMemory(prevMessages => [...prevMessages, newMessage]);

    } catch (error: any) {
      throw new Error(`Error al enviar mensaje: ${error.message}`);
    }
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUserAvatar,
    updateUserProfile,
    completeOnboarding, // ¡NUEVO!
    followUser,
    unfollowUser,
    isFollowing,
    getUserById,
    getMutualFollows,
    getDirectMessages,
    sendDirectMessage,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
