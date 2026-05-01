"use client";
import { LocalStorageProvider } from "@/context/LocalStorageContext";
import { AuthProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocalStorageProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LocalStorageProvider>
  );
}