"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PoliticasPage() {
    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
                        Políticas de <span className="text-primary italic font-display lowercase tracking-normal">Devolución</span>
                    </h1>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-light tracking-wide leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">1. Derecho de Devolución</h2>
                        <p>
                            De acuerdo con la Ley Orgánica de Defensa del Consumidor en Ecuador, el cliente dispone de un plazo de 15 días calendario para solicitar la devolución o cambio de un producto, contado a partir de la fecha de recepción.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">2. Condiciones para Alcohol</h2>
                        <p>
                            Dada la naturaleza de los productos alcohólicos y por razones de seguridad sanitaria y fiscal, las devoluciones se aceptarán bajo las siguientes condiciones estrictas:
                        </p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>El producto debe estar en su <strong>embalaje original y sellado</strong>.</li>
                            <li>Los precintos de seguridad, etiquetas de importación y sellos de impuestos internos deben estar <strong>intactos y sin manipulaciones</strong>.</li>
                            <li>No se aceptarán productos cuyas botellas hayan sido abiertas o consumidas parcialmente.</li>
                            <li>El producto no debe presentar daños físicos ajenos al transporte (golpes, etiquetas despegadas por mal almacenamiento, etc.).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">3. Causales de Devolución</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Producto defectuoso:</strong> Defectos visibles en el líquido (sedimentos extraños) o corcho en mal estado comprobable.</li>
                            <li><strong>Error en el pedido:</strong> Si el producto entregado no coincide con la marca, año o volumen solicitado.</li>
                            <li><strong>Daño en transporte:</strong> Botellas rotas o filtraciones detectadas al momento de la entrega.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">4. Proceso de Reembolso</h2>
                        <p>
                            Una vez recibida la mercadería en nuestra matriz y verificado el cumplimiento de las condiciones anteriores, se procederá al reembolso del valor pagado en un plazo de 10 a 15 días hábiles mediante transferencia bancaria o reversión a la tarjeta de crédito original.
                        </p>
                    </section>

                    <section className="bg-white/5 p-6 rounded-lg border border-white/10">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary mb-2">Aviso Importante</p>
                        <p className="text-xs italic">
                            La Huequita Quiteña se reserva el derecho de rechazar cualquier devolución que no cumpla con los estándares de seguridad fiscal y sanitaria exigidos por la ley ecuatoriana para bebidas espirituosas.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
