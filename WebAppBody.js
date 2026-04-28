import React, { useState, useEffect } from 'react';
import {
    Search, Bell, Settings, LayoutDashboard, Users, Activity,
    Briefcase, ChevronDown, Sparkles, MessageSquare,
    CheckCircle2, Clock, Calendar, Mail, Phone, ChevronRight,
    ShieldAlert, DollarSign, Command, Network,
    MoreHorizontal, ArrowRight, Copy, Check, Info, Zap, AlertTriangle,
    Brain, Database, Video, MessageCircle, Cloud, ArrowLeft
} from 'lucide-react';

// --- MOCK DATA ---

const ACCOUNTS_DB = {
    'acme': {
        id: 'acme',
        name: "Acme Corp",
        website: "acme.co",
        stage: "Negotiation",
        priority: "High",
        health: "at-risk",
        owner: "Alex Chen",
        lastInteraction: "2h ago",
        arr: "$120k",
        topMemory: "Blocked on SOC2 Type II compliance.",
        stakeholders: [
            { name: "Sarah Jenkins", role: "VP Eng", persona: "Economic Buyer", initials: "SJ" },
            { name: "David Kim", role: "CISO", persona: "Security/Blocker", initials: "DK" },
            { name: "Elena Rostova", role: "Procurement", persona: "Legal/Admin", initials: "ER" }
        ]
    },
    'globex': {
        id: 'globex',
        name: "Globex Inc",
        website: "globex.io",
        stage: "Discovery",
        priority: "Medium",
        health: "active",
        owner: "Sarah Lee",
        lastInteraction: "1d ago",
        arr: "$45k",
        topMemory: "Evaluating 3 other vendors simultaneously.",
        stakeholders: [
            { name: "Hank Scorpio", role: "CEO", persona: "Decision Maker", initials: "HS" },
            { name: "Homer Simpson", role: "Safety Inspector", persona: "End User", initials: "HS" }
        ]
    },
    'soylent': {
        id: 'soylent',
        name: "Soylent Corp",
        website: "soylent.co",
        stage: "Renewal",
        priority: "High",
        health: "stalled",
        owner: "Alex Chen",
        lastInteraction: "5d ago",
        arr: "$250k",
        topMemory: "Frustrated over Q2 data outage SLA breach.",
        stakeholders: [
            { name: "Bob Thorn", role: "Director", persona: "Champion", initials: "BT" },
            { name: "Alice Glass", role: "VP Operations", persona: "Economic Buyer", initials: "AG" }
        ]
    }
};

const MEMORIES_DB = {
    'acme': [
        {
            id: "m1",
            type: "Blocker",
            icon: ShieldAlert,
            text: "David explicitly stated they cannot proceed without SOC2 Type II compliance verified by Q3.",
            source: "Zoom Transcript",
            date: "Oct 12",
            relevance: "High match",
            whyRecalled: "Active blocker for current negotiation phase",
            tags: ["Security", "Deal-breaker"],
            relation: { role: "CISO", name: "David Kim" }
        },
        {
            id: "m2",
            type: "Preference",
            icon: MessageSquare,
            text: "Sarah hates long emails. Prefers bulleted lists with clear action items and SLAs.",
            source: "Email Thread",
            date: "Sep 28",
            relevance: "Contextual",
            whyRecalled: "Matches chosen stakeholder persona",
            tags: ["Communication"],
            relation: { role: "VP Eng", name: "Sarah Jenkins" }
        },
        {
            id: "m3",
            type: "Commitment",
            icon: CheckCircle2,
            text: "Promised to provide a revised tiered pricing model excluding the premium support package.",
            source: "Slack (Internal)",
            date: "Oct 15",
            relevance: "Pending",
            whyRecalled: "Unfulfilled promise identified",
            tags: ["Pricing"],
            relation: { role: "Procurement", name: "Elena Rostova" }
        },
        {
            id: "m4",
            type: "Context",
            icon: DollarSign,
            text: "Budget refresh in November. Risk of slipping to Q1 if not signed by Nov 15.",
            source: "Salesforce Note",
            date: "Oct 01",
            relevance: "Timeline",
            whyRecalled: "Time-sensitive external deadline",
            tags: ["Budget"],
            relation: { role: "VP Eng", name: "Sarah Jenkins" }
        }
    ],
    'globex': [
        {
            id: "g1",
            type: "Preference",
            icon: MessageSquare,
            text: "Hank prefers casual communication. Avoid corporate jargon.",
            source: "LinkedIn Message",
            date: "Oct 20",
            relevance: "High match",
            whyRecalled: "Communication preference override",
            tags: ["Communication"],
            relation: { role: "CEO", name: "Hank Scorpio" }
        },
        {
            id: "g2",
            type: "Context",
            icon: DollarSign,
            text: "Currently evaluating 3 other vendors for the automation pipeline.",
            source: "Discovery Call",
            date: "Oct 18",
            relevance: "Competition",
            whyRecalled: "Competitive intelligence trigger",
            tags: ["Competitive"],
            relation: { role: "Safety Inspector", name: "Homer Simpson" }
        }
    ],
    'soylent': [
        {
            id: "s1",
            type: "Blocker",
            icon: ShieldAlert,
            text: "Renewal is blocked pending resolution of the Q2 data outage SLA breach.",
            source: "Support Ticket",
            date: "Sep 15",
            relevance: "Critical",
            whyRecalled: "Directly impacts upcoming renewal",
            tags: ["Support", "SLA"],
            relation: { role: "Director", name: "Bob Thorn" }
        },
        {
            id: "s2",
            type: "Preference",
            icon: MessageSquare,
            text: "Alice requires executive summaries for all incident post-mortems before internal review.",
            source: "Past QBR",
            date: "Jul 10",
            relevance: "Contextual",
            whyRecalled: "Applies to SLA breach remediation",
            tags: ["Communication"],
            relation: { role: "VP Operations", name: "Alice Glass" }
        }
    ]
};

const TIMELINE_DB = {
    'acme': [
        { type: 'email', title: "Sent revised technical overview", date: "Today, 10:30 AM", user: "You", tag: "security" },
        { type: 'note', title: "Added procurement requirements", date: "Yesterday, 4:15 PM", user: "Alex Chen", tag: "procurement", highlight: true },
        { type: 'call', title: "Discovery & Security Review", date: "Oct 12, 2:00 PM", user: "You + 3 others", tag: "discovery" }
    ],
    'globex': [
        { type: 'call', title: "Initial Discovery Call", date: "Oct 18, 1:00 PM", user: "You", tag: "discovery" }
    ],
    'soylent': [
        { type: 'email', title: "Q3 Business Review sent", date: "Oct 01, 9:00 AM", user: "Alex Chen", tag: "renewal" }
    ]
};

// --- REFINED DESIGN SYSTEM COMPONENTS ---

