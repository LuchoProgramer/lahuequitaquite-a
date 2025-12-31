"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { useUI } from "@/contexts/UIContext";
import CartDrawer from "@/components/cart/CartDrawer";
import MobileMenu from "@/components/navbar/MobileMenu";
import BranchSelector from "@/components/navbar/BranchSelector";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const { isCartOpen, setIsCartOpen, isMenuOpen, setIsMenuOpen } = useUI();

    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled ? "glass-nav border-b border-white/5" : "bg-transparent"
                )}
            >
                <div className="flex items-center justify-between px-5 py-4 max-w-7xl mx-auto w-full">
                    {/* Left: Hamburger Menu */}
                    <div className="flex items-center gap-1 md:gap-4 flex-1">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors text-white active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[28px]">menu</span>
                        </button>
                        <div className="hidden lg:block">
                            <BranchSelector />
                        </div>
                    </div>

                    {/* Center: Brand */}
                    <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                        <span className="material-symbols-outlined text-primary text-[24px]">local_bar</span>
                        <h1 className="text-xl font-black tracking-tighter text-white flex items-center gap-2 uppercase font-display">
                            La Huequita
                        </h1>
                    </Link>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-1 md:gap-4 flex-1">
                        <button className="hidden sm:flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors text-white">
                            <span className="material-symbols-outlined text-[24px]">search</span>
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative flex items-center justify-center p-2 rounded-full hover:bg-white/5 transition-colors text-white active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[24px]">shopping_cart</span>
                            {totalItems > 0 && (
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background-dark animate-pulse"></span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Persistent Menus */}
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
