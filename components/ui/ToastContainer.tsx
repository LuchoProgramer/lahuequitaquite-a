"use client";

import React from "react";
import { useUI, Notification } from "@/contexts/UIContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ToastContainer() {
    const { notifications, removeNotification } = useUI();

    return (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 md:bottom-8 md:right-8 md:left-auto md:translate-x-0 z-[100] flex flex-col gap-3 items-center md:items-end pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <Toast key={n.id} notification={n} onClose={() => removeNotification(n.id)} />
                ))}
            </AnimatePresence>
        </div>
    );
}

function Toast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
    const icons = {
        success: "check_circle",
        error: "error",
        info: "info"
    };

    const colors = {
        success: "border-primary/20 bg-primary/10 text-primary",
        error: "border-red-500/20 bg-red-500/10 text-red-500",
        info: "border-blue-500/20 bg-blue-500/10 text-blue-500"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl min-w-[200px] max-w-[90vw] ${colors[notification.type]}`}
        >
            <span className="material-symbols-outlined text-xl">
                {icons[notification.type]}
            </span>
            <span className="text-xs font-bold uppercase tracking-widest flex-grow">
                {notification.message}
            </span>
            <button
                onClick={onClose}
                className="hover:opacity-60 transition-opacity"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </motion.div>
    );
}
