import React, { useState, useEffect, useMemo } from 'react';
import Papa from 'papaparse';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  RefreshCcw, 
  RotateCcw,
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
  Users,
  Flag,
  Map as MapIcon,
  Building2,
  PhoneCall,
  Activity
} from 'lucide-react';

// --- Sub-Components ---

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.048c0 2.123.554 4.197 1.604 6.046L0 24l6.105-1.602a11.83 11.83 0 005.94 1.586h.005c6.636 0 12.044-5.414 12.049-12.05.002-3.214-1.251-6.234-3.522-8.506"/>
  </svg>
);

// --- Types & Interfaces ---

interface RawData {
  'Polling Station No': string;
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
  'subdivision'?: string;
  'Subdivision'?: string;
  'Assembly Inspector': string;
  'Assembly Inspector Number': string;
  'Police Station': string;
  'Inspector': string;
  'Inspector Number': string;
  'Police Station-Inspector': string;
  'Assembly Coordinator (Web Casting) Name'?: string;
  'Assembly Coordinator (Web Casting) Number'?: string;
}

interface SupervisorRawData {
  'Assembly Constituency': string;
  'Polling Station No': string;
  'Supervisor Name': string;
  'Supervisor Number': string;
}

interface MedicalRawData {
  'Assembly Constituency': string;
  'Mobile Medical Team Name'?: string;
  'Mobile Medical Team Number'?: string;
  'Block Medical Officer Name'?: string;
  'Block Medical Officer Number'?: string;
}

interface Contact {
  name: string;
  phone: string;
  extra?: string;
  label?: string;
}

interface ZonalGroup {
  zonalName: string;
  zonalPhone: string;
  assistantName: string;
  assistantPhone: string;
  minPS: number;
  maxPS: number;
  psRanges: string;
}

interface SupervisorGroup {
  name: string;
  phone: string;
  psRanges: string;
  minPS: number;
}

// --- Constants ---

const CSV_URL = 'https://docs.google.com/spreadsheets/d/1HLOWIsSJ-ba74uGI9ogd3GQiPl5c7CSN/export?format=csv';
const SUPERVISOR_CSV_URL = 'https://docs.google.com/spreadsheets/d/13d7oA0ODdeprlxI7i5pTHIzCbd4QQGH8/export?format=csv';
const MEDICAL_CSV_URL = 'https://docs.google.com/spreadsheets/d/1iLuxp0stvQjs9a3LWOmtkhbTyBD8FU2H/export?format=csv';

// --- Sub-Components ---