const Badge = ({ children, className = '' }) => (
    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200/80 bg-slate-50/50 text-slate-500 ${className}`}>
        {children}
    </span>
);

const IconButton = ({ icon: Icon, className = '', onClick }) => (
    <button onClick={onClick} className={`p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200 ${className}`}>
        <Icon size={15} strokeWidth={2} />
    </button>
);

const HydraFooter = ({ memoryCount = 4 }) => (
    <div className="px-6 py-2.5 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
        <span>{memoryCount} memories used</span>
        <span className="flex items-center gap-1.5 text-[#2563EB]"><Network size={10} /> Powered by HydraDB</span>
    </div>
);

// --- BRAND LOGO ---
const ContextIQLogo = ({ className = "w-8 h-8" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="20" fill="#111827" />
        <circle cx="54" cy="50" r="22" fill="#2563EB" opacity="0.8" filter="blur(5px)" />
        <circle cx="54" cy="50" r="15" fill="#3B82F6" />
        <path d="M 28 18 
             H 68 
             A 14 14 0 0 1 82 32 
             C 82 42, 66 40, 66 50
             C 66 60, 82 58, 82 68
             A 14 14 0 0 1 68 82 
             H 28 
             A 14 14 0 0 1 14 68 
             V 32 
             A 14 14 0 0 1 28 18 
             Z"
            stroke="#F8FAFC"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round" />
    </svg>
);

// --- INTERACTIVE TERMINAL COMPONENT FOR HYDRADB ---
const HydraTerminal = () => {
    const [lines, setLines] = useState([]);

    const script = [
        { delay: 400, content: <><span className="text-[#2563EB] shrink-0">→</span><span className="text-slate-400">Listening to integration webhook stream...</span></> },
        { delay: 1000, content: <><span className="text-[#2563EB] shrink-0">→</span><span className="text-slate-400">Parsing Gong transcript_id_492...</span></> },
        { delay: 1800, content: <><span className="text-slate-500 shrink-0">~</span><span className="text-slate-500 italic">Extracting semantic context vectors...</span></> },
        { delay: 2400, content: <><span className="text-[#22C55E] shrink-0">✓</span><span className="text-[#22C55E]">Entity matched: David Kim (CISO)</span></> },
        { delay: 3000, content: <><span className="text-[#F97316] shrink-0">!</span><span className="text-white font-bold bg-[#F97316]/20 px-1.5 py-0.5 rounded shadow-sm">Blocker identified: SOC2 Compliance</span></> },
        { delay: 3800, content: <><span className="text-[#2563EB] shrink-0">→</span><span className="text-slate-400">Writing nodes to Account Memory Graph...</span></> },
    ];

    useEffect(() => {
        let timeouts = [];

        const runScript = () => {
            setLines([]);

            script.forEach((step, index) => {
                const timeout = setTimeout(() => {
                    setLines(prev => [...prev, step.content]);
                }, step.delay);
                timeouts.push(timeout);
            });

            const resetTimeout = setTimeout(() => {
                runScript();
            }, script[script.length - 1].delay + 3000);
            timeouts.push(resetTimeout);
        };

        runScript();
        return () => timeouts.forEach(clearTimeout);
    }, []);

    return (
        <div className="w-full bg-[#0F172A] border border-slate-700/50 rounded-xl font-mono text-[11px] leading-relaxed shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] h-[180px] flex flex-col overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-8 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 flex items-center px-4 gap-2 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/80"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600/80"></div>
                <span className="ml-3 text-[9px] text-slate-400 uppercase tracking-[0.2em] font-bold">HydraDB Engine</span>
            </div>

            <div className="flex-1 p-4 pt-10 overflow-hidden flex flex-col justify-end space-y-2.5 relative">
                <div className="absolute top-8 left-0 w-full h-8 bg-gradient-to-b from-[#0F172A] to-transparent z-10 pointer-events-none"></div>
                {lines.map((line, i) => (
                    <div key={i} className="flex items-start gap-2.5 animate-in slide-in-from-bottom-2 fade-in duration-300">
                        {line}
                    </div>
                ))}
                <div className="flex items-center gap-2.5 mt-1">
                    <span className="text-[#2563EB] font-bold">~</span>
                    <span className="w-2 h-3.5 bg-slate-400 animate-pulse inline-block"></span>
                </div>
            </div>
        </div>
    );
};

// --- AUTH / SIGN UP PAGE ---
const AuthPage = ({ onLogin, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            onLogin('Alex Chen'); // Default mock login 
        }, 1500);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-[#0F172A]">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex flex-col items-center justify-center w-[400px] animate-in zoom-in-95 duration-500 relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB]"></div>
                    <div className="w-16 h-16 relative mb-6">
                        <div className="absolute inset-0 border-2 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-[#2563EB] rounded-full border-t-transparent animate-spin"></div>
                        <ContextIQLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8" />
                    </div>
                    <h3 className="text-[18px] font-bold text-[#0F172A] mb-2 tracking-tight">Creating Workspace...</h3>
                    <p className="text-[14px] text-slate-500 font-medium">Provisioning HydraDB resources</p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-8 overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full animate-[progress_1.5s_ease-in-out_forwards]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-[#0F172A] relative px-6 selection:bg-[#2563EB] selection:text-white">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)' }}></div>

            <button onClick={onBack} className="absolute top-8 left-8 z-20 text-slate-500 hover:text-[#0F172A] flex items-center gap-2 text-[13px] font-bold transition-colors group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to home
            </button>

            <div className="w-full max-w-[420px] bg-white border border-slate-200 rounded-2xl p-10 shadow-[0_8px_30px_rgba(15,23,42,0.06)] relative z-10 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center mb-8 text-center">
                    <ContextIQLogo className="w-14 h-14 mb-5 shadow-[0_4px_12px_rgba(15,23,42,0.15)] rounded-2xl" />
                    <h2 className="text-[24px] font-extrabold text-[#0F172A] tracking-tight">Create your workspace</h2>
                    <p className="text-[14px] text-slate-500 font-medium mt-1">Get started with ContextIQ for free.</p>
                </div>

                <div className="space-y-3 mb-6">
                    <button onClick={handleSubmit} className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-bold text-[#0F172A] hover:bg-slate-50 transition-colors shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>
                    <button onClick={handleSubmit} className="w-full py-3 px-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-[14px] font-bold text-[#0F172A] hover:bg-slate-50 transition-colors shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 10H0V0H10V10Z" fill="#F25022" />
                            <path d="M21 10H11V0H21V10Z" fill="#7FBA00" />
                            <path d="M10 21H0V11H10V21Z" fill="#00A4EF" />
                            <path d="M21 21H11V11H21V21Z" fill="#FFB900" />
                        </svg>
                        Continue with Microsoft
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-6">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Or</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[12px] font-bold text-slate-700 mb-2">Work Email</label>
                        <input type="email" required placeholder="name@company.com" className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-[14px] outline-none focus:bg-white focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 transition-all placeholder:text-slate-400 font-medium" />
                    </div>
                    <button type="submit" className="w-full py-3 bg-[#2563EB] text-white rounded-xl font-bold text-[14px] hover:bg-[#1D4ED8] transition-colors shadow-sm">
                        Continue with Email
                    </button>
                </form>

                <p className="text-center text-[12px] text-slate-500 font-medium mt-8 leading-relaxed">
                    By signing up, you agree to our <a href="#" className="text-slate-700 underline hover:text-[#0F172A]">Terms of Service</a> and <a href="#" className="text-slate-700 underline hover:text-[#0F172A]">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
};

// --- HUMAN FIGMA-GRADE LANDING PAGE ---
const LandingPage = ({ onNavigateToAuth, onLogin }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrollY, setScrollY] = useState(0);
    const [isLoggingIn, setIsLoggingIn] = useState(null);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleMouseMove = (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;
        setMousePos({ x, y });
    };

    const handleLogin = (user) => {
        setIsLoggingIn(user);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            onLogin(user);
        }, 1500);
    };

    if (isLoggingIn) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-[#0F172A]">
                <div className="absolute inset-0 z-0 pointer-events-none opacity-50" style={{ backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
                <div className="bg-white border border-slate-200 rounded-2xl p-10 shadow-[0_8px_30px_rgba(15,23,42,0.06)] flex flex-col items-center justify-center w-[400px] animate-in zoom-in-95 duration-500 relative z-10 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#2563EB]"></div>
                    <div className="w-16 h-16 relative mb-6">
                        <div className="absolute inset-0 border-2 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-[#2563EB] rounded-full border-t-transparent animate-spin"></div>
                        <ContextIQLogo className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8" />
                    </div>
                    <h3 className="text-[18px] font-bold text-[#0F172A] mb-2 tracking-tight">Fetching Workspace Context...</h3>
                    <p className="text-[14px] text-slate-500 font-medium">Authenticating walk-in profile for <span className="font-semibold text-[#0F172A]">{isLoggingIn}</span></p>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-8 overflow-hidden">
                        <div className="h-full bg-[#2563EB] rounded-full animate-[progress_1.5s_ease-in-out_forwards]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div onMouseMove={handleMouseMove} className="min-h-screen bg-[#F8FAFC] relative overflow-y-auto overflow-x-hidden font-sans text-[#0F172A] selection:bg-[#2563EB] selection:text-white">
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#E2E8F0 1px, transparent 1px), linear-gradient(90deg, #E2E8F0 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 80%)', WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 80%)' }}></div>
            <div className="fixed top-[40%] left-1/2 w-[800px] h-[600px] bg-[#2563EB]/5 rounded-full blur-[120px] -z-10 transition-transform duration-700 ease-out" style={{ transform: `translate(calc(-50% + ${mousePos.x * 2}px), calc(-50% + ${(mousePos.y * 2) - (scrollY * 0.2)}px))` }}></div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 h-[100vh] hidden lg:block" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
                <div className="absolute top-[12%] left-[8%] bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] w-64 transition-transform duration-1000 ease-out opacity-90" style={{ transform: `translate(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px) rotate(-3deg)` }}>
                    <div className="flex items-center gap-2 mb-2"><ShieldAlert size={14} className="text-[#B91C1C]" /><span className="text-[10px] font-bold text-[#B91C1C] uppercase tracking-widest">Blocker</span></div>
                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">David explicitly stated they cannot proceed without SOC2 Type II compliance.</p>
                </div>
                <div className="absolute bottom-[20%] right-[8%] bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] w-60 transition-transform duration-1000 ease-out opacity-90" style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px) rotate(3deg)` }}>
                    <div className="flex items-center gap-2 mb-2"><MessageSquare size={14} className="text-[#2563EB]" /><span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Preference</span></div>
                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">Sarah hates long emails. Prefers bulleted lists with clear SLAs.</p>
                </div>
                <div className="absolute top-[25%] right-[12%] bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] w-56 transition-transform duration-1000 ease-out opacity-75" style={{ transform: `translate(${mousePos.x * 1.2}px, ${mousePos.y * -1.8}px) rotate(5deg)` }}>
                    <div className="flex items-center gap-2 mb-2"><CheckCircle2 size={14} className="text-[#22C55E]" /><span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-widest">Commitment</span></div>
                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">Promised to provide a revised tiered pricing model.</p>
                </div>
                <div className="absolute top-[45%] left-[5%] bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] w-56 transition-transform duration-1000 ease-out opacity-60" style={{ transform: `translate(${mousePos.x * -2.5}px, ${mousePos.y * 1.5}px) rotate(-6deg)` }}>
                    <div className="flex items-center gap-2 mb-2"><DollarSign size={14} className="text-[#F97316]" /><span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest">Context</span></div>
                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">Budget refresh in Nov. Risk of slipping to Q1 if not signed.</p>
                </div>
                <div className="absolute bottom-[15%] left-[12%] bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] w-60 transition-transform duration-1000 ease-out opacity-80" style={{ transform: `translate(${mousePos.x * -1.8}px, ${mousePos.y * -2}px) rotate(4deg)` }}>
                    <div className="flex items-center gap-2 mb-2"><MessageSquare size={14} className="text-[#2563EB]" /><span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest">Preference</span></div>
                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">Hank prefers casual communication. Avoid corporate jargon.</p>
                </div>
                <div className="absolute top-[55%] right-[4%] bg-white/90 backdrop-blur-md border border-slate-200 p-4 rounded-xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] w-52 transition-transform duration-1000 ease-out opacity-65" style={{ transform: `translate(${mousePos.x * 2.2}px, ${mousePos.y * 0.8}px) rotate(-5deg)` }}>
                    <div className="flex items-center gap-2 mb-2"><ShieldAlert size={14} className="text-[#B91C1C]" /><span className="text-[10px] font-bold text-[#B91C1C] uppercase tracking-widest">Blocker</span></div>
                    <p className="text-[12px] text-slate-600 font-medium leading-relaxed">Renewal blocked pending resolution of Q2 SLA breach.</p>
                </div>
            </div>

            {/* --- HERO SECTION --- */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-32 pb-16 px-6 min-h-[85vh]">
                <div className="text-center max-w-4xl mx-auto">
                    <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full border border-slate-200 bg-white mb-8 shadow-[0_2px_8px_rgba(15,23,42,0.04)] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <ContextIQLogo className="w-5 h-5 shadow-sm rounded-lg" />
                        <span className="text-[13px] font-bold tracking-widest text-[#0F172A] uppercase">ContextIQ</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[#0F172A] mb-6 leading-[1.05] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                        Before you speak,<br />
                        <span className="text-slate-400">know what matters.</span>
                    </h1>

                    <p className="text-[18px] text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-medium tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
                        A memory-native workspace for revenue teams. ContextIQ captures history, preferences, and blockers, surfacing exactly what you need to close the deal.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <button onClick={onNavigateToAuth} className="px-8 py-3.5 bg-[#2563EB] text-white rounded-xl font-bold text-[14px] hover:bg-[#1D4ED8] hover:shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
                            Get Started <ArrowRight size={16} />
                        </button>
                        <button onClick={() => document.getElementById('pipeline').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3.5 bg-white border border-slate-200 text-[#0F172A] rounded-xl font-bold text-[14px] hover:bg-slate-50 transition-colors shadow-sm w-full sm:w-auto h-full">
                            See the architecture
                        </button>
                    </div>
                </div>
            </div>

            {/* --- ARCHITECTURE PIPELINE SECTION --- */}
            <div id="pipeline" className="relative z-10 max-w-6xl mx-auto px-6 py-24 mt-16">
                <div className="mb-16 text-center">
                    <h2 className="text-[12px] font-bold uppercase tracking-widest text-[#2563EB] mb-3">The Architecture</h2>
                    <p className="text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">How ContextIQ builds memory.</p>
                    <p className="text-[16px] text-slate-500 font-medium mt-3">A continuous pipeline from raw data to actionable insight.</p>
                </div>

                <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                    <div className="hidden lg:block absolute top-[180px] left-[20%] right-[20%] h-px bg-slate-200 z-0">
                        <div className="absolute top-[-2px] left-0 w-24 h-[5px] bg-gradient-to-r from-transparent via-[#2563EB] to-transparent animate-[flowRight_3s_linear_infinite] opacity-50"></div>
                        <div className="absolute top-[-2px] left-[50%] w-24 h-[5px] bg-gradient-to-r from-transparent via-[#22C55E] to-transparent animate-[flowRight_3s_linear_infinite] opacity-50 delay-1000"></div>
                    </div>
                    <style dangerouslySetInnerHTML={{ __html: `@keyframes flowRight { 0% { transform: translateX(0%); } 100% { transform: translateX(400%); } }` }} />

                    {/* Step 1: Capture */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,23,42,0.02)] flex flex-col relative z-10 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-600 border border-slate-200">1</div>
                            <h3 className="text-[15px] font-bold text-[#0F172A] uppercase tracking-widest">Capture</h3>
                        </div>
                        <p className="text-[14px] text-slate-500 font-medium mb-8 leading-relaxed">We automatically ingest conversations, emails, and notes directly from your existing stack.</p>
                        <div className="space-y-3 mt-auto">
                            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl hover:-translate-y-0.5 transition-transform duration-200">
                                <div className="flex items-center gap-3"><Cloud size={16} className="text-[#2563EB]" /><span className="text-[14px] font-bold text-[#0F172A]">Salesforce</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Syncing</span></div>
                            </div>
                            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl hover:-translate-y-0.5 transition-transform duration-200">
                                <div className="flex items-center gap-3"><Video size={16} className="text-[#F97316]" /><span className="text-[14px] font-bold text-[#0F172A]">Gong</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22C55E]"></div><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Connected</span></div>
                            </div>
                            <div className="flex items-center justify-between p-3.5 bg-slate-50/50 border border-slate-200 rounded-xl hover:-translate-y-0.5 transition-transform duration-200">
                                <div className="flex items-center gap-3"><Mail size={16} className="text-[#B91C1C]" /><span className="text-[14px] font-bold text-[#0F172A]">Gmail</span></div>
                                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></div><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Syncing</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Synthesize (HydraDB) */}
                    <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-8 shadow-[0_20px_50px_rgba(15,23,42,0.3)] flex flex-col relative z-20 scale-105">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 rounded-2xl pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[14px] font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)]">2</div>
                                <h3 className="text-[18px] font-bold text-white uppercase tracking-widest flex items-center gap-2.5">Synthesize <Network size={18} className="text-[#2563EB]" /></h3>
                            </div>
                            <p className="text-[14px] text-slate-400 font-medium mb-6 leading-relaxed"><strong className="text-white">HydraDB</strong> is our context-aware retrieval engine. It continuously vectors unstructured transcripts, emails, and threads, mapping them into a structured, queryable memory graph.</p>
                            <div className="mt-auto relative">
                                <div className="absolute -top-3 right-4 bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[9px] font-bold uppercase tracking-widest text-[#22C55E] flex items-center gap-1.5 z-20 shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></span> Live Sync
                                </div>
                                <HydraTerminal />
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Act */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-[0_4px_24px_rgba(15,23,42,0.02)] flex flex-col relative z-10 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-bold text-slate-600 border border-slate-200">3</div>
                            <h3 className="text-[15px] font-bold text-[#0F172A] uppercase tracking-widest">Act</h3>
                        </div>
                        <p className="text-[14px] text-slate-500 font-medium mb-8 leading-relaxed">Intelligence is injected directly into your workflow—exactly when you are about to speak or reply.</p>
                        <div className="space-y-4 mt-auto">
                            <div className="p-4 border border-rose-200 bg-rose-50/50 rounded-xl flex items-start gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
                                <ShieldAlert size={16} className="text-[#B91C1C] mt-0.5 shrink-0" />
                                <div><div className="text-[10px] font-bold text-[#B91C1C] uppercase tracking-widest mb-1.5">Blocker Surfaced</div><div className="text-[13px] text-[#0F172A] font-bold leading-snug">David stated they cannot proceed without SOC2.</div></div>
                            </div>
                            <div className="p-4 border border-blue-200 bg-[#EAF1FF]/50 rounded-xl flex items-start gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)]">
                                <MessageSquare size={16} className="text-[#2563EB] mt-0.5 shrink-0" />
                                <div><div className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1.5">Preference Saved</div><div className="text-[13px] text-[#0F172A] font-bold leading-snug">Sarah requires bulleted summaries with SLAs.</div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FINAL CTA SECTION --- */}
            <div id="walk-in" className="relative z-10 py-24 pb-32 border-t border-slate-200 bg-white mt-12">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#0F172A] mb-4">Stop walking into conversations blind.</h2>
                    <p className="text-[15px] text-slate-500 mb-12 font-medium">Experience the difference of a memory-native workflow. Try our interactive walk-in environment right now.</p>
                    <p className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-6 text-center">Select a walk-in profile to enter</p>
                    <div className="flex justify-center max-w-md mx-auto">
                        <button onClick={() => handleLogin('Alex Chen')} className="flex items-center p-5 bg-white border border-slate-200 rounded-xl hover:border-[#2563EB]/40 hover:shadow-[0_8px_30px_rgba(37,99,235,0.08)] hover:-translate-y-0.5 transition-all text-left w-full group">
                            <div className="w-14 h-14 rounded-full bg-[#0F172A] text-white flex items-center justify-center font-bold text-[15px] mr-5 shrink-0 transition-transform group-hover:scale-105 shadow-sm">AC</div>
                            <div className="flex-1">
                                <div className="text-[16px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-0.5">Walk-in as Alex Chen</div>
                                <div className="text-[14px] text-slate-500 font-medium">Enterprise Account Executive</div>
                            </div>
                            <ArrowRight className="text-slate-300 group-hover:text-[#2563EB] transition-colors group-hover:translate-x-1 transition-all" size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <footer className="py-10 text-center text-[12px] font-medium text-slate-400 border-t border-slate-200/60 bg-[#F8FAFC]">
                © 2026 ContextIQ Inc.
            </footer>
        </div>
    );
};

