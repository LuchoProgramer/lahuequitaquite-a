"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";

export default function BottomNav() {
    const pathname = usePathname();
    const { totalItems } = useCart();
    const { setIsCartOpen } = useUI();

    const navItems = [
        { name: "Home", icon: "home", href: "/" },
        { name: "Tienda", icon: "shopping_bag", href: "/productos" },
        { name: "Carrito", icon: "shopping_cart", href: "#", isCart: true },
        { name: "Cuenta", icon: "person", href: "/perfil" },
    ];

    const isProductPage = pathname.startsWith("/productos/") && pathname.split("/").length > 2;

    if (isProductPage) return null;

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full glass-nav border-t border-white/5 pb-8 pt-3 z-50 px-4">
            <div className="flex justify-around items-center max-w-lg mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    const Content = (
                        <div className="relative flex items-center justify-center">
                            <span
                                className={`material-symbols-outlined text-[26px] transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-gray-500 group-hover:text-primary'}`}
                                style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                            >
                                {item.icon}
                            </span>

                            {item.isCart && totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[8px] font-black text-background-dark flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}

                            {isActive && !item.isCart && (
                                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_#eebd2b]"></span>
                            )}
                        </div>
                    );

                    if (item.isCart) {
                        return (
                            <button
                                key={item.name}
                                onClick={() => setIsCartOpen(true)}
                                className="flex flex-col items-center gap-1 group relative py-1"
                            >
                                {Content}
                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-600 group-hover:text-primary">
                                    {item.name}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex flex-col items-center gap-1 group relative py-1"
                        >
                            {Content}
                            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-primary' : 'text-gray-600 group-hover:text-primary'}`}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
