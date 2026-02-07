"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/api";

export default function CheckoutPage() {
    const { items, totalPrice, totalItems, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        direccion: "",
        referencia: "",
        metodoPago: "transferencia", // default
        notas: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setLoading(false);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
        if (!formData.telefono.trim()) newErrors.telefono = "El teléfono es obligatorio";
        if (formData.telefono.length < 9) newErrors.telefono = "Teléfono inválido";
        if (!formData.direccion.trim()) newErrors.direccion = "La dirección es obligatoria";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        // Construir mensaje de WhatsApp
        const WHATSAPP_NUMBER = "593964065880";

        let message = `¡Hola La Huequita! 🥃 Nuevo pedido Web:%0A%0A`;
        message += `*Cliente:* ${formData.nombre}%0A`;
        message += `*Teléfono:* ${formData.telefono}%0A`;
        message += `*Dirección:* ${formData.direccion}%0A`;
        if (formData.referencia) message += `*Ref:* ${formData.referencia}%0A`;
        message += `*Pago:* ${formData.metodoPago.toUpperCase()}%0A%0A`;

        message += `*PEDIDO:*%0A`;
        items.forEach(item => {
            message += `• ${item.quantity}x ${item.nombre} ($${(parseFloat(item.precio) * item.quantity).toFixed(2)})%0A`;
        });

        message += `%0A*TOTAL: $${totalPrice.toFixed(2)}*`;

        if (formData.notas) {
            message += `%0A%0A*Notas:* ${formData.notas}`;
        }

        // Opcional: Aquí podrías enviar los datos a tu backend para guardar el pedido antes de ir a WhatsApp

        // Abrir WhatsApp
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');

        // Redirigir a página de gracias
        router.push("/checkout/success");
    };

    if (loading) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background-dark pt-32 px-6 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">shopping_cart_off</span>
                <h1 className="text-2xl font-bold text-white mb-2">Tu carrito está vacío</h1>
                <p className="text-gray-400 mb-8">Agrega algunos licores premium para continuar.</p>
                <Link href="/productos" className="bg-primary text-black px-8 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white transition-colors">
                    Ver Catálogo
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* Columna Izquierda: Formulario */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface-dark border border-white/5 p-8 rounded-2xl"
                    >
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                            1. Datos de Envío
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Nombre Completo</label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={`w-full bg-black/20 border ${errors.nombre ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:border-primary outline-none transition-colors`}
                                        placeholder="Ej. Juan Pérez"
                                    />
                                    {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Teléfono / WhatsApp</label>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className={`w-full bg-black/20 border ${errors.telefono ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:border-primary outline-none transition-colors`}
                                        placeholder="Ej. 0991234567"
                                    />
                                    {errors.telefono && <p className="text-red-500 text-xs">{errors.telefono}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Dirección de Entrega</label>
                                <input
                                    type="text"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    className={`w-full bg-black/20 border ${errors.direccion ? 'border-red-500' : 'border-white/10'} rounded-lg p-3 text-white focus:border-primary outline-none transition-colors`}
                                    placeholder="Calle principal, numeración y calle secundaria"
                                />
                                {errors.direccion && <p className="text-red-500 text-xs">{errors.direccion}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Referencia (Opcional)</label>
                                <input
                                    type="text"
                                    name="referencia"
                                    value={formData.referencia}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="Ej. Frente al parque, casa blanca..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Notas del Pedido (Opcional)</label>
                                <textarea
                                    name="notas"
                                    value={formData.notas}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-primary outline-none transition-colors"
                                    placeholder="Instrucciones especiales..."
                                />
                            </div>

                            <h2 className="text-xl font-bold text-white uppercase tracking-widest mt-8 mb-6 border-b border-white/10 pb-4">
                                2. Método de Pago
                            </h2>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'transferencia', label: 'Transferencia Bancaria', icon: 'account_balance' },
                                    { id: 'efectivo', label: 'Efectivo contra entrega', icon: 'payments' },
                                    { id: 'tarjeta', label: 'Tarjeta (Datafast a domicilio)', icon: 'credit_card' }
                                ].map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${formData.metodoPago === method.id
                                            ? 'bg-primary/10 border-primary shadow-[0_0_15px_rgba(238,189,43,0.1)]'
                                            : 'bg-black/20 border-white/5 hover:border-white/20'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="metodoPago"
                                            value={method.id}
                                            checked={formData.metodoPago === method.id}
                                            onChange={handleChange}
                                            className="w-5 h-5 accent-primary"
                                        />
                                        <span className="material-symbols-outlined text-gray-400">{method.icon}</span>
                                        <span className="text-sm font-bold text-white uppercase tracking-wide">{method.label}</span>
                                    </label>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-primary text-black font-black uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors shadow-lg shadow-primary/20 mt-8 flex items-center justify-center gap-2"
                            >
                                <span>Confirmar Pedido</span>
                                <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                            <p className="text-[10px] text-center text-gray-500 mt-4">
                                Al confirmar, serás redirigido a WhatsApp para finalizar la coordinación.
                            </p>
                            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl flex gap-3 items-start">
                                <span className="material-symbols-outlined text-yellow-500 mt-0.5">lock</span>
                                <div className="text-xs text-gray-400">
                                    <p className="font-bold text-yellow-500 mb-1 uppercase tracking-wider">Pago Seguro</p>
                                    <p>
                                        El pago se realiza únicamente al momento de la entrega o vía transferencia directa.
                                        <strong>Nunca te pediremos datos de tu tarjeta en este sitio web.</strong>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>

                {/* Columna Derecha: Resumen */}
                <div className="lg:sticky lg:top-32 h-fit">
                    <div className="bg-surface-dark border border-white/5 p-8 rounded-2xl">
                        <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-6 pb-4 border-b border-white/10">Resumen del Pedido</h2>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2 custom-scrollbar">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-16 h-16 bg-black/20 rounded-lg overflow-hidden border border-white/5 flex-shrink-0">
                                        <img
                                            src={getImageUrl(item.imagen) || "/placeholder.jpg"}
                                            alt={item.nombre}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-xs font-bold text-white uppercase leading-tight line-clamp-2">{item.nombre}</h4>
                                            <span className="text-xs font-bold text-white">${(parseFloat(item.precio) * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 mt-1">Cant: {item.quantity} x ${item.precio}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Subtotal</span>
                                <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Envío</span>
                                <span className="text-primary text-xs font-bold uppercase">Por calcular</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-4">
                                <span className="text-lg font-bold text-white uppercase">Total</span>
                                <span className="text-2xl font-black text-primary">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="mt-6 flex items-start gap-3 bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                            <span className="material-symbols-outlined text-blue-400">verified_user</span>
                            <p className="text-[10px] text-blue-200 leading-relaxed">
                                <strong>Compra Segura:</strong> Tus datos son encriptados y solo se usan para procesar la entrega. No guardamos información de tarjetas.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