const SectionCard = ({ title, children, icon: Icon, layoutClass = "grid-cols-1", bannerColor = "bg-slate-50", iconColor = "text-[#000080]" }: { title: string, children: React.ReactNode, icon: React.ElementType, layoutClass?: string, bannerColor?: string, iconColor?: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
    className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-shadow duration-500"
  >
    <div className={`px-6 py-4 ${bannerColor} border-b border-slate-100 flex items-center justify-between`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 bg-white/90 rounded-2xl shadow-sm border border-slate-100`}>
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{title}</h3>
      </div>
    </div>
    <div className={`p-6 grid gap-4 ${layoutClass}`}>
      {children}
    </div>
  </motion.div>
);

const ContactItem = ({ name, phone, extra, label, accent = "navy", delay = 0 }: Contact & { accent?: "navy" | "saffron" | "green", delay?: number }) => {
  const accentColors = {
    navy: "group-hover:text-[#000080] group-hover:bg-blue-50/50 border-blue-100",
    saffron: "group-hover:text-[#FF9933] group-hover:bg-orange-50/50 border-orange-100",
    green: "group-hover:text-[#138808] group-hover:bg-green-50/50 border-green-100"
  };

  const btnColors = {
    navy: "bg-blue-50 text-[#000080] group-hover/btn:bg-[#000080] group-hover/btn:text-white",
    saffron: "bg-orange-50 text-[#FF9933] group-hover/btn:bg-[#FF9933] group-hover/btn:text-white",
    green: "bg-green-50 text-[#138808] group-hover/btn:bg-[#138808] group-hover/btn:text-white"
  };

  const getWhatsAppLink = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    // Assume India (+91) if not specified, but most inputs have it or are 10 digits
    const formatted = cleaned.length === 10 ? `91${cleaned}` : cleaned;
    return `https://wa.me/${formatted}`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.05 }}
      whileHover={{ scale: 1.01 }}
      className={`group p-4 rounded-2xl bg-white border border-slate-100 ${accentColors[accent]} hover:border-transparent transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.02)] hover:shadow-lg`}
    >
      {label && <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{label}</p>}
      <div className="flex flex-col gap-1">
        <h4 className="text-base font-bold text-slate-900 leading-tight group-hover:translate-x-1 transition-transform">{name || 'N/A'}</h4>
        {extra && <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">{extra}</p>}
      </div>
      <div className="mt-4 pt-4 border-t border-dashed border-slate-100 flex items-center justify-between gap-3">
        <a 
          href={`tel:${phone}`}
          className="flex-1 flex items-center gap-2 group/btn"
        >
          <div className={`p-2 rounded-lg transition-all transform group-hover/btn:scale-110 ${btnColors[accent]}`}>
            <PhoneCall className="w-3.5 h-3.5" />
          </div>
          <span className={`text-[13px] font-mono font-black text-slate-700 transition-colors whitespace-nowrap overflow-hidden text-ellipsis ${accentColors[accent].split(' ')[0]}`}>
            {phone || '000'}
          </span>
        </a>

        {phone && phone !== 'N/A' && (
          <motion.a
            whileHover={{ scale: 1.1, backgroundColor: "#128C7E" }}
            whileTap={{ scale: 0.9 }}
            href={getWhatsAppLink(phone)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-[#25D366] text-white transition-all shadow-md hover:shadow-lg flex items-center justify-center"
            title="WhatsApp Message"
          >
            <WhatsAppIcon className="w-5 h-5 fill-white" />
          </motion.a>
        )}
      </div>
    </motion.div>
  );
};

// --- Utilities ---

const extractPhone = (str: string) => {
  const phoneMatch = str.match(/\d{10,12}/);
  if (phoneMatch) {
    const phone = phoneMatch[0];
    const name = str.replace(phone, '').replace(/[()]/g, '').trim();
    return { name, phone };
  }
  return { name: str, phone: '' };
};

// --- Main App Component ---

export default function App() {
  const [data, setData] = useState<RawData[]>([]);
  const [supervisorData, setSupervisorData] = useState<SupervisorRawData[]>([]);
  const [medicalData, setMedicalData] = useState<MedicalRawData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hasSearched, setHasSearched] = useState(false);
  const [filteredResults, setFilteredResults] = useState<RawData[]>([]);
  const [filteredSupervisors, setFilteredSupervisors] = useState<SupervisorRawData[]>([]);
  const [filteredMedical, setFilteredMedical] = useState<MedicalRawData[]>([]);

  const fetchData = React.useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [response1, response2, response3] = await Promise.all([
        fetch(`${CSV_URL}&cachebust=${Date.now()}`),
        fetch(`${SUPERVISOR_CSV_URL}&cachebust=${Date.now()}`),
        fetch(`${MEDICAL_CSV_URL}&cachebust=${Date.now()}`)
      ]);

      const [csvString1, csvString2, csvString3] = await Promise.all([
        response1.text(),
        response2.text(),
        response3.text()
      ]);

      const parseCSV = (csvString: string) => {
        return new Promise<any[]>((resolve, reject) => {
          Papa.parse(csvString, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim(),
            transform: (v) => v.trim(),
            complete: (results) => resolve(results.data),
            error: (err) => reject(err)
          });
        });
      };

      const [data1, data2, data3] = await Promise.all([
        parseCSV(csvString1),
        parseCSV(csvString2),
        parseCSV(csvString3)
      ]);

      setData(data1);
      setSupervisorData(data2);
      setMedicalData(data3);
      setLoading(false);
      setIsRefreshing(false);

    } catch (err) {
      console.error(err);
      setError('Connection error. Please check your data source.');
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Page initialization
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const constituencies = useMemo(() => {
    const all = [
      ...data.map(item => item['Assembly Constituency']),
      ...supervisorData.map(item => (item as any)['Assembly Constituency']),
      ...medicalData.map(item => (item as any)['Assembly Constituency'])
    ];
    
    // Robust constituency extraction
    const robustAll = [
      ...data.map(item => {
        const keys = Object.keys(item);
        const k = keys.find(key => key.toLowerCase().includes('constituency'));
        return k ? String((item as any)[k]).trim() : '';
      }),
      ...supervisorData.map(item => {
        const keys = Object.keys(item);
        const k = keys.find(key => key.toLowerCase().includes('constituency'));
        return k ? String((item as any)[k]).trim() : '';
      }),
      ...medicalData.map(item => {
        const keys = Object.keys(item);
        const k = keys.find(key => key.toLowerCase().includes('constituency'));
        return k ? String((item as any)[k]).trim() : '';
      })
    ];

    return Array.from(new Set(robustAll))
      .filter(Boolean)
      .sort();
  }, [data, supervisorData, medicalData]);

  const handleSearch = () => {
    if (!selectedConstituency) return;
    
    // Robust filtering for all data sources
    const filterByConstituency = (item: any) => {
      const keys = Object.keys(item);
      const constituencyKey = keys.find(k => k.toLowerCase().includes('constituency'));
      if (!constituencyKey) return false;
      return String(item[constituencyKey]).trim() === selectedConstituency.trim();
    };

    const filtered = data.filter(filterByConstituency);
    const filteredSuper = supervisorData.filter(filterByConstituency);
    const filteredMed = medicalData.filter(filterByConstituency);
    
    setFilteredResults(filtered);
    setFilteredSupervisors(filteredSuper);
    setFilteredMedical(filteredMed);
    setHasSearched(true);
  };

  const handleReset = () => {
    setHasSearched(false);
    setSelectedConstituency('');
    setSelectedCategory('All');
    setFilteredResults([]);
    setFilteredSupervisors([]);
    setFilteredMedical([]);
  };

  const categories = [
    'All',
    'RO Details',
    'ARO Details',
    'FST Details',
    'SST Details',
    'Assembly Coordinator (Web Casting)',
    'Supervisor (Web Casting)',
    'Mobile Medical Team',
    'Block Medical Officers',
    'Zonal Officer Section',
    'DSP Details',
    'Assembly Inspector',
    'Inspector Details'
  ];

  // --- Filtered Data Aggregation ---

  const roDetails = useMemo(() => {
    const unique = new Map<string, Contact>();
    filteredResults.forEach(r => {
      if (r['RO Name']) unique.set(r['RO Name'], { name: r['RO Name'], phone: r['RO Number'] });
    });
    return Array.from(unique.values());
  }, [filteredResults]);

  const aroDetails = useMemo(() => {
    const contacts: Contact[] = [];
    const seen = new Set<string>();
    filteredResults.forEach(r => {
      const k1 = `${r['ARO1 Name']}|${r['ARO1 Number']}`;
      const k2 = `${r['ARO2 Name']}|${r['ARO2 Number']}`;
      if (r['ARO1 Name'] && !seen.has(k1)) { contacts.push({ name: r['ARO1 Name'], phone: r['ARO1 Number'], label: 'ARO 1' }); seen.add(k1); }
      if (r['ARO2 Name'] && !seen.has(k2)) { contacts.push({ name: r['ARO2 Name'], phone: r['ARO2 Number'], label: 'ARO 2' }); seen.add(k2); }
    });
    return contacts;
  }, [filteredResults]);

  const fstDetails = useMemo(() => {
    const unique = new Map<string, Contact>();
    filteredResults.forEach(r => {
      if (r['FST Name']) unique.set(r['FST Name'], { name: r['FST Name'], phone: r['FST Number'] });
    });
    return Array.from(unique.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredResults]);

  const sstDetails = useMemo(() => {
    const unique = new Map<string, Contact>();
    filteredResults.forEach(r => {
      if (r['SST Name']) unique.set(r['SST Name'], { name: r['SST Name'], phone: r['SST Number'] });
    });
    return Array.from(unique.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredResults]);

  const coordinatorDetails = useMemo(() => {
    const unique = new Map<string, Contact>();
    
    // Find the keys dynamically in case the headers don't match exactly
    let nameKey = 'Assembly Coordinator (Web Casting) Name';
    let numKey = 'Assembly Coordinator (Web Casting) Number';
    
    if (filteredResults.length > 0) {
      const keys = Object.keys(filteredResults[0]);
      
      // Look for "Web Casting" or "Webcasting" or "Coordinator" in same header
      const foundNameKey = keys.find(k => {
        const lower = k.toLowerCase();
        const hasWebCasting = lower.includes('web casting') || lower.includes('webcasting');
        const isName = lower.includes('name');
        return hasWebCasting && isName;
      });
      
      const foundNumKey = keys.find(k => {
        const lower = k.toLowerCase();
        const hasWebCasting = lower.includes('web casting') || lower.includes('webcasting');
        const isPhone = lower.includes('number') || lower.includes('phone') || lower.includes('mobile');
        return hasWebCasting && isPhone;
      });
      
      if (foundNameKey) nameKey = foundNameKey;
      if (foundNumKey) numKey = foundNumKey;
      
      // Last resort: If still using defaults and they aren't in keys, try Column Z (25) and AA (26)
      if (!keys.includes(nameKey) && keys.length > 25) nameKey = keys[25];
      if (!keys.includes(numKey) && keys.length > 26) numKey = keys[26];
    }

    filteredResults.forEach(r => {
      const rawName = (r as any)[nameKey];
      const rawPhone = (r as any)[numKey];
      
      if (rawName) {
        const fullString = String(rawName).trim();
        const extracted = extractPhone(fullString);
        const name = extracted.name;
        const phone = extracted.phone || (rawPhone ? String(rawPhone).trim() : '');
        
        if (name && name !== 'N/A' && name !== '-' && name !== '.') {
          unique.set(name, { 
            name, 
            phone: phone || '' 
          });
        }
      }
    });
    return Array.from(unique.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredResults]);

  const supervisorGroups = useMemo(() => {
    const groupsMap = new Map<string, SupervisorRawData[]>();
    filteredSupervisors.forEach(r => {
      const keys = Object.keys(r);
      const nameKey = keys.find(k => k.toLowerCase().includes('supervisor') && k.toLowerCase().includes('name'));
      const numKey = keys.find(k => k.toLowerCase().includes('supervisor') && (k.toLowerCase().includes('number') || k.toLowerCase().includes('phone')));
      
      const sNameRaw = nameKey ? String((r as any)[nameKey]).trim() : '';
      const sPhoneRaw = numKey ? String((r as any)[numKey]).trim() : '';
      
      const extracted = extractPhone(sNameRaw);
      const sName = extracted.name;
      const sPhone = extracted.phone || sPhoneRaw;
      
      const key = `${sName}|${sPhone}`;
      if (sName && sName !== 'N/A' && sName !== '-') {
        const list = groupsMap.get(key) || [];
        list.push(r);
        groupsMap.set(key, list);
      }
    });

    const groups: SupervisorGroup[] = [];
    groupsMap.forEach((rows, key) => {
      const [name, phone] = key.split('|');
      
      const psKey = Object.keys(rows[0]).find(k => k.toLowerCase().includes('polling station') || k.toLowerCase().includes('ps no'));
      const psNumbers = Array.from(new Set(rows.map(r => {
        const val = psKey ? (r as any)[psKey] : (r as any)['Polling Station No'];
        return parseInt(String(val));
      }).filter(n => !isNaN(n))))
        .sort((a, b) => a - b);

      const formatRanges = (nums: number[]) => {
        if (nums.length === 0) return "";
        const ranges: string[] = [];
        let start = nums[0];
        let end = nums[0];

        for (let i = 1; i <= nums.length; i++) {
          if (i < nums.length && nums[i] === end + 1) {
            end = nums[i];
          } else {
            if (start === end) {
              ranges.push(`${start}`);
            } else {
              ranges.push(`${start}-${end}`);
            }
            if (i < nums.length) {
              start = nums[i];
              end = nums[i];
            }
          }
        }
        return ranges.join(", ");
      };

      groups.push({
        name,
        phone,
        psRanges: formatRanges(psNumbers),
        minPS: Math.min(...psNumbers)
      });
    });
    return groups.sort((a,b) => a.minPS - b.minPS);
  }, [filteredSupervisors]);

  const mobileMedicalDetails = useMemo(() => {
    const unique = new Map<string, Contact>();
    filteredMedical.forEach(r => {
      const keys = Object.keys(r);
      // Look for Mobile Medical Team Name (usually Col B)
      let nameKey = keys.find(k => k.toLowerCase().includes('mobile medical') && k.toLowerCase().includes('name'));
      let numKey = keys.find(k => k.toLowerCase().includes('mobile medical') && (k.toLowerCase().includes('number') || k.toLowerCase().includes('phone')));
      
      // Fallback: If not found by keywords, assume Column B (index 1) for name and find a number column
      if (!nameKey && keys.length > 1) nameKey = keys[1];
      if (!numKey && keys.length > 2) {
        // Try to find any column after the name that might be a number
        numKey = keys.find((k, idx) => idx > 1 && (k.toLowerCase().includes('number') || k.toLowerCase().includes('phone')));
      }

      let name = nameKey ? String((r as any)[nameKey]).trim() : '';
      let phone = numKey ? String((r as any)[numKey]).trim() : '';

      const extracted = extractPhone(name);
      name = extracted.name;
      if (!phone) phone = extracted.phone;

      if (name && name !== 'N/A' && name !== '-' && name !== '.') {
        unique.set(name, { name, phone });
      }
    });
    return Array.from(unique.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredMedical]);

  const blockMedicalDetails = useMemo(() => {
    const unique = new Map<string, Contact>();
    filteredMedical.forEach(r => {
      const keys = Object.keys(r);
      // Look for Block Medical Officer Name (usually Col C)
      let nameKey = keys.find(k => k.toLowerCase().includes('block medical') && k.toLowerCase().includes('name'));
      let numKey = keys.find(k => k.toLowerCase().includes('block medical') && (k.toLowerCase().includes('number') || k.toLowerCase().includes('phone')));
      
      // Fallback: If not found by keywords, assume Column C (index 2) for name
      if (!nameKey && keys.length > 2) nameKey = keys[2];
      if (!numKey && keys.length > 3) {
        // Try to find any column after the name that might be a number
        numKey = keys.find((k, idx) => idx > 2 && (k.toLowerCase().includes('number') || k.toLowerCase().includes('phone')));
      }

      let name = nameKey ? String((r as any)[nameKey]).trim() : '';
      let phone = numKey ? String((r as any)[numKey]).trim() : '';

      const extracted = extractPhone(name);
      name = extracted.name;
      if (!phone) phone = extracted.phone;

      if (name && name !== 'N/A' && name !== '-' && name !== '.') {
        unique.set(name, { name, phone });
      }
    });
    return Array.from(unique.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [filteredMedical]);

  const zonalGroups = useMemo(() => {
    const groupsMap = new Map<string, RawData[]>();
    filteredResults.forEach(r => {
      const key = `${r['Zonal Officer Name']}|${r['Zonal Officer Assistant Name']}`;
      if (r['Zonal Officer Name'] || r['Zonal Officer Assistant Name']) {
        const list = groupsMap.get(key) || [];
        list.push(r);
        groupsMap.set(key, list);
      }
    });

    const groups: ZonalGroup[] = [];
    groupsMap.forEach((rows, key) => {
      const [oName, aName] = key.split('|');
      const firstRow = rows[0];
      const psNumbers = Array.from(new Set(rows.map(r => parseInt(r['Polling Station No'])).filter(n => !isNaN(n))))
        .sort((a, b) => a - b);

      // Function to format ranges (e.g., 1,2,3,5 -> "1-3, 5")
      const formatRanges = (nums: number[]) => {
        if (nums.length === 0) return "";
        const ranges: string[] = [];
        let start = nums[0];
        let end = nums[0];

        for (let i = 1; i <= nums.length; i++) {
          if (i < nums.length && nums[i] === end + 1) {
            end = nums[i];
          } else {
            if (start === end) {
              ranges.push(`${start}`);
            } else {
              ranges.push(`${start}-${end}`);
            }
            if (i < nums.length) {
              start = nums[i];
              end = nums[i];
            }
          }
        }
        return ranges.join(", ");
      };

      groups.push({
        zonalName: oName,
        zonalPhone: firstRow['Zonal Officer Number'],
        assistantName: aName,
        assistantPhone: firstRow['Zonal Officer Assistant Number'],
        minPS: Math.min(...psNumbers),
        maxPS: Math.max(...psNumbers),
        psRanges: formatRanges(psNumbers)
      });
    });
    return groups.sort((a,b) => a.minPS - b.minPS);
  }, [filteredResults]);

  const dspDetails = useMemo(() => {
    const unique = new Map<string, Contact & { subdivision: string }>();
    filteredResults.forEach(r => {
      const subDiv = r['subdivision'] || r['Subdivision'] || '';
      if (r['DSP Name']) {
        unique.set(r['DSP Name'], { 
          name: r['DSP Name'], 
          phone: r['DSP Number'], 
          subdivision: subDiv 
        });
      }
    });
    return Array.from(unique.values());
  }, [filteredResults]);

  const assemblyInspectors = useMemo(() => {
    const unique = new Map<string, Contact & { station: string }>();
    filteredResults.forEach(r => {
      const ps = r['Police Station'];
      if (ps && r['Assembly Inspector']) {
        unique.set(ps + r['Assembly Inspector'], { 
          name: r['Assembly Inspector'], 
          phone: r['Assembly Inspector Number'], 
          station: ps 
        });
      }
    });
    return Array.from(unique.values());
  }, [filteredResults]);

  const inspectors = useMemo(() => {
    const unique = new Map<string, Contact & { psLabel: string }>();
    filteredResults.forEach(r => {
      const psLab = r['Police Station-Inspector'];
      if (psLab && r['Inspector']) {
        unique.set(psLab + r['Inspector'], { 
          name: r['Inspector'], 
          phone: r['Inspector Number'], 
          psLabel: psLab 
        });
      }
    });
    return Array.from(unique.values());
  }, [filteredResults]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#000080] animate-spin mb-4" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing District Network...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-orange-100 pb-20">
      {/* Tricolour Accent */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#FF9933]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#138808]/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-[#000080]/10 blur-[120px] rounded-full" />
      </div>

      <header className="bg-white/70 border-b border-slate-200 sticky top-0 z-50 shadow-sm backdrop-blur-xl">
        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#FF9933] via-slate-200 to-[#138808]" />
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl font-black text-[#000080] tracking-tight leading-none">
              Thoothukudi District <span className="text-[#FF9933]">Communication</span> Plan
            </h1>
            <p className="mt-2 text-xs sm:text-sm font-black text-slate-500 uppercase tracking-[0.4em] flex items-center justify-center gap-4">
              <span className="h-[1px] w-8 bg-slate-200" />
              Constituency Wise - Directory
              <span className="h-[1px] w-8 bg-slate-200" />
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Search Controls */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#138808]">
                  <MapIcon className="w-3.5 h-3.5" />
                  Select Assembly Constituency
                </label>
                <button 
                  onClick={() => fetchData(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#000080] hover:text-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCcw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Updating...' : 'Refresh Database'}
                </button>
              </div>
              <div className="relative group">
                <select
                  value={selectedConstituency}
                  onChange={(e) => setSelectedConstituency(e.target.value)}
                  className="w-full pl-5 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#000080] transition-all cursor-pointer appearance-none"
                >
                  <option value="">Choose Constituency...</option>
                  {constituencies.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-[#000080] transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600">
                  <Users className="w-3.5 h-3.5" />
                  Select Personnel Category
                </label>
              </div>
              <div className="relative group">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-5 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#000080] transition-all cursor-pointer appearance-none"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-[#000080] transition-colors">
                  <ChevronRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#0000a0" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={!selectedConstituency}
                className="flex-1 h-16 relative overflow-hidden bg-[#000080] text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-200/50 disabled:opacity-50 disabled:shadow-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Search className="w-5 h-5" />
                  Search
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-[#000080] opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                className="px-8 h-16 bg-slate-50 text-slate-400 hover:text-[#FF9933] hover:bg-orange-50 border border-slate-100 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-sm hover:shadow-orange-100/50"
              >
                <RotateCcw className="w-5 h-5 mx-auto" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Results Container */}
        <AnimatePresence mode="wait">
          {hasSearched ? (
            <motion.div 
              key={selectedConstituency}
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="space-y-10"
            >
              {/* Constituency Label */}
              <div className="flex items-center gap-6 max-w-4xl mx-auto">
                <div className="h-px flex-1 bg-slate-200"></div>
                <div className="flex items-center gap-2 bg-[#000080] text-white px-6 py-2 rounded-full shadow-lg">
                  <Flag className="w-4 h-4 text-[#FF9933]" />
                  <span className="text-sm font-black uppercase tracking-widest">{selectedConstituency}</span>
                </div>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              {/* Grid System */}
              <div className="grid grid-cols-1 gap-10 max-w-5xl mx-auto">
                
                {/* 1. RO DETAILS */}
                {(selectedCategory === 'All' || selectedCategory === 'RO Details') && roDetails.length > 0 && (
                  <SectionCard title="RO Details" icon={UserCheck} bannerColor="bg-blue-50/30" iconColor="text-[#000080]">
                    {roDetails.map((c, i) => <ContactItem key={i} {...c} label="RO Officer" delay={i} />)}
                  </SectionCard>
                )}

                {/* 2. ARO DETAILS */}
                {(selectedCategory === 'All' || selectedCategory === 'ARO Details') && aroDetails.length > 0 && (
                  <SectionCard title="ARO Details" icon={User} bannerColor="bg-blue-50/20" iconColor="text-blue-500">
                    {aroDetails.map((c, i) => <ContactItem key={i} {...c} delay={i + 1} />)}
                  </SectionCard>
                )}

                {/* 3. FST DETAILS (3 Columns) */}
                {(selectedCategory === 'All' || selectedCategory === 'FST Details') && fstDetails.length > 0 && (
                  <SectionCard title="FST Details" icon={Zap} layoutClass="sm:grid-cols-2 lg:grid-cols-3" bannerColor="bg-orange-50/30" iconColor="text-[#FF9933]">
                    {fstDetails.map((c, i) => <ContactItem key={i} {...c} accent="saffron" delay={i} />)}
                  </SectionCard>
                )}

                {/* 4. SST DETAILS (3 Columns) */}
                {(selectedCategory === 'All' || selectedCategory === 'SST Details') && sstDetails.length > 0 && (
                  <SectionCard title="SST Details" icon={Eye} layoutClass="sm:grid-cols-2 lg:grid-cols-3" bannerColor="bg-green-50/30" iconColor="text-[#138808]">
                    {sstDetails.map((c, i) => <ContactItem key={i} {...c} accent="green" delay={i} />)}
                  </SectionCard>
                )}

                {/* 4.5 ASSEMBLY COORDINATOR (WEB CASTING) */}
                {(selectedCategory === 'All' || selectedCategory === 'Assembly Coordinator (Web Casting)') && coordinatorDetails.length > 0 && (
                  <SectionCard title="Assembly Coordinator (Web Casting)" icon={Users} bannerColor="bg-blue-50/40" iconColor="text-blue-600">
                    {coordinatorDetails.map((c, i) => <ContactItem key={i} {...c} accent="navy" delay={i} />)}
                  </SectionCard>
                )}

                {/* 4.6 SUPERVISOR (WEB CASTING) */}
                {(selectedCategory === 'All' || selectedCategory === 'Supervisor (Web Casting)') && supervisorGroups.length > 0 && (
                  <SectionCard title="Supervisor (Web Casting)" icon={User} bannerColor="bg-blue-50/30" iconColor="text-blue-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {supervisorGroups.map((g, i) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="p-6 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-xl hover:shadow-blue-100/30 transition-all duration-500"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Coverage</span>
                              <span className="text-xl font-black text-[#000080]">PS {g.psRanges}</span>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-2xl">
                              <User className="w-5 h-5 text-blue-500" />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <ContactItem name={g.name} phone={g.phone} label="Supervisor" accent="navy" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* 4.7 MOBILE MEDICAL TEAM */}
                {(selectedCategory === 'All' || selectedCategory === 'Mobile Medical Team') && mobileMedicalDetails.length > 0 && (
                  <SectionCard title="Mobile Medical Team" icon={Activity} layoutClass="sm:grid-cols-2 lg:grid-cols-3" bannerColor="bg-red-50/20" iconColor="text-red-500">
                    {mobileMedicalDetails.map((c, i) => <ContactItem key={i} {...c} label="Doctor" accent="navy" delay={i} />)}
                  </SectionCard>
                )}

                {/* 4.8 BLOCK MEDICAL OFFICERS */}
                {(selectedCategory === 'All' || selectedCategory === 'Block Medical Officers') && blockMedicalDetails.length > 0 && (
                  <SectionCard title="Block Medical Officers" icon={Activity} layoutClass="sm:grid-cols-2 lg:grid-cols-3" bannerColor="bg-green-50/20" iconColor="text-green-600">
                    {blockMedicalDetails.map((c, i) => <ContactItem key={i} {...c} label="Medical Officer" accent="green" delay={i} />)}
                  </SectionCard>
                )}

                {/* 5. ZONAL OFFICER SECTION */}
                {(selectedCategory === 'All' || selectedCategory === 'Zonal Officer Section') && zonalGroups.length > 0 && (
                  <SectionCard title="Zonal Officer Section" icon={Navigation} bannerColor="bg-orange-50/40" iconColor="text-[#FF9933]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {zonalGroups.map((g, i) => (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.1 }}
                          key={i} 
                          className="p-6 rounded-[2.5rem] bg-white border border-slate-100 flex flex-col gap-6 shadow-sm hover:shadow-xl hover:shadow-orange-100/30 transition-all duration-500"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Coverage</span>
                              <span className="text-xl font-black text-[#000080]">PS {g.psRanges}</span>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-2xl">
                              <Navigation className="w-5 h-5 text-[#FF9933]" />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <ContactItem name={g.zonalName} phone={g.zonalPhone} label="Zonal Officer" accent="saffron" />
                            <ContactItem name={g.assistantName} phone={g.assistantPhone} label="Assistant Officer" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* 6. DSP DETAILS */}
                {(selectedCategory === 'All' || selectedCategory === 'DSP Details') && dspDetails.length > 0 && (
                  <SectionCard title="DSP Details" icon={Shield} bannerColor="bg-green-50/40" iconColor="text-[#138808]">
                    {dspDetails.map((c, i) => (
                      <ContactItem key={i} {...c} extra={`Subdivision: ${c.subdivision}`} accent="green" delay={i} />
                    ))}
                  </SectionCard>
                )}

                {/* 7. ASSEMBLY INSPECTOR */}
                {(selectedCategory === 'All' || selectedCategory === 'Assembly Inspector') && assemblyInspectors.length > 0 && (
                  <SectionCard title="Assembly Inspector" icon={Building2} bannerColor="bg-green-50/20" iconColor="text-green-600">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {assemblyInspectors.map((c, i) => (
                        <div key={i} className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#138808] opacity-70 ml-1">{c.station}</label>
                          <ContactItem {...c} accent="green" delay={i} />
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {/* 8. INSPECTOR DETAILS */}
                {(selectedCategory === 'All' || selectedCategory === 'Inspector Details') && inspectors.length > 0 && (
                  <SectionCard title="Inspector Details" icon={Scale} bannerColor="bg-green-50/10" iconColor="text-slate-400">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {inspectors.map((c, i) => (
                        <div key={i} className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{c.psLabel}</label>
                          <ContactItem {...c} accent="navy" delay={i} />
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200 border border-slate-100">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Select to Search</h3>
              <p className="text-slate-400 mt-2 max-w-sm mx-auto">Please select a constituency from the dropdown to access the communication directory for the district plan.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-12 border-t border-slate-200 text-center">
        <div className="flex items-center justify-center gap-1 mb-4 h-1 w-24 mx-auto">
          <div className="flex-1 bg-[#FF9933] rounded-full"></div>
          <div className="flex-1 bg-slate-200 rounded-full"></div>
          <div className="flex-1 bg-[#138808] rounded-full"></div>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Thoothukudi District Administration
        </p>
        <p className="mt-2 text-[8px] text-slate-400">Official Communication Directory - Election 2026</p>
      </footer>
    </div>
  );
}
