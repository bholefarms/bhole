import { getSettings } from "@/lib/settings";
import { ContactForm } from "./contact-form";
import { AnimatedSection } from "@/components/shared/animations";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  return (
    <>
      {/* Premium Brand Hero — Bhole Farms Estate */}
      <section className="relative overflow-hidden w-full rounded-b-[24px] sm:rounded-b-[32px] md:rounded-b-[40px] lg:rounded-b-[48px]" style={{ height: "clamp(450px, 50vw, 560px)" }}>
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: "url(/images/mango-tree-banner.jpg)",
          }}
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(15,35,15,0.92) 0%, rgba(22,48,32,0.7) 40%, rgba(46,125,50,0.45) 100%)" }} />

        {/* Decorative light rays */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]">
          <div className="absolute top-0 left-[15%] w-[1px] h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent transform rotate-[8deg] origin-top" />
          <div className="absolute top-0 left-[35%] w-[1px] h-full bg-gradient-to-b from-white/30 via-white/5 to-transparent transform rotate-[4deg] origin-top" />
          <div className="absolute top-0 right-[30%] w-[1px] h-full bg-gradient-to-b from-white/25 via-white/5 to-transparent transform -rotate-[6deg] origin-top" />
        </div>

        {/* Floating ambient orbs */}
        <div className="absolute top-16 right-[20%] w-[280px] h-[280px] rounded-full bg-accent/10 blur-[100px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 left-[10%] w-[220px] h-[220px] rounded-full bg-gold/8 blur-[80px] animate-[float_10s_ease-in-out_infinite_2s]" />

        {/* Content grid */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center w-full py-12 lg:py-0">

            {/* Left — Brand heading */}
            <div className="lg:col-span-3 space-y-5">
              <span className="inline-block rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90 shadow-sm">
                We&apos;re Here for You
              </span>

              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.6rem] xl:text-[4.2rem] font-bold leading-[1.08] tracking-tight text-white drop-shadow-lg">
                Contact <br />
                <span className="bg-gradient-to-r from-green-300 via-green-200 to-gold bg-clip-text text-transparent">
                  Bhole Farms
                </span>
              </h1>

              <p className="text-white/70 text-base sm:text-lg max-w-md leading-relaxed">
                We&apos;d love to hear from you. Reach out for orders, partnerships, farm visits, or just to say hello.
              </p>

              <div className="flex flex-wrap gap-3 pt-1">
                <a href="/contact" className="inline-flex items-center gap-2 rounded-full bg-white text-foreground px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                  Get in Touch
                </a>
                <a href="https://wa.me/917975623353" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 backdrop-blur-md px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-all shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  WhatsApp Us
                </a>
              </div>
            </div>

            {/* Right — Frosted glass logo card */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[260px] sm:max-w-[280px]">
                {/* Glow behind card */}
                <div className="absolute inset-0 rounded-3xl bg-accent/15 blur-2xl scale-110" />

                {/* Frosted card */}
                <div className="relative rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl p-6 sm:p-7 shadow-2xl">
                  <div className="rounded-2xl bg-white/95 p-4 shadow-inner mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                          <path d="M12 6c-2.5 0-4 2-4 4s1.5 4 4 4 4-2 4-4-1.5-4-4-4z" />
                          <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-heading text-sm font-bold text-foreground leading-tight">Bhole Farms</p>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Certified Organic</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-3 text-white/80">
                      <svg className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      <span className="text-xs leading-snug">Devgaon, Maharashtra 431123</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <svg className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <span className="text-xs">{settings.contact_phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <svg className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                      <span className="text-xs truncate">{settings.contact_email}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/15 my-4" />

                  <div className="text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">Farm Visits Welcome</p>
                    <p className="text-[11px] text-white/70 mt-1">Call to schedule a tour</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom trust badges row */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pb-8 sm:pb-10">
              {[
                { icon: "🌿", label: "Family Owned Farm" },
                { icon: "✓", label: "100% Organic Certified" },
                { icon: "🛡", label: "Chemical Free Produce" },
                { icon: "🚚", label: "Same Day Delivery" },
                { icon: "★", label: "Trusted by 10,000+ Families" },
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
      {/* Main Content */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left - Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Phone */}
              <AnimatedSection className="group rounded-2xl bg-white border border-border/40 p-5 flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md">             
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Phone</p>
                  <p className="text-sm font-semibold text-primary">{settings.contact_phone}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Mon - Sun: 8:00 AM - 8:00 PM</p>
                </div>
              </AnimatedSection>

              {/* Email */}
              <AnimatedSection delay={0.05} className="group rounded-2xl bg-white border border-border/40 p-5 flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Email</p>
                  <p className="text-sm font-semibold text-primary">{settings.contact_email}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">We reply within 24 hours</p>
                </div>
              </AnimatedSection>

              {/* WhatsApp */}
              <AnimatedSection delay={0.1} className="group rounded-2xl bg-white border border-border/40 p-5 flex items-start gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">WhatsApp</p>
                  <a href={`https://wa.me/${settings.whatsapp_number}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">Chat with us</a>
                  <p className="text-xs text-muted-foreground mt-0.5">Quick response on WhatsApp</p>
                </div>
              </AnimatedSection>

              {/* Address */}
              <AnimatedSection delay={0.15} className="rounded-2xl bg-white border border-border/40 p-5 hover:shadow-lg transition-all">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-foreground">Visit Our Farm</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-1">कै. दत्तूभाऊ भोळे फार्महाउस<br />देवगाव RV4J+69, Devgaon,<br />Maharashtra 431123, India</p>
                    <a href="https://maps.app.goo.gl/RkQKqEd2LpDVc4bo6" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                      View on Google Maps
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>
                    </a>
                  </div>
                </div>
                {/* Google Maps Embed */}
                <div className="mt-4 rounded-xl overflow-hidden h-[180px] border border-border/40 bg-muted/30">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15065.918706319277!2d75.8836846!3d18.8342196!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc52ff8d0a6097d%3A0x4ae0b111b78e362d!2sDevgaon%2C%20Maharashtra%20431123!5e0!3m2!1sen!2sin!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bhole Farms Location"
                  />
                </div>
              </AnimatedSection>
            </div>

            {/* Right - Form */}
            <div className="lg:col-span-3">
              <AnimatedSection direction="right" className="rounded-2xl bg-white border border-border/40 p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 text-primary/5">
                  <svg viewBox="0 0 100 100" fill="currentColor"><path d="M80 20C60 10 30 20 20 50C10 80 30 90 50 80C70 70 90 40 80 20Z" /></svg>
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Send Us a Message</h2>
                <p className="mt-1 text-sm text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-t border-border/40 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></svg>, title: "100% Organic", desc: "Pure and natural produce" },
              { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2v7.527a2 2 0 01-.211.896L4.72 20.55a1 1 0 00.9 1.45h12.76a1 1 0 00.9-1.45l-5.069-10.127A2 2 0 0114 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16.5h10" /></svg>, title: "Chemical Free", desc: "No harmful chemicals" },
              { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, title: "Fast Delivery", desc: "Fresh to your doorstep" },
              { icon: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>, title: "Satisfaction", desc: "100% customer satisfaction" },
            ].map((badge) => (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {badge.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
