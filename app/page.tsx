"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserPlus, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

const features = [
  {
    id: "patients",
    title: "Gestion des Patients",
    description: "Accédez instantanément aux dossiers médicaux et historiques.",
    icon: UserPlus,
    image: "/hero-images/hero1.png",  
  },
  {
    id: "appointments",
    title: "Suivi des Rendez-vous",
    description: "Calendrier interactif pour organiser vos consultations.",
    icon: Calendar,
    image: "/hero-images/hero2.png",
  },
  {
    id: "security",
    title: "Données Sécurisées",
    description: "Cryptage avancé     Pour garantir la confidentialité des données de vos patients.ىحك",
    icon: ShieldCheck,
    image: "/hero-images/hero3.png",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState(features[0].id);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 text-center container mx-auto">
        <h1 className="text-5xl font-extrabold text-black mb-6">Cabinet Médical Intelligent</h1>
        <Button size="lg" className="bg-blue-600">Commencer Maintenant</Button>
      </section>

      
      <section className="bg-slate-50 py-24 border-t">
        <div className="container mx-auto px-4">
          
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((f) => (
              <div
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={`cursor-pointer p-8 rounded-2xl transition-all duration-300 ${
                  activeTab === f.id 
                  ? "bg-white shadow-2xl ring-2 ring-blue-500 scale-105" 
                  : "bg-transparent opacity-50 hover:opacity-100"
                }`}
              >
                <f.icon className={`h-10 w-10 mb-4 ${activeTab === f.id ? "text-blue-600" : "text-gray-400"}`} />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>

         
          <div className="relative mx-auto max-w-5xl rounded-3xl border-8 border-white shadow-2xl overflow-hidden">
            {features.map((f) => (
              activeTab === f.id && (
                <Image
                  key={f.id}
                  src={f.image}
                  alt={f.title}
                  width={1200}
                  height={800}
                  className="w-full h-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
                />
              )
            ))}
          </div>

        </div>
      </section>
    </main>
    
  );
}