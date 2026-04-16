import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  RefreshCcw, 
  Phone, 
  User, 
  MapPin, 
  Loader2, 
  ChevronRight,
  Shield,
  UserCheck,
  Zap,
  Navigation,
  Scale,
  Eye,
  Users
} from 'lucide-react';

// --- Types ---

interface CommunicationData {
  'Assembly Constituency': string;
  'RO Name': string;
  'RO Number': string;
  'ARO1 Name': string;
  'ARO1 Number': string;
  'ARO2 Name': string;
  'ARO2 Number': string;
  'FST Name': string;
  'FST Number': string;
  'SST Name': string;
  'SST Number': string;
  'Zonal Officer Name': string;
  'Zonal Officer Number': string;
  'Zonal Officer Assistant Name': string;
  'Zonal Officer Assistant Number': string;
  'DSP Name': string;
  'DSP Number': string;
  'Assembly Inspector': string;
  'Assembly Inspector Number': string;
  'Inspector': string;
  'Inspector Number': string;
}

interface Contact {
  name: string;
  number: string;
}

interface GroupedRoleData {
  id: string;
  title: string;
  icon: React.ReactNode;
  contacts: Contact[];
  color: string;
}

interface RoleDefinition {
  id: string;
  title: string;
  icon: React.ReactNode;
  nameKey: keyof CommunicationData;
  numberKey: keyof CommunicationData;
  color: string;
}

// --- Constants ---

const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1HLOWIsSJ-ba74uGI9ogd3GQiPl5c7CSN/export?format=csv';

const ROLE_DEFINITIONS: RoleDefinition[] = [
  { id: 'ro', title: 'RO', icon: <UserCheck className="w-5 h-5" />, nameKey: 'RO Name', numberKey: 'RO Number', color: 'bg-[#FFF5EB] text-[#E66E00] border-[#FFE4CC]' },
  { id: 'aro1', title: 'ARO 1', icon: <User className="w-5 h-5" />, nameKey: 'ARO1 Name', numberKey: 'ARO1 Number', color: 'bg-[#FFF5EB] text-[#E66E00] border-[#FFE4CC]' },
  { id: 'aro2', title: 'ARO 2', icon: <User className="w-5 h-5" />, nameKey: 'ARO2 Name', numberKey: 'ARO2 Number', color: 'bg-[#FFF5EB] text-[#E66E00] border-[#FFE4CC]' },
  { id: 'fst', title: 'FST', icon: <Zap className="w-5 h-5" />, nameKey: 'FST Name', numberKey: 'FST Number', color: 'bg-[#F0F9F0] text-[#0B6623] border-[#D1EAD1]' },
  { id: 'sst', title: 'SST', icon: <Eye className="w-5 h-5" />, nameKey: 'SST Name', numberKey: 'SST Number', color: 'bg-[#F0F9F0] text-[#0B6623] border-[#D1EAD1]' },
  { id: 'zonal', title: 'Zonal Officer', icon: <Navigation className="w-5 h-5" />, nameKey: 'Zonal Officer Name', numberKey: 'Zonal Officer Number', color: 'bg-[#F0F4F8] text-[#003366] border-[#D1E0ED]' },
  { id: 'zonal_assistant', title: 'Zonal Officer Assistant', icon: <User className="w-5 h-5" />, nameKey: 'Zonal Officer Assistant Name', numberKey: 'Zonal Officer Assistant Number', color: 'bg-[#F0F4F8] text-[#003366] border-[#D1E0ED]' },
  { id: 'dsp', title: 'DSP', icon: <Shield className="w-5 h-5" />, nameKey: 'DSP Name', numberKey: 'DSP Number', color: 'bg-[#F0F4F8] text-[#003366] border-[#D1E0ED]' },
  { id: 'assembly_inspector', title: 'Assembly Inspector', icon: <Scale className="w-5 h-5" />, nameKey: 'Assembly Inspector', numberKey: 'Assembly Inspector Number', color: 'bg-[#F8F9FA] text-[#343A40] border-[#E9ECEF]' },
  { id: 'inspector', title: 'Inspector', icon: <Shield className="w-5 h-5" />, nameKey: 'Inspector', numberKey: 'Inspector Number', color: 'bg-[#F8F9FA] text-[#343A40] border-[#E9ECEF]' },
];

// --- Components ---

interface ContactCardProps {
  key?: React.Key;
  roleData: GroupedRoleData;
}

