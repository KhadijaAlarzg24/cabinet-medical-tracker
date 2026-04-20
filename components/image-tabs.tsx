import { Briefcase, TrendingUp, LayoutDashboard, UserPlus, Calendar, ShieldCheck } from "lucide-react";


const features = [
  {
    title: "Gestion des Patients",
    description: "Créez des dossiers numériques complets pour chaque patient et suivez leur historique médical.",
    icon: UserPlus,
  },
  {
    title: "Suivi des Rendez-vous",
    description: "Organisez votre emploi du temps avec un calendrier interactif et des rappels automatiques.",
    icon: Calendar,
  },
  {
    title: "Sécurité des Données",
    description: "Toutes les données de vos patients sont protégées et sauvegardées en toute sécurité.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  return (
    <main>
      

      
      <section className="border-t bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="flex flex-col">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 text-2xl font-semibold text-black">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </main>
  );
}