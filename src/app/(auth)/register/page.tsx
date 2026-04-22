"use client";

import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button, Input, Separator } from "@heroui/react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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
            <h1 className="text-2xl font-bold tracking-tight">Create account</h1>
            <p className="text-text-muted mt-2">Start your premium note-taking journey</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startContent={<User size={18} className="text-text-muted" />}
              variant="bordered"
              classNames={{
                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-brand-primary",
              }}
            />
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
            
            {error && (
              <p className="text-red-500 text-xs mt-1">{error}</p>
            )}

            <Button 
              type="submit" 
              color="primary" 
              className="w-full font-semibold h-12 bg-brand-primary shadow-lg shadow-brand-primary/20"
              isLoading={loading}
              endContent={!loading && <ArrowRight size={18} />}
            >
              Sign Up
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-primary hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