// --- APP LAYOUT (DASHBOARD) ---

const Sidebar = ({ activeView, setActiveView, activeAccount, setActiveAccount }) => (
    <div className="w-[240px] border-r border-slate-200/75 bg-[#F3F3F1] flex flex-col h-full flex-shrink-0 z-20 relative">
        <div className="h-14 flex items-center px-5 mt-2 border-b border-slate-200/50 pb-2 mb-2">
            <div className="flex items-center gap-3 text-slate-900 font-bold text-[15px] tracking-tight">
                <ContextIQLogo className="w-7 h-7 shadow-sm rounded-lg" />
                ContextIQ
            </div>
            <ChevronDown size={14} className="ml-auto text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
        </div>

        <div className="p-3 flex-1 overflow-y-auto">
            <div className="space-y-1">
                <NavItem icon={LayoutDashboard} label="Overview" active={activeView === 'overview'} onClick={() => setActiveView('overview')} />
                <NavItem icon={Briefcase} label="Accounts" active={activeView === 'accounts'} onClick={() => setActiveView('accounts')} />
                <NavItem icon={Users} label="Contacts" active={activeView === 'contacts'} onClick={() => setActiveView('contacts')} />
                <NavItem icon={Activity} label="Activity Stream" active={activeView === 'activity'} onClick={() => setActiveView('activity')} />
            </div>

            <div className="mt-8 mb-3 px-3 text-[12px] font-semibold text-slate-400 uppercase tracking-widest">
                Recent Contexts
            </div>
            <div className="space-y-1">
                <RecentItem account={ACCOUNTS_DB['acme']} active={activeAccount === 'acme' && activeView === 'accounts'} onClick={() => { setActiveAccount('acme'); setActiveView('accounts'); }} />
                <RecentItem account={ACCOUNTS_DB['soylent']} active={activeAccount === 'soylent' && activeView === 'accounts'} onClick={() => { setActiveAccount('soylent'); setActiveView('accounts'); }} />
                <RecentItem account={ACCOUNTS_DB['globex']} active={activeAccount === 'globex' && activeView === 'accounts'} onClick={() => { setActiveAccount('globex'); setActiveView('accounts'); }} />
            </div>
        </div>

        <div className="p-4 border-t border-slate-200/75 bg-[#F3F3F1]">
            <button className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-200/50 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[11px] font-bold text-white">
                    AC
                </div>
                <div className="text-[14px] font-bold text-slate-700 group-hover:text-slate-900">Alex Chen</div>
                <Settings size={14} className="ml-auto text-slate-400 group-hover:text-slate-600" />
            </button>
        </div>
    </div>
);

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${active ? 'bg-white text-slate-900 border border-slate-200 shadow-sm' : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-900 border border-transparent'
        }`}>
        <Icon size={16} strokeWidth={2} className={active ? 'text-slate-900' : 'text-slate-400'} />
        {label}
    </button>
);

const RecentItem = ({ account, active, onClick }) => {
    const colorMap = { 'at-risk': 'bg-[#B91C1C]', 'active': 'bg-[#15803D]', 'stalled': 'bg-[#F97316]' };
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[14px] transition-all duration-200 group ${active ? 'bg-white border border-slate-200 shadow-sm' : 'hover:bg-slate-200/50 border border-transparent'
            }`}>
            <div className="flex items-center gap-3 overflow-hidden">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colorMap[account.health] || 'bg-slate-300'}`} />
                <span className={`truncate ${active ? 'text-slate-900 font-semibold' : 'text-slate-600 group-hover:text-slate-900 font-medium'}`}>{account.name}</span>
            </div>
        </button>
    );
};

const Header = ({ accountName, setActiveView, onLogout }) => (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 flex-shrink-0 z-10 relative">
        <div className="flex items-center gap-2 text-[14px] text-slate-500 font-medium">
            <span className="hover:text-slate-900 cursor-pointer transition-colors" onClick={() => setActiveView('overview')}>Workspace</span>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-slate-900 font-semibold">{accountName || 'Overview'}</span>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#2563EB] transition-colors" />
                <input
                    type="text"
                    placeholder="Search context..."
                    className="pl-9 pr-8 py-2 text-[14px] bg-slate-50 hover:bg-slate-100 border border-transparent focus:bg-white focus:border-[#2563EB]/30 focus:ring-2 focus:ring-[#2563EB]/5 rounded-lg outline-none w-56 focus:w-72 transition-all duration-300 placeholder:text-slate-400 shadow-sm focus:shadow-sm font-medium"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-0.5">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-bold bg-white border border-slate-200 rounded text-slate-400">⌘</kbd>
                    <kbd className="px-1.5 py-0.5 text-[10px] font-sans font-bold bg-white border border-slate-200 rounded text-slate-400">K</kbd>
                </div>
            </div>
            <div className="w-px h-5 bg-slate-200" />
            <IconButton icon={Bell} onClick={() => alert("Notifications view")} />
            <button onClick={onLogout} className="text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors ml-2">Exit</button>
        </div>
    </header>
);

const MemoryRail = ({ memories, isLoading, contextFilterName }) => {
    const typeStyles = {
        'Blocker': { border: 'border-l-[#991B1B]', bg: 'bg-[#FDECEC]', icon: 'text-[#991B1B]' },
        'Preference': { border: 'border-l-[#2563EB]', bg: 'bg-[#EAF1FF]', icon: 'text-[#2563EB]' },
        'Commitment': { border: 'border-l-[#F97316]', bg: 'bg-[#FFF7E8]', icon: 'text-[#F97316]' },
        'Context': { border: 'border-l-[#374151]', bg: 'bg-[#F3F4F6]', icon: 'text-[#374151]' }
    };

    return (
        <div className="w-[340px] border-l border-slate-200 bg-[#FDFDFD] flex flex-col h-full flex-shrink-0 z-10">
            <div className="px-6 py-5 border-b border-slate-200 bg-[#FDFDFD]/90 backdrop-blur-md sticky top-0">
                <div className="flex items-center gap-2 text-[#0F172A] font-bold text-[14px] tracking-tight">
                    <Network size={16} className="text-slate-400" />
                    Active Context {contextFilterName && <span className="text-slate-500 font-medium">({contextFilterName})</span>}
                </div>
                <p className="text-[12px] text-slate-500 mt-1 font-semibold">{memories.length} relevant memories fetched</p>
            </div>

            <div className="p-5 overflow-y-auto flex-1 space-y-4 pb-8">
                {isLoading ? (
                    <div className="space-y-4">
                        <div className="h-28 bg-slate-100/50 rounded-xl border border-slate-200/50 animate-pulse"></div>
                        <div className="h-32 bg-slate-100/50 rounded-xl border border-slate-200/50 animate-pulse"></div>
                        <div className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Fetching relevant context...</div>
                    </div>
                ) : memories.map((memory) => {
                    const style = typeStyles[memory.type] || typeStyles['Context'];
                    return (
                        <div key={memory.id} className={`group bg-white border border-slate-200 border-l-[4px] ${style.border} rounded-xl p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] hover:border-r-slate-300 hover:border-y-slate-300 transition-all duration-300 cursor-default`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <div className={`p-1.5 rounded-md ${style.bg}`}>
                                        <memory.icon size={12} className={style.icon} strokeWidth={2.5} />
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center flex-wrap ${style.icon}`}>
                                        {memory.type}
                                        {memory.relation && (
                                            <>
                                                <span className="text-slate-300 mx-1.5">•</span>
                                                <span className="text-[#0F172A]">{memory.relation.role}</span>
                                                <span className="text-slate-400 ml-1 lowercase truncate max-w-[90px]">({memory.relation.name.split(' ')[0]})</span>
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <p className="text-[14px] text-[#0F172A] leading-relaxed font-medium mb-4 mt-2">
                                {memory.text}
                            </p>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 mb-3">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                    <span className="text-slate-600">{memory.source}</span>
                                    <span>•</span>
                                    <span>{memory.date}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-md px-3 py-2 border border-slate-100 text-[12px] text-slate-600 font-medium">
                                <span className="font-bold text-slate-800">Why recalled:</span> {memory.whyRecalled}
                            </div>
                        </div>
                    );
                })}
                {!isLoading && memories.length === 0 && (
                    <div className="text-center p-6 text-slate-400 text-[14px] font-medium">
                        No relevant context found.
                    </div>
                )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-[#FDFDFD] text-[10px] text-slate-400 uppercase tracking-widest font-bold flex justify-center items-center gap-2">
                Powered by HydraDB
            </div>
        </div>
    );
};