const ContactCard = ({ roleData }: ContactCardProps) => {
  if (roleData.contacts.length === 0) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-5 rounded-2xl border ${roleData.color} shadow-sm transition-all hover:shadow-md group flex flex-col h-full`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-xl bg-white/80 shadow-sm">
          {roleData.icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">
            {roleData.id}
          </span>
          {roleData.contacts.length > 1 && (
            <span className="text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full mt-1">
              {roleData.contacts.length} Officers
            </span>
          )}
        </div>
      </div>
      
      <h3 className="text-sm font-semibold mb-4 opacity-80">{roleData.title}</h3>
      
      <div className={`grid gap-4 flex-1 ${roleData.contacts.length > 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {roleData.contacts.map((contact, idx) => (
          <div 
            key={idx} 
            className="p-4 rounded-xl bg-white/40 border border-black/5 flex flex-col justify-center space-y-3 hover:bg-white/60 transition-colors"
          >
            <div>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-0.5">Name</p>
              <p className="text-base font-bold leading-tight text-slate-800">{contact.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-0.5">Contact</p>
              {contact.number ? (
                <a 
                  href={`tel:${contact.number}`}
                  className="text-base font-mono font-bold flex items-center gap-2 text-[#000080] hover:text-[#FF9933] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {contact.number}
                </a>
              ) : (
                <p className="text-base font-mono font-bold opacity-30">Not Available</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default function App() {
  const [data, setData] = useState<CommunicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [groupedResult, setGroupedResult] = useState<GroupedRoleData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SHEET_URL);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header) => header.trim(),
          transform: (value) => value.trim(),
          complete: (results) => {
            setData(results.data as CommunicationData[]);
            setLoading(false);
          },
          error: (err: any) => {
            setError('Failed to parse data');
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const constituencies = useMemo(() => {
    const unique = Array.from(new Set(data.map(item => item['Assembly Constituency'])))
      .filter(Boolean)
      .sort();
    return unique;
  }, [data]);

  const handleSearch = () => {
    if (!selectedConstituency) return;
    
    const filteredRows = data.filter(item => item['Assembly Constituency'] === selectedConstituency);
    
    const grouped: GroupedRoleData[] = ROLE_DEFINITIONS.map(def => {
      const contacts: Contact[] = [];
      const seen = new Set<string>();

      filteredRows.forEach(row => {
        const name = row[def.nameKey] as string;
        const number = row[def.numberKey] as string;
        
        if (name || number) {
          const key = `${name}|${number}`;
          if (!seen.has(key)) {
            contacts.push({ name, number });
            seen.add(key);
          }
        }
      });

      return {
        id: def.id,
        title: def.title,
        icon: def.icon,
        color: def.color,
        contacts
      };
    });

    setGroupedResult(grouped);
    setHasSearched(true);
  };

  const handleReset = () => {
    setSelectedConstituency('');
    setGroupedResult([]);
    setHasSearched(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-[#000080] animate-spin mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading Communication Plan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCcw className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#000080] text-white rounded-xl font-bold hover:bg-[#000066] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-orange-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-t-4 border-t-[#FF9933] border-b-[#138808] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl font-black tracking-tight text-[#000080]"
            >
              Thoothukudi District Communication Plan
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mt-1 text-sm sm:text-base text-slate-500 font-medium flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#FF9933]" />
              Constituency Wise - Directory
            </motion.p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Controls */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 space-y-6">
            <div className="space-y-2">
              <label htmlFor="constituency" className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Select Assembly Constituency
              </label>
              <div className="relative">
                <select
                  id="constituency"
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                  className="block w-full pl-4 pr-10 py-4 text-base border-2 border-slate-100 focus:outline-none focus:ring-2 focus:ring-[#000080] focus:border-transparent sm:text-sm rounded-2xl appearance-none bg-slate-50 font-semibold transition-all cursor-pointer"
                >
                  <option value="">Choose a constituency...</option>
                  {constituencies.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSearch}
                disabled={!selectedConstituency}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#000080] text-white rounded-2xl font-bold hover:bg-[#000066] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
              >
                <Search className="w-5 h-5" />
                Search Directory
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <RefreshCcw className="w-5 h-5" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {hasSearched ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                    <Users className="w-4 h-4 text-slate-400" />
                    <h2 className="text-sm font-black text-slate-600 uppercase tracking-widest">
                      {selectedConstituency}
                    </h2>
                  </div>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                
                <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                  {groupedResult.map((roleData) => (
                    <ContactCard key={roleData.id} roleData={roleData} />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Navigation className="w-12 h-12 text-[#000080]" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ready to Search</h3>
                <p className="text-slate-500 leading-relaxed">
                  Select an assembly constituency from the dropdown above to view the contact directory for election officials.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">
            Thoothukudi District Administration
          </p>
          <p className="mt-2 text-[10px] text-slate-400">
            Data sourced from official communication plan records.
          </p>
        </div>
      </footer>
    </div>
  );
}
