import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { AnimatedSection, AnimatedStagger, AnimatedChild } from "@/components/shared/animations";

export const dynamic = "force-dynamic";

const values = [
  {
    title: "Organic Practices",
    desc: "No synthetic pesticides or fertilizers. We nurture our soil naturally to grow healthier, tastier produce.",
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>,
  },
  {
    title: "Farm to Table",
    desc: "From our fields to your kitchen in the shortest time possible. Freshness you can taste in every bite.",
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    title: "Sustainability",
    desc: "We protect our environment through water conservation, biodiversity, and eco-friendly farming methods.",
    icon: <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 22L12 2l10 20H2z" /><path d="M12 18v-6" /><path d="M12 9v-1" /></svg>,
  },
];

const process = [
  { step: "01", title: "Seed Selection", desc: "We choose the finest organic seeds, naturally adapted to our local climate and soil." },
  { step: "02", title: "Sowing & Care", desc: "Seeds are sown with traditional techniques. Our crops are nurtured with compost and natural fertilizers." },
  { step: "03", title: "Growth & Harvest", desc: "We let nature take its course. Crops grow at their own pace, developing full flavor and nutrition." },
  { step: "04", title: "Quality Check", desc: "Each harvest is inspected for quality, ripeness, and freshness before it leaves the farm." },
  { step: "05", title: "Packaging", desc: "Produce is gently packed in eco-friendly materials to preserve freshness and reduce waste." },
  { step: "06", title: "Delivery", desc: "From our farm to your doorstep — same-day delivery across Maharashtra." },
];

const timeline = [
  { year: "2020", title: "The Beginning", desc: "Bhole Farms was founded with a vision for organic farming and a commitment to chemical-free produce." },
  { year: "2021", title: "First Harvest", desc: "Our first organic crop was harvested and shared with local communities." },
  { year: "2022", title: "Growth", desc: "Expanded fruit varieties, adding Kesar and Alphonso mango orchards alongside seasonal crops." },
  { year: "2023", title: "Local Customer Growth", desc: "Growing demand from families and local markets for our fresh organic produce." },
  { year: "2024", title: "Sustainable Farming Improvements", desc: "Adopted advanced water conservation and natural composting methods across the farm." },
  { year: "2025", title: "Community Growth", desc: "Hundreds of happy customers. Supplying to restaurants and stores across Maharashtra." },
  { year: "2026+", title: "Website Launch, Online Orders & Future Expansion", desc: "Expanding our organic network, launching online ordering, and bringing more varieties to your table." },
];

const fallbackPosts = [
  { id: "1", slug: "journey-of-kesar-mangoes", title: "The Journey of Our Kesar Mangoes", excerpt: "From tiny blossoms to the sweetest mangoes, see how nature works its magic.", coverImage: "/images/kesar-mango.jpg", category: "Mangoes", readTime: "5 min read", createdAt: new Date("2026-06-05") },
  { id: "2", slug: "jamun-natures-purple-treasure", title: "Jamun - Nature's Purple Treasure", excerpt: "Health benefits, growing process, and why jamun is a superfruit.", coverImage: "/images/jambhul-jamun.jpg", category: "Jamun", readTime: "4 min read", createdAt: new Date("2026-05-28") },
  { id: "3", slug: "why-organic-farming-matters", title: "Why Organic Farming Matters", excerpt: "How organic farming protects our health, soil, and future generations.", coverImage: "/images/farmer-harvesting.jpg", category: "Organic Farming", readTime: "6 min read", createdAt: new Date("2026-05-20") },
  { id: "4", slug: "day-in-the-life-at-bhole-farms", title: "A Day in the Life at Bhole Farms", excerpt: "Sunrise to sunset - a glimpse of daily life on our organic farm.", coverImage: "/images/about-drone-orchard.jpg", category: "Farm Life", readTime: "3 min read", createdAt: new Date("2026-05-15") },
];

