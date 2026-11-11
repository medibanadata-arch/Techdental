import React, { useState } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import { TopHeader } from "@/components/TopHeader";
import { GlobalFooter } from "@/Components/GlobalFooter";
import Seo from "@/Components/Seo";
import { PageProps } from '@inertiajs/core';
import { getWebsiteTexts } from '@/data/websiteTexts';

interface Member {
  id: number;
  name: string;
  role: string;
  section: string;
  image: string;
  quote: string | null;
}

interface Props extends PageProps {
  members: Member[];
  locations?: any[];
  nav_menu?: any;
}

type ProfileSize = 'lead' | 'regular' | 'medium' | 'ceo' | 'small';

const lora = { fontFamily: "'Lora', Georgia, serif" };
const heroLine = 'linear-gradient(90deg, transparent, #E9D5A8, transparent)';
const goldLine = 'linear-gradient(90deg, transparent, #B08A4A, transparent)';

const photoSizes: Record<ProfileSize, string> = {
  lead: 'h-[224px] w-[224px] md:h-[260px] md:w-[260px] xl:h-[288px] xl:w-[288px]',
  regular: 'h-[136px] w-[136px] md:h-[160px] md:w-[160px] xl:h-[184px] xl:w-[184px]',
  medium: 'h-[136px] w-[136px] md:h-[180px] md:w-[180px] xl:h-[220px] xl:w-[220px]',
  small: 'h-[136px] w-[136px] md:h-[160px] md:w-[160px] xl:h-[176px] xl:w-[176px]',
  ceo: 'h-[176px] w-[176px] md:h-[224px] md:w-[224px]',
};

const nameSizes: Record<ProfileSize, string> = {
  lead: 'mt-[30px] text-[24px] md:mt-10 md:text-[28px]',
  regular: 'mt-[22px] text-[16.5px] md:mt-[30px] md:text-[20px]',
  medium: 'mt-[22px] text-[16.5px] md:mt-[30px] md:text-[20px]',
  small: 'mt-[22px] text-[16.5px] md:mt-[30px] md:text-[20px]',
  ceo: 'mt-[22px] text-[16.5px] md:mt-[30px] md:text-[20px]',
};

const roleSizes: Record<ProfileSize, string> = {
  lead: 'text-[14px] md:text-[16px]',
  regular: 'text-[12px] md:text-[14px]',
  medium: 'text-[12px] md:text-[14px]',
  small: 'text-[12px] md:text-[14px]',
  ceo: 'text-[12px] md:text-[14px]',
};

