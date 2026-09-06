'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/common/button';
import { 
  Wrench, ShieldCheck, Cpu, ClipboardList, PenTool, CheckCircle, 
  ArrowRight, Search, Car, Calendar, Star, ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';

function PublicNavbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="relative h-[40px] w-[112px] md:h-[50px] md:w-[140px] overflow-hidden">
              <Image
                src="/fin_logo.png"
                alt="WrectifAI"
                width={1024}
                height={1024}
                priority
                className="absolute left-0 top-[-28px] md:top-[-35px] h-[96px] md:h-[120px] w-full object-contain object-left"
              />
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">How It Works</a>
            <a href="#ai-diagnose" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">AI Diagnose</a>
            <a href="#quotes" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">Quotes</a>
            <a href="#for-garages" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">For Garages</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-[#1a56db] transition-colors">
              Log In
            </Link>
            <Link href="/signup">
              <Button className="bg-[#17307a] hover:bg-[#12245c] text-white rounded-full px-5">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-slate-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-8 animate-fade-in-up">
          <Cpu className="w-4 h-4" /> The Future of Auto Repair
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#17307a] tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Smarter Car Care <br className="hidden md:block"/> Starts Here.
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Get AI-powered diagnostics, compare quotes from top local garages, and book repairs instantly. The complete vehicle service journey in one platform.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/signup">
            <Button className="h-12 px-8 text-base font-semibold bg-[#1a56db] hover:bg-[#1748b5] text-white rounded-full flex items-center gap-2 group shadow-lg shadow-blue-500/20">
              Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" className="h-12 px-8 text-base font-semibold border-slate-300 text-slate-700 hover:bg-slate-100 rounded-full">
              Explore How It Works
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Search className="w-6 h-6 text-blue-600" />,
      title: "01. AI Diagnose",
      desc: "Describe your vehicle symptoms and receive instant AI-assisted diagnostic results."
    },
    {
      icon: <ClipboardList className="w-6 h-6 text-blue-600" />,
      title: "02. Get & Compare Quotes",
      desc: "Send a request to local Garages and easily compare the Quotes you receive."
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      title: "03. Choose Your Garage",
      desc: "Select the exact Quote and Garage that works best for your needs and budget."
    },
    {
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      title: "04. Book & Track",
      desc: "Turn the accepted Quote into a Booking and follow the service progress."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#17307a] mb-4">The WrectifAI Journey</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">A seamless, connected workflow from the moment you notice an issue to the moment you drive away.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-100 -z-10"></div>
          
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300">
                {step.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection({ id, title, subtitle, content, features, imageSrc, reversed = false }: any) {
  return (
    <section id={id} className={cn("py-24", reversed ? "bg-slate-50" : "bg-white")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn("flex flex-col lg:flex-row items-center gap-16", reversed && "lg:flex-row-reverse")}>
          
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide uppercase">
              {subtitle}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#17307a] leading-tight">
              {title}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              {content}
            </p>
            <ul className="space-y-4 pt-4">
              {features.map((feat: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="text-slate-700 font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <img src={imageSrc} alt={title} className="rounded-3xl shadow-xl w-full object-cover border border-white/50 aspect-[4/3]" />
          </div>
          
        </div>
      </div>
    </section>
  );
}

function DualValueSection() {
  return (
    <section id="for-garages" className="py-24 bg-[#17307a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">One Platform. Two Tailored Experiences.</h2>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">WrectifAI brings customers and garages together with specialized tools for each.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-8 rounded-3xl hover:bg-white/15 transition-colors">
            <Car className="w-10 h-10 text-blue-300 mb-6" />
            <h3 className="text-2xl font-bold mb-6">For Vehicle Owners</h3>
            <ul className="space-y-4">
              {['AI Diagnose mechanical issues', 'Manage your vehicle fleet', 'Request Quotes from local Garages', 'Compare Quotes side-by-side', 'Book services securely', 'Track Bookings in real-time', 'Discover Deals and Offers'].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0" />
                  <span className="text-blue-50 font-medium">{f}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-3xl text-slate-800 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
            <Wrench className="w-10 h-10 text-[#1a56db] mb-6" />
            <h3 className="text-2xl font-bold mb-6 text-[#17307a]">For Garages</h3>
            <ul className="space-y-4">
              {['Receive incoming customer requests', 'Submit Quotes quickly', 'Manage confirmed Bookings', 'Manage your active Workshop Floor', 'Track active jobs (Inspection, Repair, Ready)', 'Professional Garage Dashboard'].map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#1a56db] shrink-0" />
                  <span className="font-medium text-slate-700">{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-slate-100">
              <Link href="/login">
                <Button className="w-full h-12 bg-[#17307a] hover:bg-[#12245c] text-white rounded-xl text-base font-bold">
                  Garage Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <ShieldCheck className="w-12 h-12 text-[#1a56db] mx-auto mb-6" />
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
          One platform for the complete vehicle service journey.
        </h2>
        <p className="text-slate-500 font-medium text-lg">
          No more guessing. Connect with real Garages, compare real Quotes, and book with confidence.
        </p>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-5"></div>
      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#17307a] mb-6">
          Ready to take better care of your vehicle?
        </h2>
        <p className="text-xl text-slate-600 mb-10">
          AI Diagnose → Quotes → Garages → Bookings. Start your smarter car care journey today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/signup">
            <Button className="h-14 px-10 text-lg font-bold bg-[#1a56db] hover:bg-[#1748b5] text-white rounded-full shadow-lg shadow-blue-500/20">
              Get Started Now
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" className="h-14 px-10 text-lg font-bold border-slate-300 text-slate-700 hover:bg-slate-50 rounded-full">
              Log In
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function PublicFooter() {
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#1a56db] flex items-center justify-center text-white font-bold text-sm leading-none">
                W
              </div>
              <span className="font-bold text-xl text-[#17307a] tracking-tight">WrectifAI</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm mb-6">
              The professional automotive technology platform connecting vehicle owners with the best local Garages.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#how-it-works" className="text-sm text-slate-500 hover:text-[#1a56db]">How It Works</a></li>
              <li><a href="#ai-diagnose" className="text-sm text-slate-500 hover:text-[#1a56db]">AI Diagnose</a></li>
              <li><a href="#quotes" className="text-sm text-slate-500 hover:text-[#1a56db]">Garages & Quotes</a></li>
              <li><Link href="/login" className="text-sm text-slate-500 hover:text-[#1a56db]">Customer Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-4">Partners</h4>
            <ul className="space-y-3">
              <li><a href="#for-garages" className="text-sm text-slate-500 hover:text-[#1a56db]">For Garages</a></li>
              <li><Link href="/login" className="text-sm text-slate-500 hover:text-[#1a56db]">Garage Login</Link></li>
              <li><Link href="/login" className="text-sm text-slate-500 hover:text-[#1a56db]">Support</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} WrectifAI. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-sm text-slate-400 cursor-pointer hover:text-slate-600">Privacy Policy</span>
            <span className="text-sm text-slate-400 cursor-pointer hover:text-slate-600">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100 selection:text-blue-900">
      <PublicNavbar />
      
      <main>
        <HeroSection />
        
        <HowItWorks />
        
        <FeatureSection 
          id="ai-diagnose"
          title="Intelligent AI Diagnosis"
          subtitle="Stop Guessing"
          content="Don't know what's wrong with your car? Describe your vehicle's symptoms and let WrectifAI's advanced AI engine instantly determine potential mechanical faults."
          features={[
            "Input natural language symptoms",
            "Receive instant potential fault results",
            "Generate accurate Quote requests directly from results"
          ]}
          imageSrc="/assets/ai-diagnosis.jpg"
          reversed={true}
        />

        <FeatureSection 
          id="quotes"
          title="Compare Quotes with Confidence"
          subtitle="Transparent Pricing"
          content="WrectifAI lets you make an informed choice. Send your diagnostic results or service request to local Garages, and receive competitive Quotes in return."
          features={[
            "Submit detailed repair/service requests",
            "Garages review and submit custom Quotes",
            "Compare Quotes side-by-side",
            "Accept the Quote that works for you"
          ]}
          imageSrc="/assets/Documentation.png"
          reversed={false}
        />

        <FeatureSection 
          id="bookings"
          title="Seamless Bookings & Vehicle Management"
          subtitle="Complete Control"
          content="Once you accept a Quote, WrectifAI automatically creates a Booking. Manage your entire fleet, track service progress, and explore exclusive automotive Deals."
          features={[
            "Manage Vehicle details (Make, Model, VIN)",
            "Track Booking progress (Accepted → Inspection → Repair → Ready)",
            "Discover Deals, Offers, and Automotive Shop items"
          ]}
          imageSrc="https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80"
          reversed={true}
        />

        <DualValueSection />

        <TrustSection />

        <FinalCTA />
      </main>

      <PublicFooter />
    </div>
  );
}
