"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CanvasRevealEffect } from "./CanvasRevealEffect";

export default function LoginReact() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState<"email" | "password" | "success">("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep("password");
    setError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      if (response.ok) {
        // Iniciar animação de sucesso
        setReverseCanvasVisible(true);
        setTimeout(() => setInitialCanvasVisible(false), 50);
        setTimeout(() => setShowSuccess(true), 2000);
        
        // Redirecionar após animação
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 3500);
      } else {
        setError(result.error || 'Credenciais inválidas');
        setStep("email");
      }
    } catch (err) {
      setError('Erro ao conectar ao servidor');
      setStep("email");
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setError("");
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div className="flex w-full flex-col min-h-screen bg-black relative">
      {/* Efeitos de Canvas */}
      <div className="absolute inset-0 z-0">
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              containerClassName="bg-black"
              colors={[[255, 255, 255], [255, 255, 255]]}
              dotSize={6}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
      </div>

      {/* Container do Formulário */}
      <div className="relative z-10 flex flex-col flex-1 justify-center items-center px-6">
        <div className="w-full max-w-md mt-20">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div 
                key="email"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-5xl font-bold tracking-tight text-white">Login</h1>
                  <p className="text-xl text-white/70">Sistema de Estoque</p>
                </div>

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="relative">
                    <input 
                      type="email" 
                      placeholder="admin@estoque.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/5 text-white border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-white/30 placeholder-white/50"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Continuar
                  </button>
                </form>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div 
                key="password"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tight text-white">Digite sua senha</h1>
                  <p className="text-white/70">{email}</p>
                </div>

                {loading && (
                  <div className="py-4 text-white/70">Entrando...</div>
                )}
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="relative">
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 text-white border border-white/10 rounded-lg py-3 px-4 focus:outline-none focus:border-white/30 placeholder-white/50"
                      required
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={handleBackClick}
                      className="flex-1 bg-white/10 text-white border border-white/20 py-3 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      Voltar
                    </button>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-white text-black font-semibold py-3 rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {showSuccess && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center">
                  <svg className="w-10 h-10 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mt-6">Sucesso!</h2>
                <p className="text-white/70 mt-2">Redirecionando...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Rodapé */}
      <div className="relative z-10 p-6 text-center">
        <p className="text-xs text-white/40">
          Sistema de Gerenciamento de Estoque
        </p>
      </div>
    </div>
  );
}