"use client";

import React from "react";
import { motion } from "framer-motion";

export default function PoliticasEnvioPage() {
    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
                        Políticas de Envío
                    </h1>
                    <div className="w-20 h-1 bg-primary mb-8" />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-lg max-w-none"
                >
                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white mb-4">1. Cobertura de Servicio</h2>
                        <p className="text-gray-300">
                            La Huequita realiza entregas a domicilio principalmente en el sector de <strong>Carcelén y Norte de Quito</strong>.
                            Nuestra cobertura se extiende a zonas aledañas sujetas a disponibilidad de motorizados.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white mb-4">2. Horarios de Entrega</h2>
                        <ul className="list-disc pl-5 text-gray-300 space-y-2">
                            <li><strong>Lunes a Jueves:</strong> 14:00 PM - 00:00 AM</li>
                            <li><strong>Viernes y Sábados:</strong> 14:00 PM - 02:00 AM</li>
                            <li><strong>Domingos:</strong> 14:00 PM - 22:00 PM</li>
                        </ul>
                        <p className="mt-4 text-gray-400 text-sm">
                            * Los pedidos recibidos fuera de este horario serán procesados al día siguiente hábil o cancelados según preferencia del cliente.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white mb-4">3. Costos de Envío</h2>
                        <p className="text-gray-300 mb-4">
                            El costo del envío se calcula en base a la distancia desde nuestra matriz en Carcelén:
                        </p>
                        <div className="bg-surface-dark p-6 rounded-lg border border-white/5">
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Carcelén (Sector Matriz)</span>
                                    <span className="font-bold text-primary">$1.50 - $2.00</span>
                                </li>
                                <li className="flex justify-between border-b border-white/5 pb-2">
                                    <span>Norte de Quito (Hasta El Condado / Kennedy)</span>
                                    <span className="font-bold text-primary">$2.50 - $3.50</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Otros Sectores</span>
                                    <span className="font-bold text-primary">A cotizar (Uber Flash)</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white mb-4">4. Tiempo de Entrega</h2>
                        <p className="text-gray-300">
                            El tiempo estimado de entrega es de <strong>30 a 60 minutos</strong> una vez confirmado el pedido vía WhatsApp.
                            En días de alta demanda (viernes/sábado noche) o lluvia, este tiempo puede extenderse.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-bold text-white mb-4">5. Recepción del Pedido</h2>
                        <p className="text-gray-300">
                            Es indispensable que una persona mayor de 18 años reciba el pedido.
                            El repartidor se reserva el derecho de solicitar la cédula de identidad para verificar la edad.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