const Composer = ({ onAction, selectedStakeholders = [] }) => {
    const [prompt, setPrompt] = useState('');

    const targetText = selectedStakeholders.length > 0
        ? ` for ${selectedStakeholders.map(s => s.split(' ')[0]).join(', ')}`
        : '';

    return (
        <div className="relative mb-10">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_24px_rgba(15,23,42,0.04)] overflow-hidden transition-all focus-within:border-[#2563EB] group">
                <div className="p-5 flex items-start gap-4 bg-white">
                    <Sparkles size={18} className="text-[#2563EB] mt-1" />
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={`Ask ContextIQ to draft, summarize, or prepare${targetText}...`}
                        className="w-full resize-none text-[16px] outline-none text-[#0F172A] placeholder:text-slate-400 min-h-[70px] font-medium leading-relaxed bg-transparent"
                    />
                </div>

                <div className="px-5 py-4 border-t border-slate-100 flex flex-wrap gap-2 items-center justify-between bg-slate-50/50">
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => onAction('prep')} className="px-4 py-2 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm">
                            Prepare for meeting
                        </button>
                        <button onClick={() => onAction('draft')} className="px-4 py-2 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm">
                            Draft follow-up
                        </button>
                        <button onClick={() => onAction('risks')} className="px-4 py-2 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm">
                            Summarize blockers
                        </button>
                        <button onClick={() => onAction('changes')} className="px-4 py-2 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm">
                            What changed recently?
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[11px] font-sans font-bold text-slate-400 bg-slate-100 rounded border border-slate-200">
                            <Command size={12} /> Enter
                        </kbd>
                        <button onClick={() => onAction('prep')} className="w-10 h-10 rounded-xl bg-[#0F172A] text-white flex items-center justify-center hover:bg-slate-800 transition-colors shadow-md">
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- OUTPUT CARDS ---

const OutputCardWrapper = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out flex flex-col h-full">
        <div className="border-b border-slate-100 p-5 flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white shadow-sm">
                    <Icon size={14} strokeWidth={2.5} />
                </div>
                <div>
                    <h3 className="text-[16px] font-bold text-[#0F172A] tracking-tight">{title}</h3>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"><MoreHorizontal size={18} /></button>
            </div>
        </div>
        <div className="p-8 flex-1">
            {children}
        </div>
        <HydraFooter />
    </div>
);

