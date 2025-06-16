"use client";

import Image from "next/image";
import { Target, BookOpen } from "lucide-react";
import { TentangKamiPresenter } from "@/presenter/user/tentang-kami-presenter";
import { HeroSection } from "@/components/tentang-kami/hero-section";
import { MissionItem } from "@/components/tentang-kami/mission-item";
import { TeamMemberCard } from "@/components/tentang-kami/team-member-card";
import { FeatureCard } from "@/components/tentang-kami/feature-card";
import { useMemo } from "react";

export default function TentangKami() {
  const presenter = useMemo(() => new TentangKamiPresenter(), []);
  const companyInfo = presenter.getCompanyInfo();
  const teamMembers = presenter.getTeamMembers();
  const missionItems = presenter.getMissionItems();

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="text-center mb-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-primary from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          Tentang <span className="text-secondary">Kami</span>
        </h1>
        <p className="text-muted-foreground -400 text-sm md:text-xl mx-auto">
          {companyInfo.description}
        </p>
      </div>

      {/* Hero Section */}
      <HeroSection
        title={companyInfo.heroTitle}
        subtitle={companyInfo.heroSubtitle}
      />

      {/* Misi dan Visi */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 px-5">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className=" bg-blue-100 -900/50 p-2 rounded-full ">
              <Target className="h-6 w-6 text-secondary -400" />
            </div>
            <h2 className="text-2xl font-bold text-primary -300">
              Misi <span className="text-secondary">Kami</span>
            </h2>
          </div>

          <p className="text-muted-foreground -400 text-sm max-sm:text-justify">
            {companyInfo.mission}
          </p>

          <div className="flex items-center gap-3 mt-8 mb-4">
            <div className="bg-blue-100 -900/50 p-2 rounded-full">
              <BookOpen className="h-6 w-6 text-secondary -400" />
            </div>
            <h2 className=" text-2xl font-bold text-primary -300">
              Apa yang <span className="text-secondary">Kami Lakukan?</span>
            </h2>
          </div>

          <ul className="space-y-4">
            {missionItems.map((item, index) => (
              <MissionItem key={index} icon={item.icon} text={item.text} />
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <FeatureCard type="excellence" />
          <FeatureCard type="commitment" />

          <div className="col-span-1 md:col-span-2">
            <Image
              src="/tentang-kami.png"
              alt="Komitmen ByeStunting"
              width={600}
              height={600}
              className="rounded-lg shadow-md object-cover w-full md:h-[500px] lg:h-[390px]"
            />
          </div>
        </div>
      </div>

      {/* Tim Kami */}
      <div className="mb-16 px-5 -mt-5">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-primary -300">
            Tim <span className="text-secondary">Kami</span>
          </h2>
          <p className="text-muted-foreground -400 max-w-2xl mx-auto">
            Kenali para profesional berbakat yang berdedikasi untuk mewujudkan
            Indonesia bebas stunting
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <TeamMemberCard key={index} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
