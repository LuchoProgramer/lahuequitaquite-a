"use client";

import React, { createContext, useContext, useState } from "react";

export interface Notification {
    id: string;
    message: string;
    type: "success" | "error" | "info";
}

interface UIContextType {
    isCartOpen: boolean;
    setIsCartOpen: (open: boolean) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (open: boolean) => void;
    notifications: Notification[];
    showToast: (message: string, type?: Notification["type"]) => void;
    removeNotification: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showToast = (message: string, type: Notification["type"] = "success") => {
        const id = Math.random().toString(36).substring(2, 9);
        setNotifications((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3s
        setTimeout(() => {
            removeNotification(id);
        }, 3000);
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <UIContext.Provider value={{
            isCartOpen,
            setIsCartOpen,
            isMenuOpen,
            setIsMenuOpen,
            notifications,
            showToast,
            removeNotification
        }}>
            {children}
        </UIContext.Provider>
    );
}

export function useUI() {
    const context = useContext(UIContext);
    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }
    return context;
}