const PrepCard = ({ account, selectedStakeholders }) => {
    const targetNames = selectedStakeholders.length > 0 ? selectedStakeholders.join(', ') : 'All Stakeholders';
    return (
        <OutputCardWrapper title="Prepared Brief" icon={Sparkles}>
            <div className="max-w-2xl space-y-10">
                <div>
                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Objective</h4>
                    <p className="text-[15px] text-[#0F172A] leading-relaxed font-medium">Unblock negotiation and align on immediate next steps with {targetNames}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div>
                        <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Key Talking Points</h4>
                        <ul className="text-[14px] text-slate-700 leading-relaxed space-y-3 list-disc list-inside font-medium">
                            <li>Status of SOC2 Type II audit completion</li>
                            <li>Revised tiered pricing model (no premium support)</li>
                            <li>Alignment on Nov 15 budget refresh deadline</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-slate-100 pb-2">Risks & Promises</h4>
                        <ul className="text-[14px] text-slate-700 leading-relaxed space-y-3 font-medium">
                            <li className="flex gap-3 items-start"><AlertTriangle size={16} className="text-[#B91C1C] shrink-0 mt-0.5" /> Deal slipping to Q1 if timeline missed.</li>
                            <li className="flex gap-3 items-start"><CheckCircle2 size={16} className="text-[#15803D] shrink-0 mt-0.5" /> Promised a bulleted, concise follow-up for Sarah.</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                    <h4 className="text-[12px] font-bold text-slate-400 uppercase tracking-widest mb-3">Suggested Next Step</h4>
                    <p className="text-[15px] text-[#0F172A] font-bold leading-relaxed">"Can we provide a preliminary attestation letter today to unblock procurement while the final audit is processed?"</p>
                </div>
            </div>
        </OutputCardWrapper>
    );
};