export default async function AboutPage() {
  const settings = await getSettings();
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  const displayPosts = posts.length
    ? posts.slice(0, 4).map((post) => ({
        id: post.id, slug: post.slug, title: post.title,
        excerpt: post.excerpt || "Fresh updates from Bhole Farms.",
        coverImage: post.coverImage || "", category: "Farm Life", readTime: "5 min read", createdAt: post.createdAt,
      }))
    : [];
  return (
    <>
      {/* Premium Brand Hero — Bhole Farms Story */}
      <section className="relative overflow-hidden w-full rounded-b-[24px] sm:rounded-b-[32px] md:rounded-b-[40px] lg:rounded-b-[48px]" style={{ height: "clamp(500px, 52vw, 600px)" }}>
        {/* Background — mango orchard at sunrise */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: "url(/images/mango-tree-banner.jpg)",
          }}
        />

        {/* Dark premium overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,35,15,0.93) 0%, rgba(22,48,32,0.72) 40%, rgba(46,125,50,0.42) 100%)" }} />

        {/* Decorative light rays through canopy */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
          <div className="absolute top-0 left-[12%] w-[1px] h-full bg-gradient-to-b from-white/50 via-white/10 to-transparent transform rotate-[10deg] origin-top" />
          <div className="absolute top-0 left-[30%] w-[1px] h-full bg-gradient-to-b from-white/35 via-white/8 to-transparent transform rotate-[5deg] origin-top" />
          <div className="absolute top-0 right-[25%] w-[1px] h-full bg-gradient-to-b from-white/30 via-white/5 to-transparent transform -rotate-[7deg] origin-top" />
          <div className="absolute top-0 right-[40%] w-[1px] h-full bg-gradient-to-b from-white/20 via-white/5 to-transparent transform -rotate-[3deg] origin-top" />
        </div>

        {/* Floating ambient glow orbs */}
        <div className="absolute top-20 right-[18%] w-[300px] h-[300px] rounded-full bg-accent/10 blur-[110px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-24 left-[8%] w-[240px] h-[240px] rounded-full bg-gold/8 blur-[90px] animate-[float_10s_ease-in-out_infinite_2s]" />

        {/* Content grid */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-14 items-center w-full py-14 lg:py-0">

            {/* Left — Brand story heading */}
            <div className="lg:col-span-3 space-y-5">
              <AnimatedSection>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 shadow-sm">
                  <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                  Since 2020
                </span>
              </AnimatedSection>

              <AnimatedSection delay={0.05}>
                <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] font-bold leading-[1.08] tracking-tight text-white drop-shadow-lg">
                  About <br />
                  <span className="bg-gradient-to-r from-green-300 via-green-200 to-gold bg-clip-text text-transparent">
                    Bhole Farms
                  </span>
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <p className="text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
                  Rooted in tradition, growing healthy organic fruits with love and care for generations.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.14}>
                <p className="text-white/50 text-sm max-w-lg leading-relaxed">
                  We are a family-owned fruit farm in Maharashtra dedicated to growing premium Kesar Mangoes, Alphonso Mangoes, Jamun, Guava, and seasonal fruits using sustainable organic farming practices.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.18}>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link href="/about" className="inline-flex items-center gap-2 rounded-full bg-white text-foreground px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    Explore Our Story
                  </Link>
                  <Link href="/products" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all shadow-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                    Visit the Farm
                  </Link>
                </div>
              </AnimatedSection>
            </div>

            {/* Right — Premium 4-Image Grid Collage */}
            <AnimatedSection delay={0.1} direction="right" className="lg:col-span-2 flex justify-center lg:justify-end w-full">
              <div className="grid grid-cols-2 gap-4 max-w-[380px] w-full p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                {/* Top Left: Kesar Mangoes */}
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: "url(/images/kesar-mango.jpg)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white/95 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">🥭 Kesar Mangoes</span>
                </div>

                {/* Bottom Left: Alphonso Mangoes */}
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: "url(/images/alphonso-mango.jpg)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white/95 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">🥭 Alphonso Mangoes</span>
                </div>

                {/* Bottom Right: Jamun Tree */}
                <div className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: "url(/images/jambhul-jamun.jpg)" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white/95 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded">🍇 Jamun Tree</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>

        {/* Bottom trust badges row */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 pb-8 sm:pb-10">
              {[
                { icon: "🌿", label: "100% Organic" },
                { icon: "🧪", label: "Chemical Free" },
                { icon: "👨‍🌾", label: "Family Owned Farm" },
                { icon: "🚜", label: "Sustainable Farming" },
                { icon: "🚚", label: "Farm Fresh" },
                { icon: "📍", label: "Maharashtra" },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-md px-3 py-1.5">
                  <span className="text-xs">{badge.icon}</span>
                  <span className="text-[11px] font-medium text-white/80">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-px">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block" preserveAspectRatio="none">
            <path d="M0 32C240 70 480 80 720 60C960 40 1200 10 1440 30V80H0V32Z" fill="#FAFAF7" />
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <AnimatedSection direction="left">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: "url(/images/hero-mango-basket.jpg)" }} />
              </div>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <span className="text-xs font-button font-bold uppercase tracking-[0.2em] text-primary">Our Mission</span>
              <h2 className="mt-3 font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">Bringing Nature&apos;s Best<br /><span className="text-primary">to Your Table</span></h2>
              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>Nestled in the fertile landscapes of Maharashtra, Bhole Farms is a family-owned organic farm dedicated to cultivating fresh, healthy, and chemical-free produce. Our journey began with a simple belief — that the best food comes from healthy soil, clean water, and a deep respect for nature.</p>
                <p>We grow a wide variety of seasonal fruits, vegetables, and grains using traditional farming methods combined with modern organic practices. Every seed is sown with care, every crop is nurtured naturally, and every harvest is a celebration of the earth&apos;s bounty.</p>
                <p>Our commitment to sustainability goes beyond farming. We strive to create a farm ecosystem that supports biodiversity, conserves water, and enriches the soil for future generations.</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gradient-cream relative">
        <div className="absolute inset-0 leaf-pattern" />
        <div className="relative container mx-auto px-4">
          <AnimatedSection className="text-center">
            <span className="text-xs font-button font-bold uppercase tracking-[0.2em] text-primary">Our Values</span>
            <h2 className="mt-2 font-heading text-4xl md:text-5xl font-bold text-foreground">What We Stand For</h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">The principles that guide everything we do.</p>
          </AnimatedSection>
          <AnimatedStagger className="mt-10 grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {values.map((v) => (
              <AnimatedChild key={v.title}>
                <div className="group rounded-2xl bg-white border border-border/40 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all">{v.icon}</div>
                  <h3 className="mt-4 font-heading font-bold text-lg text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </AnimatedChild>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 gradient-green" />
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
            <defs><pattern id="stats-leaf" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M30 10C20 25 15 40 25 50c-2-8 3-20 8-28 3-4 6-7 8-12" fill="#fff"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#stats-leaf)" />
          </svg>
        </div>
        <div className="relative container mx-auto px-4">
          <AnimatedStagger className="grid grid-cols-2 gap-8 md:grid-cols-4" staggerDelay={0.08}>
            {[
              { value: "5+", label: "Years of Farming", icon: "🌾" },
              { value: "500+", label: "Happy Customers", icon: "👥" },
              { value: "25+", label: "Fruit Varieties", icon: "🥭" },
              { value: "100%", label: "Organic Promise", icon: "🌿" },
            ].map((s) => (
              <AnimatedChild key={s.label}>
                <div className="text-center text-white">
                  <span className="text-4xl mb-2 block">{s.icon}</span>
                  <p className="text-4xl font-bold font-heading">{s.value}</p>
                  <p className="mt-1 text-white/70 text-sm">{s.label}</p>
                </div>
              </AnimatedChild>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center">
            <span className="text-xs font-button font-bold uppercase tracking-[0.2em] text-primary">Our Journey</span>
            <h2 className="mt-2 font-heading text-4xl md:text-5xl font-bold text-foreground">From Humble Beginnings</h2>
          </AnimatedSection>
          <div className="relative mt-12">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.year} delay={i * 0.08}>
                  <div className={`relative flex flex-col md:flex-row items-start gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                      <div className="inline-block rounded-2xl bg-white border border-border/40 p-5 shadow-sm hover:shadow-lg transition-all">
                        <span className="text-xs font-button font-bold text-primary">{item.year}</span>
                        <h3 className="font-heading font-bold text-foreground mt-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-8 h-8 rounded-full bg-primary border-4 border-background shrink-0 items-center justify-center shadow-md">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                    <div className="flex-1" />
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Founder */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Image */}
            <AnimatedSection direction="left" className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-2 ring-primary/10">
                  <Image
                    src="/images/owner-ashruba-murkute.jpg"
                    alt="Ashruba Murkute — Founder of Bhole Farms"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {/* Decorative leaf */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-2xl shadow-lg backdrop-blur-sm border border-accent/30">
                  🌿
                </div>
              </div>
            </AnimatedSection>

            {/* Content */}
            <AnimatedSection direction="right">
              <span className="text-xs font-button font-bold uppercase tracking-[0.2em] text-primary">Meet Our Founder</span>
              <h2 className="mt-3 font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight">
                Ashruba Murkute
              </h2>

              {/* Founded badge */}
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
                <svg className="w-3.5 h-3.5 text-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                <span className="text-xs font-button font-bold text-primary">Founded in 2020</span>
              </div>

              <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Ashruba Murkute founded this farm and garden in 2020 with the vision of growing healthy, naturally cultivated fruits while preserving traditional farming practices. Since its establishment, the farm has been dedicated to producing high-quality, fresh, and chemical-free produce with a strong commitment to sustainability, quality, and customer trust.
                </p>
              </div>

              {/* Quote */}
              <div className="mt-6 relative pl-6 border-l-2 border-primary/30">
                <svg className="absolute -top-1 -left-2 w-5 h-5 text-primary/20" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151C7.563 6.068 6 8.789 6 11h4v10H0z"/></svg>
                <p className="text-base italic text-foreground/80 font-medium">
                  &ldquo;Growing naturally, serving quality.&rdquo;
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-gradient-cream relative">
        <div className="absolute inset-0 leaf-pattern" />
        <div className="relative container mx-auto px-4">
          <AnimatedSection className="text-center">
            <span className="text-xs font-button font-bold uppercase tracking-[0.2em] text-primary">How We Work</span>
            <h2 className="mt-2 font-heading text-4xl md:text-5xl font-bold text-foreground">From Seed to Table</h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">Every step of our process is guided by care for nature and quality.</p>
          </AnimatedSection>
          <AnimatedStagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.06}>
            {process.map((p) => (
              <AnimatedChild key={p.step}>
                <div className="group rounded-2xl bg-white border border-border/40 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  <span className="text-4xl font-heading font-bold text-primary/20 group-hover:text-primary/40 transition-colors">{p.step}</span>
                  <h3 className="mt-2 font-heading font-bold text-foreground">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </AnimatedChild>
            ))}
          </AnimatedStagger>
        </div>
      </section>

      {/* Stories from the Farm */}
      <section className="section-padding bg-gradient-cream relative">
        <div className="absolute inset-0 leaf-pattern" />
        <div className="relative container mx-auto px-4">
          <AnimatedSection className="text-center">
            <span className="text-xs font-button font-bold uppercase tracking-[0.2em] text-primary">Stories from the Farm</span>
            <h2 className="mt-2 font-heading text-4xl md:text-5xl font-bold text-foreground">Fresh Stories. Real Life.</h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">Discover farming insights, seasonal updates, and healthy eating tips.</p>
          </AnimatedSection>
          <AnimatedStagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.06}>
            {displayPosts.map((post) => (
              <AnimatedChild key={post.id}>
                <Link href={`/blog/${post.slug}`} className="group block rounded-2xl bg-white border border-border/40 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                  <div className="relative aspect-[4/3] overflow-hidden bg-primary/5">
                    {post.coverImage ? (
                      <div className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${post.coverImage})` }} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">🌾</div>
                    )}
                    <span className="absolute bottom-3 left-3 rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-button font-bold text-primary shadow-sm">{post.category}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-foreground group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}<span className="mx-2">•</span>{post.readTime}</span>
                      <span className="font-bold text-primary group-hover:translate-x-0.5 transition-transform">Read More →</span>
                    </div>
                  </div>
                </Link>
              </AnimatedChild>
            ))}
          </AnimatedStagger>

          {displayPosts.length === 0 && (
            <div className="mt-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-3xl mb-4">📝</div>
              <h3 className="font-heading text-xl font-bold text-foreground">Blogs Coming Soon</h3>
              <p className="mt-2 text-muted-foreground text-sm max-w-sm mx-auto">We&apos;re working on sharing our farm stories, seasonal updates, and organic farming insights. Stay tuned!</p>
            </div>
          )}

          <AnimatedSection className="mt-10 rounded-2xl overflow-hidden gradient-green relative">
            <div className="relative p-8 text-white">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-heading text-2xl font-bold">Stay Connected with Bhole Farms</h3>
                  <p className="mt-1 text-white/75 text-sm">Get latest updates, farm stories, seasonal offers and healthy tips.</p>
                </div>
                <form className="flex w-full max-w-md overflow-hidden rounded-xl bg-white shadow-lg">
                  <input type="email" placeholder="Enter your email" className="min-w-0 flex-1 px-4 py-3 text-sm text-foreground outline-none" />
                  <button type="submit" className="bg-accent px-6 text-sm font-button font-bold text-primary transition hover:bg-accent/90">Subscribe</button>
                </form>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 gradient-green" />
        <div className="absolute inset-0 opacity-[0.05]">
          <svg className="w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none">
            <defs><pattern id="about-cta" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M30 10C20 25 15 40 25 50c-2-8 3-20 8-28 3-4 6-7 8-12" fill="#fff"/></pattern></defs>
            <rect width="100%" height="100%" fill="url(#about-cta)" />
          </svg>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-white leading-tight">Want to Experience Freshness?</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70 text-lg">Visit our farm or browse our products online. We&apos;d love to connect with you.</p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <Link href="/products" className="rounded-xl bg-white px-8 py-4 text-sm font-button font-semibold text-primary shadow-xl transition-all hover:bg-white/90 hover:-translate-y-0.5">Explore Products</Link>
              <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 text-sm font-button font-semibold text-white transition-all hover:bg-white/20">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp Us
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
