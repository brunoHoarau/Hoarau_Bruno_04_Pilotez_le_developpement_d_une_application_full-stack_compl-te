import { createContext, useContext } from "react";

interface AuthContextType {
    checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const checkAuth = async (): Promise<boolean> => {
        try {
            const response = await fetch("http://localhost:3000/auth/me", {
                credentials: "include",
            });

            return response.ok;
        } catch (error) {
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ checkAuth }}>
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