const DraftCard = ({ account, selectedStakeholders }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    const targetNames = selectedStakeholders.length > 0 ? selectedStakeholders.join(', ') : account.stakeholders[0]?.name;
    const firstNames = selectedStakeholders.length > 0 ? selectedStakeholders.map(n => n.split(' ')[0]).join(' & ') : account.stakeholders[0]?.name.split(' ')[0];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(15,23,42,0.04)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out flex flex-col h-full">
            <div className="border-b border-slate-100 p-5 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-white shadow-sm"><Mail size={14} strokeWidth={2.5} /></div>
                    <h3 className="text-[16px] font-bold text-[#0F172A] tracking-tight">Drafted Follow-up</h3>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleCopy} className="px-4 py-2 flex items-center gap-2 text-[13px] font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        {copied ? <Check size={16} className="text-[#15803D]" /> : <Copy size={16} />} {copied ? 'Copied' : 'Copy'}
                    </button>
                </div>
            </div>

            <div className="p-8 flex-1">
                <div className="max-w-2xl">
                    <div className="mb-8 space-y-3 text-[14px] border-b border-slate-100 pb-5 font-medium">
                        <div className="flex text-slate-500"><span className="w-20 font-bold uppercase tracking-widest text-[11px]">To:</span> <span className="text-[#0F172A] font-bold">{targetNames}</span></div>
                        <div className="flex text-slate-500"><span className="w-20 font-bold uppercase tracking-widest text-[11px]">Subject:</span> <span className="font-bold text-[#0F172A]">Updated Pricing & Security Attestation</span></div>
                    </div>
                    <div className="text-[15px] text-[#0F172A] leading-relaxed space-y-5 whitespace-pre-wrap font-medium">
                        {`Hi ${firstNames},\n\nThanks for the transparent conversation earlier this week. Based on our discussion, here is the updated, bulleted pricing overview you requested (premium support excluded):\n\n• Platform License: $95,000/yr\n• Standard Support (Included): $0\n• Implementation: $25,000 (One-time)\n\nRegarding the security requirements: our SOC2 Type II audit report will be finalized by Oct 28th. I can provide a preliminary attestation letter today if that unblocks procurement.\n\nLet me know if this aligns with the current budget cycle.\n\nBest,\n${account.owner}`}
                    </div>
                </div>
            </div>
            <HydraFooter />
        </div>
    );
};

const RisksCard = () => (
    <OutputCardWrapper title="Summarized Blockers" icon={ShieldAlert}>
        <div className="max-w-2xl space-y-6">
            <div className="flex gap-5 items-start bg-[#FDECEC] p-5 rounded-xl border border-[#F5CACA]">
                <ShieldAlert size={20} className="text-[#991B1B] mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-[15px] font-bold text-[#991B1B]">Missing SOC2 Type II Compliance</h4>
                    <p className="text-[14px] text-[#991B1B]/80 mt-1 font-medium leading-relaxed">David (CISO) established this as a hard blocker. Without it, procurement will not sign off.</p>
                </div>
            </div>
            <div className="flex gap-5 items-start bg-[#FFF4E8] p-5 rounded-xl border border-[#F4DFC1]">
                <Clock size={20} className="text-[#B45309] mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-[15px] font-bold text-[#B45309]">Nov 15 Budget Deadline</h4>
                    <p className="text-[14px] text-[#B45309]/80 mt-1 font-medium leading-relaxed">If the deal is not signed by mid-November, the budget will refresh and the deal is highly likely to slip into Q1.</p>
                </div>
            </div>
        </div>
    </OutputCardWrapper>
);

const ChangesCard = () => (
    <OutputCardWrapper title="Recent Changes" icon={Activity}>
        <div className="max-w-2xl space-y-8">
            <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Calendar size={20} className="text-slate-600" />
                </div>
                <div>
                    <h4 className="text-[15px] font-bold text-[#0F172A]">Procurement requirements added</h4>
                    <p className="text-[14px] text-slate-500 mt-1 font-medium leading-relaxed">Alex Chen logged new requirements from the procurement team yesterday at 4:15 PM, shifting the timeline urgency.</p>
                </div>
            </div>
            <div className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <MessageSquare size={20} className="text-slate-600" />
                </div>
                <div>
                    <h4 className="text-[15px] font-bold text-[#0F172A]">Pricing commitment made</h4>
                    <p className="text-[14px] text-slate-500 mt-1 font-medium leading-relaxed">A commitment was made internally to provide a revised tiered pricing model excluding premium support to fit the budget constraint.</p>
                </div>
            </div>
        </div>
    </OutputCardWrapper>
);

// --- OVERVIEW & CONTACTS VIEWS ---

