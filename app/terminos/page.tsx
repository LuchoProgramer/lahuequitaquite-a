"use client";

import React from "react";
import { motion } from "framer-motion";

export default function TerminosPage() {
    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
                        Términos y <span className="text-primary italic font-display lowercase tracking-normal">Condiciones</span>
                    </h1>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-light tracking-wide leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">1. Aceptación de Términos</h2>
                        <p>
                            Al acceder y utilizar este sitio web (lahuequitaquitena.com), usted acepta estar sujeto a los presentes términos y condiciones y a todas las leyes y regulaciones aplicables en la República del Ecuador.
                        </p>
                    </section>

                    <section className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-4">2. Restricción de Edad (+18)</h2>
                        <p className="text-white font-bold">
                            ESTÁ ESTRICTAMENTE PROHIBIDA LA VENTA DE BEBIDAS ALCOHÓLICAS A MENORES DE 18 AÑOS.
                        </p>
                        <p className="mt-4 text-xs">
                            Al realizar un pedido, usted declara bajo juramento que tiene al menos 18 años de edad. La Huequita Quiteña se reserva el derecho de solicitar la cédula de identidad física al momento de la entrega y se negará a entregar el producto si no se verifica la mayoría de edad, sin derecho a reembolso del costo de envío.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">3. Cumplimiento Legal (Ley Seca)</h2>
                        <p>
                            La Huequita Quiteña cumple estrictamente con el Código de la Democracia y los decretos nacionales referentes a la "Ley Seca". Durante los periodos electorales o restricciones nacionales de expendio de alcohol, el servicio de venta y entrega quedará suspendido automáticamente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">4. Consumo Responsable</h2>
                        <p>
                            El consumo excesivo de alcohol limita su capacidad de conducir y operar maquinaria, puede causar daños a la salud y perjudica a su familia. Beber con moderación es responsabilidad del usuario.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">5. Propiedad Intelectual</h2>
                        <p>
                            Todo el contenido de este sitio, incluyendo logotipos, textos, gráficos y software, es propiedad de La Huequita Quiteña y está protegido por las leyes de propiedad intelectual internacionales y del Ecuador.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
