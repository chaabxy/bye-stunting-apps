import { Award, Heart } from "lucide-react";

interface FeatureCardProps {
  type: "excellence" | "commitment";
}

const featureData = {
  excellence: {
    icon: Award,
    title: "Keunggulan",
    description:
      "Teknologi AI terdepan untuk prediksi stunting yang akurat dengan mengintegrasikan Machine Learning Dalam Pengolahan Data Stunting",
  },
  commitment: {
    icon: Heart,
    title: "Komitmen",
    description:
      "Kami mendedikasikan penuh untuk menurunkan angka stunting di Indonesia menjadi 18% pada tahun 2025",
  },
};

export function FeatureCard({ type }: FeatureCardProps) {
  const feature = featureData[type];
  const IconComponent = feature.icon;

  return (
    <div className="bg-input from-blue-50 to-cyan-50 -950/30 -950/30 rounded-xl p-6 shadow-md border border-blue-100 -900 flex flex-col items-center justify-center text-center">
      <div className="bg-blue-100 -900/50 p-3 rounded-lg mb-4">
        <IconComponent className="h-8 w-8 text-secondary -400" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-primary -300">
        {feature.title}
      </h3>
      <p className="text-muted-foreground -400 text-sm">
        {feature.description}
      </p>
    </div>
  );
}
