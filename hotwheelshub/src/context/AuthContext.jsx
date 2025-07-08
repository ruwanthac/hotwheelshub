import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "../firebase"; // ✅ update if path is different

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const logout = () => firebaseSignOut(auth);

  const isAdmin = user?.email === "admin@example.com";

  return (
    <AuthContext.Provider value={{ user, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ THIS is what your navbar is looking for!
export const useAuth = () => useContext(AuthContext);

