"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PrivacidadPage() {
    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
                        Aviso de <span className="text-primary italic font-display lowercase tracking-normal">Privacidad</span>
                    </h1>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-light tracking-wide leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">1. Identidad del Responsable</h2>
                        <p>
                            La Huequita Quiteña, con domicilio en Carcelén, Quito, es la responsable del tratamiento de sus datos personales bajo la Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">2. Datos Recopilados</h2>
                        <p>Recopilamos los siguientes datos necesarios para la prestación del servicio:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Datos de identificación (Nombre, Cédula/RUC).</li>
                            <li>Datos de contacto (Email, Teléfono).</li>
                            <li>Datos de ubicación (Dirección de entrega).</li>
                            <li>Datos de verificación (Confirmación de mayoría de edad).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">3. Finalidad del Tratamiento</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Procesar y gestionar sus pedidos y entregas.</li>
                            <li>Cumplir con obligaciones legales de facturación (SRI).</li>
                            <li>Verificar el cumplimiento de la mayoría de edad para la venta de alcohol.</li>
                            <li>Mejorar su experiencia de usuario en nuestro portal.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">4. Derechos ARCO</h2>
                        <p>
                            Usted tiene derecho a Acceder, Rectificar, Cancelar u Oponerse al tratamiento de sus datos personales. Para ejercer estos derechos, puede enviarnos un correo electrónico a <strong>info@lahuequitaquitena.com</strong> indicando su solicitud.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">5. Seguridad de sus Datos</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales contra el acceso no autorizado, la alteración, divulgación o destrucción accidental o ilícita.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
