'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion, AnimatePresence } from 'framer-motion';

const AGE_COOKIE_NAME = 'age_verified';
const COOKIE_EXPIRE_DAYS = 30;

export default function AgeGate({ children }: { children: React.ReactNode }) {
    const [verified, setVerified] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const ageVerified = Cookies.get(AGE_COOKIE_NAME);
        if (ageVerified === 'true') {
            setVerified(true);
        } else {
            setVerified(false);
        }
        setLoading(false);
    }, []);

    const handleVerify = (isAdult: boolean) => {
        if (isAdult) {
            Cookies.set(AGE_COOKIE_NAME, 'true', { expires: COOKIE_EXPIRE_DAYS });
            setVerified(true);
        } else {
            window.location.href = 'https://www.google.com';
        }
    };

    if (loading) return null;

    return (
        <>
            <AnimatePresence>
                {!verified && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xl p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass p-8 md:p-12 rounded-3xl max-w-lg w-full text-center relative overflow-hidden group"
                        >
                            {/* Decoración de fondo premium */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-right from-transparent via-primary to-transparent opacity-50" />

                            <div className="mb-8">
                                <span className="material-symbols-outlined text-primary text-6xl mb-4 block">
                                    e901
                                </span>
                                <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 italic">
                                    Verificación de Edad
                                </h1>
                                <div className="h-px w-24 bg-primary/30 mx-auto mb-6" />
                                <p className="text-gray-300 text-lg leading-relaxed">
                                    Este sitio contiene productos alcohólicos. <br />
                                    <span className="text-white font-medium">¿Eres mayor de 18 años?</span>
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => handleVerify(true)}
                                    className="flex-1 bg-primary text-black font-bold py-4 px-8 rounded-xl lux-transition hover:bg-white hover:scale-[1.02] active:scale-95 text-lg"
                                >
                                    Sí, soy mayor
                                </button>
                                <button
                                    onClick={() => handleVerify(false)}
                                    className="flex-1 bg-white/5 border border-white/10 text-white font-medium py-4 px-8 rounded-xl lux-transition hover:bg-white/10 hover:border-white/20 active:scale-95 text-lg"
                                >
                                    No, soy menor
                                </button>
                            </div>

                            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mt-10 opacity-60">
                                Consumo responsable · Solo para mayores de 18 años
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* 
          Solo mostramos el contenido si el usuario está verificado. 
          Si no está verificado, el modal está encima, pero para SEO y Merchant Center
          el contenido debe estar presente pero inaccesible.
      */}
            <div className={!verified ? "hidden" : ""}>
                {children}
            </div>
        </>
    );
}