const slugFor = (name: string) => (name || '').toLowerCase().replace(/[.']/g, '').replace(/\s+/g, '-');

const SectionHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <h2
    className={`mb-11 text-center text-[28px] font-semibold leading-tight text-[#6E0B1B] md:mb-16 md:text-[36px] ${className || ''}`}
    style={lora}
  >
    {children}
    <span className="mx-auto mt-5 block h-[2px] w-24" style={{ background: goldLine }} />
  </h2>
);

const ProfileCard: React.FC<{
  member: Member;
  size?: ProfileSize;
  detailsLabel?: string;
}> = ({ member, size = 'regular', detailsLabel }) => (
  <div className="flex flex-col items-center text-center">
    <div className={`relative ${photoSizes[size]}`}>
      <img
        src={member.image}
        alt={member.name}
        loading="lazy"
        className="h-full w-full rounded-full object-cover"
        style={{ transform: 'scale(1.07)' }}
      />
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-[#3c1419]/15" />
    </div>
    <h3
      className={`${nameSizes[size]} font-semibold leading-[1.3] text-[#2A1D20]`}
      style={lora}
    >
      {member.name}
      <span className="mx-auto mb-2.5 mt-3 block h-[2px] w-7 rounded-sm bg-[#B08A4A]" />
    </h3>
    <p className={`${roleSizes[size]} font-medium leading-[1.4] text-[#6E0B1B]`}>{member.role}</p>
    {detailsLabel && (
      <Link
        href={`/team/${slugFor(member.name)}`}
        aria-label={`${detailsLabel} — ${member.name}`}
        className="mt-4 inline-flex items-center gap-1 border-b border-[#B08A4A]/70 pb-0.5 text-[11px] font-semibold text-[#6E0B1B] transition-colors hover:border-[#6E0B1B] hover:text-[#9b2242] md:text-xs"
      >
        {detailsLabel} <span aria-hidden="true">&rarr;</span>
      </Link>
    )}
  </div>
);

export default function TeamPublicIndex({ members = [], locations = [], nav_menu }: Props) {
  const [selectedBranch, setSelectedBranch] = useState("");
  const page = usePage();
  const copy = getWebsiteTexts((page.props as any)?.site_settings?.website_texts);

  const management = members.filter((m) => m.section === 'management');
  const ceoAssistant = members.filter((m) => m.section === 'ceo_assistant');
  const digital = members.filter((m) => m.section === 'digital_marketing');
  const callCenter = members.filter((m) => m.section === 'call_center');

  return (
    <div
      className="min-h-screen w-full bg-[#FAF5EF] font-sans text-[#2A1D20] antialiased"
      style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', 'SolaimanLipi', 'Noto Sans Bengali', sans-serif" }}
    >
      <Seo
        title={copy.team_seo_title}
        description={copy.team_seo_desc}
        path="/team"
      />
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:wght@600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <TopHeader locations={locations} selectedBranch={selectedBranch} onBranchChange={setSelectedBranch} navMenu={nav_menu} />

      <style>{`
        .td-team-hero { border-radius: 0 0 50% 50% / 0 0 80px 80px; }
        @media (max-width: 600px) { .td-team-hero { border-radius: 0 0 50% 50% / 0 0 40px 40px; } }
      `}</style>

      {/* Hero */}
      <section
        className="td-team-hero relative overflow-hidden px-5 pb-[92px] pt-16 text-center text-white md:px-6 md:pb-[132px] md:pt-[104px]"
        style={{
          background:
            'radial-gradient(800px 280px at 50% 115%, #9c2236 0, transparent 70%), linear-gradient(180deg, #5A0815, #74101F)',
        }}
      >
        <span className="mx-auto mb-5 block h-[2px] w-16 md:mb-7 md:w-[84px]" style={{ background: heroLine }} />
        <h1 className="text-[36px] font-semibold leading-[1.1] tracking-[0.3px] md:text-[48px] lg:text-[60px]" style={lora}>
          {copy.team_heading}
        </h1>
        <p className="mt-3 text-[15px] tracking-[0.4px] text-[#E9D5A8] md:mt-[18px] md:text-[18px]">
          {copy.team_subtitle}
        </p>
      </section>

      {/* 1. Leadership */}
      <section className="bg-[#FAF5EF] pb-14 pt-[60px] md:pb-[84px] md:pt-24">
        <div className="mx-auto w-full max-w-[1432px] px-3.5 md:px-14">
          <h2 className="sr-only">Leadership</h2>
          <div className="flex flex-wrap justify-center gap-y-[60px] lg:gap-x-12 lg:gap-y-16">
            {management.map((m) => (
              <div key={m.id} className="w-full lg:w-[calc(33.333%_-_2.05rem)]">
                <ProfileCard
                  member={m}
                  size="lead"
                  detailsLabel={copy.team_details_label}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. CEO Assistant */}
      <section className="bg-white py-14 md:py-[84px]">
        <div className="mx-auto w-full max-w-[1432px] px-3.5 md:px-14">
          <SectionHeading>{copy.team_ceo_heading}</SectionHeading>
          <div className="mx-auto flex w-full max-w-[240px] justify-center md:max-w-[300px]">
            {ceoAssistant.map((m) => (
              <ProfileCard key={m.id} member={m} size="ceo" />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Digital Marketing Team */}
      <section className="bg-[#FAF5EF] py-14 md:py-[84px]">
        <div className="mx-auto w-full max-w-[1432px] px-3.5 md:px-14">
          <SectionHeading>{copy.team_marketing_heading}</SectionHeading>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-12 lg:gap-x-8 lg:gap-y-16">
            {digital.map((m) => (
              <div key={m.id} className="w-[calc(50%_-_0.25rem)] lg:w-[calc(25%_-_1.55rem)]">
                <ProfileCard member={m} size="medium" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Call Center Team */}
      <section className="bg-white py-14 md:py-[84px]">
        <div className="mx-auto w-full max-w-[1432px] px-3.5 md:px-14">
          <SectionHeading>{copy.team_call_heading}</SectionHeading>
          <div className="flex flex-wrap justify-center gap-x-2 gap-y-12 lg:gap-x-4 lg:gap-y-16">
            {callCenter.map((m) => (
              <div key={m.id} className="w-[calc(50%_-_0.25rem)] lg:w-[calc(25%_-_0.8rem)] xl:w-[calc(16.666%_-_0.9rem)]">
                <ProfileCard member={m} size="small" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}
