import { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../firebase"; // ✅ update if path is different

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // ✅ Login function
  const login = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmailAndPassword(auth, email, password);
    setLoading(false);
    return result;
  };

  // ✅ Signup function
  const signup = async (email, password) => {
    setLoading(true);
    const result = await createUserWithEmailAndPassword(auth, email, password);
    setLoading(false);
    return result;
  };

  // ✅ Logout function
  const logout = () => firebaseSignOut(auth);

  // ✅ Check if user is admin
  const isAdmin = user?.email === "admin@example.com";

  const value = {
    user,
    login,
    signup,
    logout,
    isAdmin,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

