import { createContext, useContext, useState } from "react";

interface AuthContextType {
    authenticated: boolean | null;
    setAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticated, setAuthenticated] = useState<boolean | null>(null);
    const checkAuth = async (): Promise<boolean> => {
        try {
            const response = await fetch("http://localhost:3000/auth/me", {
                credentials: "include",
            });
            const result = response.ok;
            setAuthenticated(result);

            return result;
            
        } catch (error) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{
                authenticated,
                checkAuth,
                setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
        );
    }

    return context;
};
