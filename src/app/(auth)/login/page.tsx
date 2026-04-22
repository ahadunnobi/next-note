"use client";

import React, { useState, useEffect } from "react";
import { auth, googleProvider, githubProvider, facebookProvider } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button, Input, Separator, Tabs, Tab } from "@heroui/react";
import { Mail, Lock, Github, Globe, Search, ArrowRight, Phone, Fingerprint, Ghost } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth-provider";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { signInWithEmailAndPassword, signInWithPopup, ConfirmationResult } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, signInWithProvider, signInAnonymously, setupRecaptcha, signInPhone } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  useEffect(() => {
    // Only run if you want to avoid issues with multiple recaptchas
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    };
  }, []);

  if (!mounted) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const verifier = setupRecaptcha("recaptcha-container");
      const result = await signInPhone("+" + phoneNumber, verifier);
      setConfirmationResult(result);
      setIsOtpSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await confirmationResult?.confirm(otp);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: any) => {
    setLoading(true);
    setError("");
    try {
      await signInWithProvider(provider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await signInAnonymously();
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div id="recaptcha-container" />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-primary rounded-xl flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4 shadow-lg shadow-brand-primary/20">
              N
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-text-muted mt-2">Log in to your Next Note account</p>
          </div>

          <Tabs 
            fullWidth 
            size="md" 
            aria-label="Login Options"
            className="mb-6"
            classNames={{
              tabList: "bg-white/5 p-1 border border-white/5",
              cursor: "bg-brand-primary/20 border border-brand-primary/50",
              tabContent: "group-data-[selected=true]:text-brand-primary"
            }}
          >
            <Tab 
              key="email" 
              title={
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>Email</span>
                </div>
              }
            >
              <form onSubmit={handleEmailLogin} className="space-y-4 pt-4">
                <Input
                  label="Email"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  startContent={<Mail size={18} className="text-text-muted" />}
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-brand-primary",
                  }}
                />
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  startContent={<Lock size={18} className="text-text-muted" />}
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-brand-primary",
                  }}
                />
                <Button 
                  type="submit" 
                  color="primary" 
                  className="w-full font-semibold h-12 bg-brand-primary shadow-lg shadow-brand-primary/20"
                  isLoading={loading}
                  endContent={!loading && <ArrowRight size={18} />}
                >
                  Log In
                </Button>
              </form>
            </Tab>
            <Tab 
              key="phone" 
              title={
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>Phone</span>
                </div>
              }
            >
              <div className="space-y-4 pt-4">
                {!isOtpSent ? (
                  <form onSubmit={handlePhoneSignIn} className="space-y-4">
                    <div className="phone-input-container">
                      <PhoneInput
                        country={"us"}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        containerClass="!w-full"
                        inputClass="!w-full !bg-transparent !border-white/10 !text-white !h-12 !rounded-xl !pl-[48px]"
                        buttonClass="!bg-white/5 !border-white/10 !rounded-l-xl"
                        dropdownClass="!bg-bg-dark !text-white border-white/10"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      color="primary" 
                      className="w-full font-semibold h-12 bg-brand-primary shadow-lg shadow-brand-primary/20"
                      isLoading={loading}
                      endContent={!loading && <ArrowRight size={18} />}
                    >
                      Send Code
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <Input
                      label="Verification Code"
                      placeholder="123456"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      startContent={<Fingerprint size={18} className="text-text-muted" />}
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-brand-primary",
                      }}
                    />
                    <Button 
                      type="submit" 
                      color="primary" 
                      className="w-full font-semibold h-12 bg-brand-primary shadow-lg shadow-brand-primary/20"
                      isLoading={loading}
                      endContent={!loading && <ArrowRight size={18} />}
                    >
                      Verify & Sign In
                    </Button>
                    <button 
                      onClick={() => setIsOtpSent(false)}
                      className="text-xs text-text-muted hover:text-white w-full text-center"
                    >
                      Change Number
                    </button>
                  </form>
                )}
              </div>
            </Tab>
          </Tabs>
          
          {error && (
            <p className="text-red-500 text-xs mt-1 text-center">{error}</p>
          )}

          <div className="my-8 flex items-center gap-4">
            <Separator className="flex-1 bg-white/10" />
            <span className="text-xs text-text-muted uppercase tracking-widest font-medium">Or continue with</span>
            <Separator className="flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <Button 
              variant="bordered" 
              className="border-white/10 hover:bg-white/5 h-12"
              onPress={() => handleSocialLogin(googleProvider)}
            >
              <Globe size={20} />
            </Button>
            <Button 
              variant="bordered" 
              className="border-white/10 hover:bg-white/5 h-12"
              onPress={() => handleSocialLogin(githubProvider)}
            >
              <Github size={20} />
            </Button>
            <Button 
              variant="bordered" 
              className="border-white/10 hover:bg-white/5 h-12"
              onPress={() => handleSocialLogin(facebookProvider)}
            >
              <Globe size={20} /> {/* Placeholder for Facebook if missing */}
            </Button>
          </div>

          <Button 
            variant="ghost" 
            className="w-full border-white/10 hover:border-white/20 hover:bg-white/5 h-12 text-text-muted"
            onPress={handleGuestLogin}
            startContent={<Ghost size={18} />}
          >
            Continue as Guest
          </Button>

          <p className="text-center text-sm text-text-muted mt-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-brand-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
