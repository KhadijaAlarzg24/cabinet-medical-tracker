"use client"


import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; 
import { useState } from "react";

export default function Home() {
  const[activeTab,setActiveTab]=useState("organize");//organize
  return (
    <div className="flex min-h-screen bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-4xl text-center"> 
            <h1 className="text-black mb-6 text-6xl font-bold">
              La solution complète pour la gestion de votre cabinet médical
            </h1>
            <p className="text-muted-foreground mb-10 text-xl">
              Gérez vos patients, vos rendez-vous et vos dossiers médicaux en un seul endroit, simplement et efficacement.
            </p>

            <div className="flex flex-col items-center gap-4"> 
              <Link href="/signUp">
                <Button size="lg" className="h-12 px-8 text-lg font-medium">
                  Essayer gratuitement <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                Gratuit pour toujours. Aucune carte de crédit requise.
              </p>
            </div>
          </div>
        </section>

        {/* Hero Image Section with Tabs */}
        <section className="border-t bg-white py-16"> 
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              {/* Tabs */}
              <div className="flex gap-2 justify-center mb-8">
  <Button 
    variant={activeTab === "organize" ? "default" : "outline"}
    onClick={() => setActiveTab("organize")}
  >
    Gérer les Rendez-vous
  </Button>

  <Button 
    variant={activeTab === "Dossiers" ? "default" : "outline"}
    onClick={() => setActiveTab("Dossiers")}
  >
    Dossiers Patients
  </Button>

  <Button 
    variant={activeTab === "Statistiques" ? "default" : "outline"}
    onClick={() => setActiveTab("Statistiques")}
  >
    Statistiques Médicales
  </Button>
</div>
              
              <div className="relative mx-auto overflow-hidden rounded-lg border border-gray-200 shadow-xl">
                {activeTab==="organize" &&(
                <Image 
                  src="/hero-images/hero1.png" 
                  alt=" Gérer les Rendez-vous" 
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
                )}
                {activeTab==="Dossiers" &&(
                <Image 
                  src="/hero-images/hero2.png" 
                  alt="Dossiers Patients" 
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
                )}
                {activeTab==="Statistiques" &&(
                <Image 
                  src="/hero-images/hero3.png" 
                  alt="Statistiques Médicales" 
                  width={1200}
                  height={800}
                  className="w-full h-auto"
                />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}