const OverviewView = ({ db, setActiveAccount, setActiveView }) => (
    <div className="max-w-6xl mx-auto px-10 py-12 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200 rounded-2xl mb-12 shadow-sm divide-y md:divide-y-0 md:divide-x divide-slate-100 overflow-hidden">
            <div className="p-6 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <Briefcase size={20} />
                </div>
                <div>
                    <p className="text-[16px] font-bold text-[#0F172A] leading-tight">3 Accounts</p>
                    <p className="text-[14px] text-slate-500 mt-1 font-medium">Need follow-up today</p>
                </div>
            </div>
            <div className="p-6 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#FDECEC] border border-[#F5CACA] flex items-center justify-center text-[#991B1B] shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <ShieldAlert size={20} />
                </div>
                <div>
                    <p className="text-[16px] font-bold text-[#0F172A] leading-tight">2 Blockers</p>
                    <p className="text-[14px] text-slate-500 mt-1 font-medium">Unresolved across deals</p>
                </div>
            </div>
            <div className="p-6 flex items-center gap-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-[#FFF4E8] border border-[#F4DFC1] flex items-center justify-center text-[#B45309] shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <p className="text-[16px] font-bold text-[#0F172A] leading-tight">1 Renewal</p>
                    <p className="text-[14px] text-slate-500 mt-1 font-medium">At risk this quarter</p>
                </div>
            </div>
        </div>

        <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-6">Accounts Needing Attention</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {Object.values(db).map(acc => (
                <div
                    key={acc.id} onClick={() => { setActiveAccount(acc.id); setActiveView('accounts'); }}
                    className="p-8 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-[0_12px_40px_rgba(15,23,42,0.06)] hover:border-slate-300 transition-all cursor-pointer group flex flex-col h-full"
                >
                    <div className="flex justify-between items-start mb-6">
                        <Badge className={acc.health === 'at-risk' ? 'bg-[#FDECEC] text-[#991B1B] border-[#F5CACA]' : acc.health === 'stalled' ? 'bg-[#FFF4E8] text-[#B45309] border-[#F4DFC1]' : ''}>
                            {acc.stage}
                        </Badge>
                        <span className="text-[12px] font-bold text-slate-400 flex items-center gap-1.5"><Clock size={12} /> {acc.lastInteraction}</span>
                    </div>
                    <h3 className="text-[20px] font-bold text-[#0F172A] transition-colors mb-2">{acc.name}</h3>
                    <p className="text-[15px] font-semibold text-slate-500 mb-6">{acc.arr} ARR</p>

                    <div className="mt-auto pt-5 border-t border-slate-100">
                        <p className="text-[14px] text-slate-600 leading-relaxed font-medium line-clamp-2"><span className="font-bold text-[#0F172A]">Key Context:</span> {acc.topMemory}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-5">Suggested Next Actions</h2>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div onClick={() => { setActiveAccount('acme'); setActiveView('accounts'); }} className="p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex gap-5 items-center group">
                        <div className="w-12 h-12 rounded-full bg-[#EAF1FF] flex items-center justify-center text-[#2563EB] shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all"><MessageSquare size={18} /></div>
                        <div>
                            <p className="text-[15px] font-bold text-[#0F172A]">Draft pricing email for Sarah Jenkins</p>
                            <p className="text-[14px] font-medium text-slate-500 mt-1">Acme Corp • Pending commitment</p>
                        </div>
                    </div>
                    <div onClick={() => { setActiveAccount('acme'); setActiveView('accounts'); }} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer flex gap-5 items-center group">
                        <div className="w-12 h-12 rounded-full bg-[#FDECEC] flex items-center justify-center text-[#991B1B] shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all"><ShieldAlert size={18} /></div>
                        <div>
                            <p className="text-[15px] font-bold text-[#0F172A]">Provide SOC2 update to David Kim</p>
                            <p className="text-[14px] font-medium text-slate-500 mt-1">Acme Corp • Unresolved blocker</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-5">Recent Memory Signals</h2>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div onClick={() => { setActiveAccount('globex'); setActiveView('accounts'); }} className="p-6 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer flex gap-5 items-center group">
                        <div className="w-12 h-12 rounded-full bg-[#FFF4E8] flex items-center justify-center text-[#B45309] shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all"><Zap size={18} /></div>
                        <div>
                            <p className="text-[15px] font-bold text-[#0F172A]">Competitive threat detected</p>
                            <p className="text-[14px] font-medium text-slate-500 mt-1">Globex Inc • Evaluating 3 other vendors</p>
                        </div>
                    </div>
                    <div onClick={() => { setActiveAccount('acme'); setActiveView('accounts'); }} className="p-6 hover:bg-slate-50 transition-colors cursor-pointer flex gap-5 items-center group">
                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all"><Calendar size={18} /></div>
                        <div>
                            <p className="text-[15px] font-bold text-[#0F172A]">Procurement requirements shifted</p>
                            <p className="text-[14px] font-medium text-slate-500 mt-1">Acme Corp • Timeline urgency increased</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ContactsView = ({ db, setActiveAccount, setActiveView }) => (
    <div className="max-w-5xl mx-auto px-10 py-12 animate-in fade-in duration-300">
        <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-8">All Contacts</h1>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {Object.values(db).flatMap(acc =>
                acc.stakeholders.map((s, i) => (
                    <div key={`${acc.id}-${i}`} onClick={() => { setActiveAccount(acc.id); setActiveView('accounts'); }} className="flex items-center gap-6 p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-[14px] font-bold text-slate-700 group-hover:bg-white group-hover:border group-hover:border-slate-200 transition-all shadow-sm">
                            {s.initials}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div>
                                <p className="text-[16px] font-bold text-[#0F172A]">{s.name}</p>
                                <p className="text-[14px] font-medium text-slate-500">{s.role} <span className="text-slate-300 mx-1.5">•</span> {acc.name}</p>
                            </div>
                            <div className="col-span-2 flex justify-between items-center">
                                <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-[13px] font-medium text-slate-600 truncate max-w-md">
                                    {s.persona === "Economic Buyer" ? "Prefers concise bullet-point emails" :
                                        s.persona === "Security/Blocker" ? "Hard blocker on SOC2 compliance" :
                                            s.persona === "Decision Maker" ? "Avoid corporate jargon" : `Persona: ${s.persona}`}
                                </div>
                                <button className="px-5 py-2.5 text-[12px] font-bold uppercase tracking-widest text-slate-600 border border-slate-200 rounded-lg hover:bg-white hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm opacity-0 group-hover:opacity-100">
                                    View Context
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
);

const TimelineCard = ({ item, onClick, showAccount }) => {
    const IconMap = { email: Mail, note: Calendar, call: Phone };
    const Icon = IconMap[item.type] || Activity;

    return (
        <div className={`flex gap-6 group ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
            <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full border shadow-sm flex items-center justify-center transition-colors z-10 relative ${item.highlight ? 'bg-[#0F172A] border-[#0F172A] text-white' : 'bg-white border-slate-200 text-slate-400 group-hover:border-slate-300 group-hover:text-slate-600'}`}>
                    <Icon size={18} />
                </div>
                <div className="w-px h-full bg-slate-200 mt-2 -mb-2 group-last:hidden" />
            </div>
            <div className="pb-12 pt-2.5 flex-1">
                <div className="flex items-center justify-between">
                    <p className={`text-[16px] tracking-tight ${item.highlight ? 'font-bold text-[#0F172A]' : 'font-bold text-slate-800'}`}>{item.title}</p>
                    {item.tag && <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">{item.tag}</span>}
                </div>
                <p className="text-[14px] font-medium text-slate-500 mt-1.5">
                    {item.user} • {item.date} {showAccount && item.accountName && <span>• <span className="text-slate-700">{item.accountName}</span></span>}
                </p>
            </div>
        </div>
    );
};

export default function App() {
    const [appState, setAppState] = useState('landing'); // 'landing', 'auth', 'workspace'
    const [activeView, setActiveView] = useState('overview');
    const [activeAccountId, setActiveAccountId] = useState('acme');
    const [activeAction, setActiveAction] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [selectedStakeholders, setSelectedStakeholders] = useState([]);

    React.useEffect(() => {
        setActiveAction(null);
        setSelectedStakeholders([]);
    }, [activeAccountId, activeView]);

    if (appState === 'landing') {
        return <LandingPage onNavigateToAuth={() => setAppState('auth')} onLogin={() => setAppState('workspace')} />;
    }

    if (appState === 'auth') {
        return <AuthPage onBack={() => setAppState('landing')} onLogin={() => setAppState('workspace')} />;
    }

    const activeAccountData = ACCOUNTS_DB[activeAccountId];
    const activeMemories = MEMORIES_DB[activeAccountId] || [];
    const activeTimeline = TIMELINE_DB[activeAccountId] || [];

    const handleAction = (action) => {
        setIsGenerating(true);
        setActiveAction(null);
        setTimeout(() => {
            setIsGenerating(false);
            setActiveAction(action);
        }, 1200);
    };

    const toggleStakeholder = (name) => {
        setSelectedStakeholders(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const displayedMemories = activeView === 'accounts'
        ? (selectedStakeholders.length > 0
            ? activeMemories.filter(m => m.relation && selectedStakeholders.includes(m.relation.name))
            : activeMemories)
        : Object.values(MEMORIES_DB).flat().slice(0, 4);

    return (
        <div className="flex h-screen bg-[#FDFDFD] font-sans text-[#0F172A] selection:bg-[#EAF1FF] selection:text-[#0F172A] antialiased overflow-hidden">
            <Sidebar
                activeView={activeView}
                setActiveView={setActiveView}
                activeAccount={activeAccountId}
                setActiveAccount={setActiveAccountId}
            />

            <div className="flex-1 flex flex-col min-w-0 bg-white relative shadow-[-10px_0_30px_rgba(15,23,42,0.03)] z-20 border-l border-slate-200/50">
                <Header
                    accountName={activeView === 'accounts' ? activeAccountData.name : (activeView.charAt(0).toUpperCase() + activeView.slice(1))}
                    setActiveView={setActiveView}
                    onLogout={() => setAppState('landing')}
                />

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Workspace Area */}
                    <main className="flex-1 overflow-y-auto">
                        {activeView === 'overview' && <OverviewView db={ACCOUNTS_DB} setActiveAccount={setActiveAccountId} setActiveView={setActiveView} />}
                        {activeView === 'contacts' && <ContactsView db={ACCOUNTS_DB} setActiveAccount={setActiveAccountId} setActiveView={setActiveView} />}
                        {activeView === 'activity' && (
                            <div className="max-w-4xl mx-auto px-10 py-12 animate-in fade-in duration-300">
                                <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mb-12">Activity Stream</h1>
                                <div className="ml-2">
                                    {Object.entries(TIMELINE_DB).flatMap(([accId, items]) =>
                                        items.map(item => ({ ...item, accId, accountName: ACCOUNTS_DB[accId].name }))
                                    ).map((item, i) => (
                                        <TimelineCard
                                            key={i}
                                            item={item}
                                            showAccount={true}
                                            onClick={() => { setActiveAccountId(item.accId); setActiveView('accounts'); }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeView === 'accounts' && (
                            <div className="max-w-4xl mx-auto px-10 py-12 animate-in fade-in duration-300">
                                {/* Account Header Section */}
                                <div className="mb-12">
                                    <div className="flex items-center gap-3 mb-5">
                                        <Badge className={activeAccountData.health === 'at-risk' ? 'bg-[#FDECEC] text-[#991B1B] border-[#F5CACA]' : activeAccountData.health === 'stalled' ? 'bg-[#FFF4E8] text-[#B45309] border-[#F4DFC1]' : ''}>{activeAccountData.stage}</Badge>
                                        <Badge>Priority: {activeAccountData.priority}</Badge>
                                        <Badge>ARR: {activeAccountData.arr}</Badge>
                                    </div>
                                    <h1 className="text-[40px] font-extrabold text-[#0F172A] tracking-tight mb-3 leading-none">{activeAccountData.name}</h1>
                                    <div className="flex items-center gap-4 text-[15px] font-medium text-slate-500 mt-4">
                                        <a href={`https://${activeAccountData.website}`} className="hover:text-slate-900 transition-colors flex items-center gap-2"><Briefcase size={16} /> {activeAccountData.website}</a>
                                        <span className="text-slate-300">•</span>
                                        <span>Owner: <span className="font-bold text-[#0F172A]">{activeAccountData.owner}</span></span>
                                        <span className="text-slate-300">•</span>
                                        <span className="flex items-center gap-2"><Clock size={16} /> Last contacted {activeAccountData.lastInteraction}</span>
                                    </div>
                                </div>

                                {/* Stakeholders Row */}
                                <div className="mb-12 flex flex-col gap-5">
                                    <span className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Key Stakeholders</span>
                                    <div className="flex flex-wrap gap-5">
                                        {activeAccountData.stakeholders.map(person => {
                                            const isSelected = selectedStakeholders.includes(person.name);
                                            return (
                                                <button
                                                    key={person.name}
                                                    onClick={() => toggleStakeholder(person.name)}
                                                    className={`flex items-center gap-4 group cursor-pointer p-4 -ml-4 rounded-2xl transition-all text-left ${isSelected
                                                            ? 'bg-slate-50 ring-1 ring-slate-300 shadow-[0_4px_12px_rgba(15,23,42,0.04)]'
                                                            : 'hover:bg-slate-50 border-transparent border'
                                                        }`}
                                                >
                                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[15px] font-bold border shadow-sm transition-all ${isSelected
                                                            ? 'bg-[#0F172A] border-[#0F172A] text-white'
                                                            : 'bg-white border-slate-200 text-slate-600 group-hover:border-slate-300'
                                                        }`}>
                                                        {isSelected ? <Check size={20} strokeWidth={3} /> : person.initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-[16px] font-bold text-[#0F172A] leading-tight">{person.name}</p>
                                                        <p className="text-[14px] font-medium text-slate-500 mt-1">{person.role}</p>
                                                        <span className="inline-block mt-2.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold uppercase tracking-widest text-slate-500">{person.persona}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Action Composer */}
                                <Composer onAction={handleAction} selectedStakeholders={selectedStakeholders} />

                                {/* Content Area: Outputs or Timeline */}
                                <div className="mt-8 mb-20">
                                    {isGenerating ? (
                                        <div className="space-y-5 animate-pulse">
                                            <div className="h-8 bg-slate-100 rounded w-1/4 mb-6"></div>
                                            <div className="h-72 bg-slate-50 border border-slate-200 rounded-2xl"></div>
                                            <div className="text-center text-[11px] font-bold text-[#2563EB] uppercase tracking-widest mt-5">Generating grounded output...</div>
                                        </div>
                                    ) : activeAction === 'prep' ? (
                                        <PrepCard account={activeAccountData} selectedStakeholders={selectedStakeholders} />
                                    ) : activeAction === 'draft' ? (
                                        <DraftCard account={activeAccountData} selectedStakeholders={selectedStakeholders} />
                                    ) : activeAction === 'risks' ? (
                                        <RisksCard />
                                    ) : activeAction === 'changes' ? (
                                        <ChangesCard />
                                    ) : (
                                        <div className="animate-in fade-in duration-500 pt-6">
                                            <div className="flex items-center justify-between mb-10">
                                                <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-400">Activity Timeline</h3>
                                                <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                                                    Last major movement: <span className="text-slate-800">Procurement requirements added</span>
                                                </div>
                                            </div>
                                            <div className="ml-3">
                                                {activeTimeline.length > 0 ? activeTimeline.map((item, i) => (
                                                    <TimelineCard key={i} item={item} />
                                                )) : (
                                                    <p className="text-[15px] font-medium text-slate-500">No recent activity.</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Context Rail */}
                    <MemoryRail
                        memories={displayedMemories}
                        isLoading={isGenerating}
                        contextFilterName={selectedStakeholders.length > 0 ? selectedStakeholders.join(', ') : null}
                    />
                </div>
            </div>
        </div>
    );
}