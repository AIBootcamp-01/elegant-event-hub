import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { images, stats } from "@/lib/site-data";
import { Heart, Sparkles, Award } from "lucide-react";
import { getAbout, getTeam } from "@/lib/db";

export const Route = createFileRoute("/_site/about")({
  head: () => ({
    meta: [
      { title: "About Aura Events — Our Story, Mission & Team" },
      { name: "description", content: "Learn about Aura Events — India's trusted luxury event planners with 12+ years and 850+ celebrations across 42 cities." },
      { property: "og:title", content: "About Aura Events" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  const [about, setAbout] = useState({
    storyTitle: "Born from a love for bringing people together.",
    storyText1: "Aura Events began in a small Mumbai studio in 2012 with one belief — that every family's joyful moment deserves a stage of its own. Twelve years on, we've designed weddings in Udaipur palaces, birthdays in Goa beach houses, and engagements under Himalayan skies.",
    storyText2: "What hasn't changed is the quiet promise behind every event: that your family will be heard, your vision honored, and your guests cared for like our own.",
    aboutImageUrl: images.engagement,
    missionTitle: "Our Mission",
    missionText: "To turn life's milestones into stories worth retelling — through thoughtful design, warm hospitality and joyful execution.",
    visionTitle: "Our Vision",
    visionText: "To be India's most loved name in celebrations — synonymous with elegance, trust, and unforgettable memories.",
  });

  const [teamMembers, setTeamMembers] = useState([
    { name: "Ishita Verma", role: "Founder & Creative Director", image: images.babyshower },
    { name: "Raghav Iyer", role: "Head of Production", image: images.corporate },
    { name: "Meher Khanna", role: "Lead Designer", image: images.birthday },
    { name: "Aditya Rao", role: "Destination Specialist", image: images.anniversary },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const dbAbout = await getAbout();
        if (dbAbout) {
          setAbout({
            storyTitle: dbAbout.storyTitle,
            storyText1: dbAbout.storyText1,
            storyText2: dbAbout.storyText2,
            aboutImageUrl: dbAbout.aboutImageUrl || images.engagement,
            missionTitle: dbAbout.missionTitle,
            missionText: dbAbout.missionText,
            visionTitle: dbAbout.visionTitle,
            visionText: dbAbout.visionText,
          });
        }

        const dbTeam = await getTeam();
        if (dbTeam.length > 0) {
          const defaultTeamImages = [images.babyshower, images.corporate, images.birthday, images.anniversary];
          setTeamMembers(
            dbTeam.map((tm, idx) => ({
              name: tm.name,
              role: tm.role,
              image: tm.image || defaultTeamImages[idx % defaultTeamImages.length],
            }))
          );
        }
      } catch (e) {
        console.error("Failed to load about details from Firestore, using static defaults:", e);
      }
    }
    loadData();
  }, []);

  return (
    <>
      <section className="relative h-[55vh] -mt-20 flex items-end overflow-hidden">
        <img src={images.reception} alt="" className="absolute inset-0 h-full w-full object-cover animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-primary/30" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pb-16 text-white">
          <p className="text-xs uppercase tracking-[0.4em] text-gold mb-4">About Us</p>
          <h1 className="font-display text-5xl md:text-7xl max-w-2xl leading-tight">A decade of <em className="not-italic text-gold-gradient">love stories</em>, crafted by hand.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold mb-3">Our Story</p>
          <h2 className="font-display text-3xl md:text-4xl leading-tight">{about.storyTitle}</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            {about.storyText1}
          </p>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {about.storyText2}
          </p>
        </div>
        <img src={about.aboutImageUrl} alt="Aura Events styling" className="rounded-3xl shadow-luxe aspect-[4/5] object-cover" loading="lazy" />
      </section>

      <section className="bg-blush-gradient">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 grid md:grid-cols-2 gap-10">
          {[
            { icon: Sparkles, title: about.missionTitle, text: about.missionText },
            { icon: Heart, title: about.visionTitle, text: about.visionText },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-3xl bg-card p-10 shadow-soft">
              <div className="h-12 w-12 rounded-full bg-gold-gradient text-gold-foreground inline-flex items-center justify-center mb-5">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-3xl">{title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed text-lg">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-5xl text-gold-gradient">{s.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-20 md:pb-28">
        <SectionHeading eyebrow="Meet the Team" title="The hearts behind your celebrations" />
        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {teamMembers.map((m) => (
            <div key={m.name} className="text-center">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-soft mb-4">
                <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <h4 className="font-display text-xl">{m.name}</h4>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-5 lg:px-8 py-20 text-center">
          <Award className="h-10 w-10 mx-auto text-gold" />
          <h2 className="mt-5 font-display text-3xl md:text-4xl text-white">Why families trust us</h2>
          <p className="mt-4 text-white/80 max-w-2xl mx-auto leading-relaxed">
            Transparent pricing. Senior planners on every event. A team of 80+ artisans, florists,
            and coordinators on-ground. And a promise we've kept across 850+ celebrations: no
            surprises, only delight.
          </p>
        </div>
      </section>
    </>
  );
}
