"use client";

import React from "react";
import { motion } from "framer-motion";

export default function ShippingPolicyPage() {
    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
                        Políticas de <span className="text-primary italic font-display lowercase tracking-normal">Envío</span>
                    </h1>
                    <div className="h-1 w-20 bg-primary rounded-full"></div>
                </motion.div>

                <div className="prose prose-invert max-w-none space-y-8 text-gray-300 font-light tracking-wide leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">1. Cobertura de Entrega</h2>
                        <p>
                            La Huequita Quiteña realiza entregas a domicilio exclusivamente en el sector de <strong>Quito Norte y Pomasqui</strong>.
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                            * Nos reservamos el derecho de restringir la entrega en zonas consideradas de alto riesgo o fuera del perímetro urbano accesible.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">2. Tiempos de Entrega</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Entregas Inmediatas (Express):</strong> Disponibles para pedidos confirmados entre las 10:00 AM y 10:00 PM. El tiempo estimado de llegada varía entre 30 a 60 minutos dependiendo de la ubicación y el tráfico.</li>
                            <li><strong>Entregas Programadas:</strong> Puede solicitar su pedido para una fecha y hora específica comunicándose directamente con nuestro servicio al cliente.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">3. Costos de Envío</h2>
                        <p>
                            El costo de envío se calcula dinámicamente según la distancia desde nuestra matriz en Carcelén:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                            <li><strong>Carcelén y Alrededores:</strong> Tarifa base preferencial.</li>
                            <li><strong>Resto de Quito Norte y Pomasqui:</strong> Tarifa calculada por kilómetro.</li>
                        </ul>
                        <p className="mt-4 font-bold text-white">
                            * Pedidos superiores a $100.00 pueden aplicar para envío gratuito en zonas seleccionadas.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold uppercase tracking-widest text-white border-b border-white/10 pb-2 mb-4">4. Recepción del Pedido</h2>
                        <div className="bg-primary/10 p-4 rounded border border-primary/20">
                            <p className="text-white font-bold mb-2">VERIFICACIÓN DE EDAD OBLIGATORIA</p>
                            <p className="text-sm">
                                Al momento de la entrega, el repartidor solicitará obligatoriamente la Cédula de Identidad física para verificar que quien recibe es mayor de 18 años. Si no se puede verificar la edad, el producto NO será entregado y se cobrará el costo del envío.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
