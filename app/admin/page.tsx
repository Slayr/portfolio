'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Lock, LogOut, Plus, Send, ArrowRight, Camera, 
  Eye, Edit2, Trash2, ImagePlus, ShieldAlert, Cpu, Database, PlusCircle 
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { extractDataImages } from '@/lib/markdown';
import { savePost, savePhotos, fetchAllSkills, saveSkill, deleteSkill } from '@/lib/storage';
import { Skill } from '@/lib/data';
import { getFirebaseAuth, isFirebaseConfigured } from '@/lib/firebase';

const SECURE_PASS_HASHES = [
  'b75b9de0c93a0a38f32a76f26487e416d8a39a2f7c00e6a1005a305e55ff16bd', // slayr2026
  '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'  // admin
];

export default function Admin() {
  const router = useRouter();
  
  // Security in-memory states (no persistent localstorage or cookies saved)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0);

  // Tab state
  const [activeTab, setActiveTab] = useState<'blog' | 'photo' | 'skills'>('blog');

  // Skills state
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillLabel, setNewSkillLabel] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Languages');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inlineImageRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Inline images state
  const [inlineImages, setInlineImages] = useState<{id: number, name: string, url: string}[]>([]);
  const inlineImageCounter = useRef(0);

  // Photo uploading state
  const [pendingPhotos, setPendingPhotos] = useState<{id: string, url: string, title: string, description: string}[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Console output log
  const [sysLogs, setSysLogs] = useState<string[]>([
    'SYSTEM v2.08 INITIALIZED.',
    'WAITING FOR AUTHENTICATION PORT ACCESS...'
  ]);

  // Lockout timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const addLog = (msg: string) => {
    setSysLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const hashPassword = async (rawPassword: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(rawPassword);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTime > 0) return;

    setLoginError('');
    addLog(`ATTEMPTING AUTHENTICATION FOR: "${username}"`);

    try {
      // 1. If username is an email and Firebase is configured, attempt Firebase Auth sign-in
      if (username.includes('@') && isFirebaseConfigured()) {
        const authInstance = getFirebaseAuth();
        if (authInstance) {
          addLog('CONNECTING TO FIREBASE AUTH SERVICES...');
          const { signInWithEmailAndPassword } = await import('firebase/auth');
          await signInWithEmailAndPassword(authInstance, username, password);
          setIsAuthenticated(true);
          setPassword('');
          addLog('FIREBASE SYSTEM AUTHENTICATION SECURED. ACCESS GRANTED.');
          return;
        }
      }

      // 2. Otherwise fall back to local passcode hashing check
      const hashedInput = await hashPassword(password);
      
      if (username === 'admin' && SECURE_PASS_HASHES.includes(hashedInput)) {
        if (isFirebaseConfigured()) {
          const authInstance = getFirebaseAuth();
          if (authInstance) {
            try {
              const { signInAnonymously } = await import('firebase/auth');
              await signInAnonymously(authInstance);
              addLog('ANONYMOUS STORAGE SECURITY CLEARANCE GRANTED.');
            } catch (err: any) {
              addLog('ANONYMOUS AUTH REJECTED. WRITE PERMISSIONS MAY BE RESTRICTED.');
            }
          }
        }
        setIsAuthenticated(true);
        setPassword('');
        addLog('LOCAL SYSTEM SECURITY CLEARANCE GRANTED. ACCESS GRANTED.');
      } else {
        const nextAttempts = loginAttempts + 1;
        setLoginAttempts(nextAttempts);
        addLog(`ACCESS DENIED. ATTEMPTS: ${nextAttempts}/3`);
        
        if (nextAttempts >= 3) {
          setLockoutTime(30); // 30 seconds lockout
          setLoginAttempts(0);
          setLoginError('Too many failed attempts. Console locked for 30s.');
          addLog('SECURITY LOCKDOWN TRIGGERED. TEMPORARY DEACTIVATION.');
        } else {
          setLoginError('Invalid credentials.');
        }
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || 'Verification process failed.');
      addLog(`AUTHENTICATION ERROR: ${err.message || 'UNKNOWN'}`);
    }
  };

  const handleLogout = async () => {
    if (isFirebaseConfigured()) {
      const authInstance = getFirebaseAuth();
      if (authInstance) {
        try {
          const { signOut } = await import('firebase/auth');
          await signOut(authInstance);
          addLog('FIREBASE AUTHENTICATION CLOSED.');
        } catch (err) {
          console.error('Signout error', err);
        }
      }
    }
    setIsAuthenticated(false);
    setUsername('');
    setSysLogs([
      'SESSION VOLUNTARILY TERMINATED.',
      'WAITING FOR AUTHENTICATION PORT ACCESS...'
    ]);
  };

  useEffect(() => {
    if (isAuthenticated) {
      Promise.resolve().then(() => {
        setSkills(fetchAllSkills());
        addLog('SKILLS DATABASE SYNCHRONIZED.');
      });
    }
  }, [isAuthenticated]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillLabel.trim()) return;
    try {
      const added = saveSkill({
        label: newSkillLabel.trim(),
        category: newSkillCategory
      });
      setSkills(prev => [...prev, added]);
      setNewSkillLabel('');
      addLog(`ADDED SKILL: "${added.label}" [${added.category}]`);
      setPublishMessage(`Skill "${added.label}" added successfully!`);
    } catch (err: any) {
      setPublishMessage(`Error: ${err.message || 'Failed to add skill'}`);
      addLog(`ERROR ADDING SKILL: ${err.message}`);
    }
  };

  const handleDeleteSkill = (label: string) => {
    try {
      deleteSkill(label);
      setSkills(prev => prev.filter(s => s.label.toLowerCase() !== label.toLowerCase()));
      addLog(`DELETED SKILL: "${label}"`);
      setPublishMessage(`Skill "${label}" deleted successfully!`);
    } catch (err: any) {
      setPublishMessage(`Error: ${err.message || 'Failed to delete skill'}`);
    }
  };

  const compressImage = (file: File, maxSize: number, quality: number): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let w = img.width, h = img.height;
          if (w > h) {
            if (w > maxSize) { h *= maxSize / w; w = maxSize; }
          } else {
            if (h > maxSize) { w *= maxSize / h; h = maxSize; }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          let dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
          }
          resolve(dataUrl);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isPhotoTab: boolean = false) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (isPhotoTab) {
      files.forEach(async (file) => {
        addLog(`COMPRESSING PHOTO: ${file.name}`);
        const dataUrl = await compressImage(file, 1600, 0.82);
        setPendingPhotos(prev => [...prev, {
          id: Math.random().toString(36).substring(7),
          url: dataUrl,
          title: file.name.replace(/\.[^/.]+$/, ""),
          description: ''
        }]);
        addLog(`PHOTO STAGED SUCCESSFULLY.`);
      });
    } else {
      const file = files[0];
      addLog(`COMPRESSING COVER IMAGE: ${file.name}`);
      compressImage(file, 800, 0.80).then(dataUrl => {
        setImageUrl(dataUrl);
        addLog(`COVER IMAGE READY.`);
      });
    }
    
    if (e.target) e.target.value = '';
  };

  const handleInlineImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = file.name.replace(/\.[^/.]+$/, '');
    addLog(`PROCESSING INLINE IMAGE: ${file.name}`);
    compressImage(file, 1200, 0.80).then(dataUrl => {
      const id = ++inlineImageCounter.current;
      setInlineImages(prev => [...prev, { id, name, url: dataUrl }]);
      const tag = `\n![${name}](inline:${id})\n`;
      const ta = textareaRef.current;
      if (ta) {
        const start = ta.selectionStart;
        const before = content.slice(0, start);
        const after = content.slice(ta.selectionEnd);
        setContent(before + tag + after);
      } else {
        setContent(content + tag);
      }
      addLog(`INLINE IMAGE INSTANTIATED.`);
    });
    if (e.target) e.target.value = '';
  };

  const resolveInlineImages = (text: string) => {
    return text.replace(/\(inline:(\d+)\)/g, (match, idStr) => {
      const img = inlineImages.find(i => i.id === parseInt(idStr));
      return img ? `(${img.url})` : match;
    });
  };

  const renderPreviewContent = (text: string) => {
    let resolved = text.replace(/\(inline:(\d+)\)/g, (match, idStr) => {
      const img = inlineImages.find(i => i.id === parseInt(idStr));
      return img ? `(${img.url})` : match;
    });
    const { processed, images } = extractDataImages(resolved);
    const imgRenderer = ({ src, alt }: any) => {
      const resolvedSrc = (src && images[src]) || src;
      if (!resolvedSrc) return null;
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={resolvedSrc} alt={alt || ''} className="rounded-xl max-w-full border-2 border-black" />;
    };
    return <ReactMarkdown components={{ img: imgRenderer }}>{processed}</ReactMarkdown>;
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;
    
    setIsPublishing(true);
    setPublishMessage('');
    addLog('COMMENCING DATA SYNCHRONIZATION...');
    
    try {
      if (activeTab === 'blog') {
        if (!title || !content) throw new Error('Title and content required');
        const finalContent = resolveInlineImages(content);
        
        await savePost({
          title,
          content: finalContent,
          imageUrl: imageUrl || undefined,
        });
        
        setPublishMessage('Log entry broadcasted to Journal feed!');
        addLog('LOG ENTRY DEPLOYED SUCCESSFULLY.');
        setTitle('');
        setContent('');
        setImageUrl('');
        setInlineImages([]);
        setTimeout(() => router.push('/'), 1500);
      } else {
        if (pendingPhotos.length === 0) throw new Error('No photos to upload');
        if (pendingPhotos.some(p => !p.title)) throw new Error('All photos must have a title');
        
        await savePhotos(pendingPhotos.map(p => ({
          title: p.title,
          description: p.description,
          url: p.url,
        })));
        
        setPublishMessage(`Successfully committed ${pendingPhotos.length} capture(s)!`);
        addLog(`${pendingPhotos.length} CAPTURES STORED IN SYSTEM FILE.`);
        setPendingPhotos([]);
        setTimeout(() => router.push('/'), 1500);
      }
    } catch (error: any) {
      console.error('Publish error', error);
      const errText = error.message || 'Unknown network error';
      setPublishMessage('Error: ' + errText);
      addLog(`FATAL WRITING ERROR: ${errText.toUpperCase()}`);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto space-y-8 pt-12">
        {/* Warning hazard bar */}
        <div className="bg-neo-yellow text-black border-4 border-black p-4 text-center select-none shadow-[4px_4px_0px_0px_#000] rotate-[-1deg]">
          <h2 className="text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2">
            <ShieldAlert size={18} className="animate-bounce" />
            CLASSIFIED DISPATCH // ROOT ACCESS
          </h2>
        </div>

        <div className="te-card p-6 bg-black border-4 border-black text-neo-green font-mono shadow-[8px_8px_0px_0px_#000]">
          <div className="flex justify-between items-center pb-3 border-b-2 border-neutral-800 mb-6 text-[10px]">
            <span className="flex items-center gap-2">
              <Cpu size={12} className="animate-pulse" />
              PORT: 9283-SECURE
            </span>
            <span className="text-red-500 font-bold">STATE: SECURE_LOCKED</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="p-3 border-2 border-red-500 bg-red-950/20 text-red-500 text-xs font-bold font-mono">
                [ERR_SEC] {loginError}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-400 block uppercase font-bold">Operator ID / Email</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-neo-green p-3 font-mono text-xs font-bold text-neo-green focus:outline-none rounded"
                placeholder="e.g. admin or operator@domain.com"
                disabled={lockoutTime > 0}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-400 block uppercase font-bold">Security Key</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border-2 border-neutral-800 focus:border-neo-green p-3 font-mono text-xs font-bold text-neo-green focus:outline-none rounded"
                placeholder="••••••••••••"
                disabled={lockoutTime > 0}
                required
              />
            </div>

            <button 
              type="submit" 
              className="te-button py-3 w-full bg-neo-green border-black text-black font-black uppercase text-xs hover:bg-neo-yellow hover:text-black flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={lockoutTime > 0}
            >
              Authenticate {lockoutTime > 0 ? `(${lockoutTime}s)` : ''} <ArrowRight size={14} />
            </button>
          </form>
        </div>

        {/* Console audit log */}
        <div className="bg-neutral-900 border-2 border-neutral-800 p-4 font-mono text-[9px] text-neutral-500 max-h-36 overflow-y-auto">
          <p className="border-b border-neutral-800 pb-1 mb-2 text-neutral-400 font-bold uppercase">Console Audit Trail:</p>
          {sysLogs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Redesigned Brutalist Header */}
      <div className="te-card p-6 bg-neo-cyan text-black border-4 border-black relative shadow-[8px_8px_0px_0px_#000] rotate-[0.5deg]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <Database size={28} className="animate-spin-slow" />
              SYSTEM_CONTROL_CENTER // OPERATOR_PORT_01
            </h1>
            <p className="font-mono text-[10px] font-black uppercase bg-black text-neo-cyan px-2 py-0.5 mt-2 rounded border border-black inline-block">
              SECURE_AES_256 // LOCAL_MODE_ACTIVE
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="te-button py-2.5 px-4 text-xs bg-black text-white border-black hover:bg-neo-pink hover:text-white transition-colors cursor-pointer flex items-center gap-2"
          >
            <LogOut size={14} />
            TERMINATE SESSION
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: System Control Console */}
        <div className="lg:col-span-1 space-y-6">
          <div className="te-card p-5 bg-black border-4 border-black text-neo-green font-mono shadow-[6px_6px_0px_0px_#000]">
            <h3 className="text-[10px] font-black border-b border-neutral-800 pb-2 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Diagnostic Feed</span>
              <span className="text-neo-cyan animate-pulse">LIVE</span>
            </h3>
            <div className="space-y-1.5 text-[9px] font-bold">
              <div className="flex justify-between"><span className="text-neutral-500">AUTH STATE:</span> <span className="text-neo-green">AUTHORIZED</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">ENCRYPTION:</span> <span className="text-neo-cyan">NATIVE_SHA_256</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">STORAGE:</span> <span className="text-neo-yellow">LOCAL_INDEXDB_SIM</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">STAGED PHOTOS:</span> <span>{pendingPhotos.length}</span></div>
              <div className="flex justify-between"><span className="text-neutral-500">ACTIVE SKILLS:</span> <span>{skills.length}</span></div>
            </div>
          </div>

          <div className="te-card p-5 bg-neutral-900 border-4 border-black text-neutral-400 font-mono shadow-[6px_6px_0px_0px_#000] max-h-96 overflow-y-auto">
            <h3 className="text-[10px] font-black border-b border-neutral-800 pb-2 mb-3 uppercase text-white tracking-wider">
              System Action Logger
            </h3>
            <div className="space-y-1 text-[8px]">
              {sysLogs.map((log, i) => (
                <div key={i} className="leading-normal">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Main Editing Canvas */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-3 border-b-4 border-black pb-3 overflow-x-auto">
            <button 
              onClick={() => { setActiveTab('blog'); setPublishMessage(''); }}
              className={`te-button py-2 px-5 text-xs font-black uppercase transition-all duration-100 ${
                activeTab === 'blog' 
                  ? 'bg-neo-pink text-white border-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5' 
                  : 'bg-glass border-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              Create Transmission log
            </button>
            <button 
              onClick={() => { setActiveTab('photo'); setPublishMessage(''); }}
              className={`te-button py-2 px-5 text-xs font-black uppercase transition-all duration-100 ${
                activeTab === 'photo' 
                  ? 'bg-neo-pink text-white border-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5' 
                  : 'bg-glass border-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              Upload Photographic Capture
            </button>
            <button 
              onClick={() => { setActiveTab('skills'); setPublishMessage(''); }}
              className={`te-button py-2 px-5 text-xs font-black uppercase transition-all duration-100 ${
                activeTab === 'skills' 
                  ? 'bg-neo-pink text-white border-black shadow-[3px_3px_0px_0px_#000] -translate-y-0.5' 
                  : 'bg-glass border-black hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_#000]'
              }`}
            >
              Manage Skills
            </button>
          </div>

          {activeTab === 'skills' ? (
            <div className="te-card p-6 bg-glass border-4 border-black text-ink shadow-[8px_8px_0px_0px_#000] space-y-6">
              {publishMessage && (
                <div className={`p-4 border-3 border-black font-mono text-xs font-black rounded ${
                  publishMessage.includes('Error') 
                    ? 'bg-red-500 text-white shadow-[2px_2px_0px_0px_#000]' 
                    : 'bg-neo-yellow text-black shadow-[2px_2px_0px_0px_#000]'
                }`}>
                  {publishMessage}
                </div>
              )}
              
              {/* Add Skill form */}
              <form onSubmit={handleAddSkill} className="space-y-4 border-b-2 border-dashed border-black/25 pb-6">
                <h3 className="text-xs font-black uppercase text-neutral-400">Add New Skill Tag</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Skill Label</label>
                    <input 
                      type="text" 
                      value={newSkillLabel}
                      onChange={(e) => setNewSkillLabel(e.target.value)}
                      className="w-full bg-bg border-2 border-black p-2 font-mono text-xs font-bold focus:outline-none rounded"
                      placeholder="e.g. PyTorch"
                      required
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase block mb-1">Category</label>
                    <select 
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="w-full bg-bg border-2 border-black p-2 font-mono text-xs font-bold focus:outline-none rounded cursor-pointer"
                    >
                      <option value="Languages">Languages</option>
                      <option value="Frameworks">Frameworks</option>
                      <option value="AI & ML">AI & ML</option>
                      <option value="Tools">Tools</option>
                    </select>
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <button 
                      type="submit" 
                      className="w-full py-2 bg-neo-green border-2 border-black text-black font-black uppercase text-xs hover:bg-neo-yellow hover:text-black flex items-center justify-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                    >
                      <PlusCircle size={14} /> ADD SKILL
                    </button>
                  </div>
                </div>
              </form>

              {/* Skills List by Category */}
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2">
                {['Languages', 'Frameworks', 'AI & ML', 'Tools'].map((cat) => {
                  const catSkills = skills.filter(s => s.category === cat);
                  return (
                    <div key={cat} className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">{cat}</h4>
                      <div className="flex flex-wrap gap-2">
                        {catSkills.map(skill => (
                          <div 
                            key={skill.label} 
                            className="te-pill py-1.5 px-3 bg-glass text-ink border-black text-[10px] flex items-center gap-2"
                          >
                            <span>{skill.label}</span>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteSkill(skill.label)}
                              className="text-red-500 hover:text-black font-bold text-xs pl-1"
                              title="Delete skill"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {catSkills.length === 0 && (
                          <span className="text-[10px] italic text-neutral-500 pl-1">No skills in this category.</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <motion.form 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handlePublish} 
              className="te-card p-6 bg-glass border-4 border-black text-ink shadow-[8px_8px_0px_0px_#000] space-y-6"
            >
              {publishMessage && (
                <div className={`p-4 border-3 border-black font-mono text-xs font-black rounded ${
                  publishMessage.includes('Error') 
                    ? 'bg-red-500 text-white shadow-[2px_2px_0px_0px_#000]' 
                    : 'bg-neo-yellow text-black shadow-[2px_2px_0px_0px_#000]'
                }`}>
                  {publishMessage}
                </div>
              )}

              {activeTab === 'blog' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-neutral-400">Dispatch Title</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-bg border-3 border-black p-3.5 font-sans font-black text-base focus:outline-none focus:bg-neo-yellow/10 transition-colors rounded-lg shadow-[2px_2px_0px_0px_#000]"
                      placeholder="Enter dispatch title..."
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-neutral-400">Cover Image Asset</label>
                    <div className="flex gap-3">
                      <input 
                        type="url" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 bg-bg border-3 border-black p-3 font-mono text-xs focus:outline-none rounded-lg shadow-[2px_2px_0px_0px_#000]"
                        placeholder="https://... or select file to upload"
                      />
                      <input 
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => handleImageUpload(e, false)}
                        className="hidden"
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="te-button py-2.5 px-4 bg-neo-yellow border-black text-black font-black text-xs hover:bg-black hover:text-white flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                      >
                        <Camera size={14} />
                        CHOOSE
                      </button>
                    </div>
                    {imageUrl && imageUrl.startsWith('data:image') && (
                      <div className="text-[9px] font-mono text-neo-pink font-bold pl-1 uppercase">
                        ✓ Asset compressed and loaded successfully.
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-neutral-400 flex items-center gap-2">
                        <span>Log Body (Markdown)</span>
                      </label>
                      <div className="flex bg-black/5 dark:bg-white/5 rounded p-0.5 border border-black/25">
                        <button
                          type="button"
                          onClick={() => setIsPreview(false)}
                          className={`px-3 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors ${!isPreview ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:text-black'}`}
                        >
                          <Edit2 size={10} /> EDIT
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPreview(true)}
                          className={`px-3 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors ${isPreview ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:text-black'}`}
                        >
                          <Eye size={10} /> PREVIEW
                        </button>
                      </div>
                    </div>

                    {!isPreview && (
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          ref={inlineImageRef}
                          onChange={handleInlineImage}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => inlineImageRef.current?.click()}
                          className="te-button py-1.5 px-3 bg-white border-2 border-black text-black font-black text-[10px] hover:bg-neo-cyan flex items-center gap-1.5 cursor-pointer"
                        >
                          <ImagePlus size={12} />
                          Insert inline photo
                        </button>
                      </div>
                    )}
                    
                    {/* Inline image thumbnails */}
                    {!isPreview && inlineImages.length > 0 && (
                      <div className="flex flex-wrap gap-2.5 p-3 border-2 border-black rounded bg-black/5 dark:bg-white/5">
                        {inlineImages.map(img => (
                          <div key={img.id} className="relative group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url} alt={img.name} className="w-16 h-16 object-cover rounded border-2 border-black" />
                            <button
                              type="button"
                              onClick={() => {
                                setInlineImages(prev => prev.filter(i => i.id !== img.id));
                                addLog(`DISCARDED INLINE IMAGE: ${img.name}`);
                              }}
                              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 border border-black text-white rounded-full text-[10px] flex items-center justify-center font-bold"
                            >
                              ×
                            </button>
                            <p className="text-[8px] font-mono text-neutral-500 truncate w-16 mt-0.5 text-center">inline:{img.id}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {isPreview ? (
                      <div className="w-full min-h-[300px] bg-bg border-3 border-black p-4 font-sans prose prose-neutral max-w-none prose-headings:font-sans prose-headings:font-black prose-headings:uppercase prose-a:text-neo-pink dark:prose-invert rounded-lg shadow-[2px_2px_0px_0px_#000]">
                        {content ? renderPreviewContent(content) : <span className="text-neutral-500 italic text-xs">Awaiting input...</span>}
                      </div>
                    ) : (
                      <textarea 
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        className="w-full bg-bg border-3 border-black p-4 font-mono text-xs font-bold focus:outline-none focus:bg-neo-yellow/10 transition-colors resize-y rounded-lg shadow-[2px_2px_0px_0px_#000]"
                        placeholder="Write your markdown document..."
                        required
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-neutral-400">Photographic Assets</label>
                      <div className="flex gap-4">
                        <input 
                          type="file"
                          accept="image/*"
                          multiple
                          ref={photoInputRef}
                          onChange={(e) => handleImageUpload(e, true)}
                          className="hidden"
                        />
                        <button 
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="te-button py-2 px-4 bg-neo-yellow border-black text-black font-black text-xs hover:bg-black hover:text-white flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                        >
                          <Camera size={14} />
                          SELECT FILE(S)
                        </button>
                      </div>
                    </div>

                    {pendingPhotos.length === 0 ? (
                      <div className="py-12 text-center text-xs font-mono border-3 border-dashed border-black/40 rounded-lg">
                        No captures selected. Staging system ready.
                      </div>
                    ) : (
                      <div className="space-y-4 mt-6">
                        {pendingPhotos.map((photo, index) => (
                          <div key={photo.id} className="flex flex-col sm:flex-row gap-4 p-4 border-3 border-black rounded bg-bg shadow-[3px_3px_0px_0px_#000]">
                            <div className="w-full sm:w-28 h-28 shrink-0 rounded border-2 border-black overflow-hidden bg-neutral-900 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={photo.url} alt="preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <input 
                                type="text" 
                                value={photo.title}
                                onChange={(e) => {
                                  const newPhotos = [...pendingPhotos];
                                  newPhotos[index].title = e.target.value;
                                  setPendingPhotos(newPhotos);
                                }}
                                className="w-full bg-bg border-2 border-black p-2 font-black text-xs focus:outline-none rounded"
                                placeholder="Photo Title"
                                required
                              />
                              <textarea 
                                value={photo.description}
                                onChange={(e) => {
                                  const newPhotos = [...pendingPhotos];
                                  newPhotos[index].description = e.target.value;
                                  setPendingPhotos(newPhotos);
                                }}
                                rows={2}
                                className="w-full bg-bg border-2 border-black p-2 font-mono text-[10px] focus:outline-none resize-y rounded"
                                placeholder="Description / Captured Context (Optional)"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                setPendingPhotos(prev => prev.filter(p => p.id !== photo.id));
                                addLog(`STAGING DISCARDED FOR: ${photo.title}`);
                              }}
                              className="p-2 h-fit border-2 border-black bg-red-500 hover:bg-black text-white rounded cursor-pointer self-end sm:self-start shadow-[1px_1px_0px_0px_#000]"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="pt-4 border-t-2 border-dashed border-black/20 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isPublishing}
                  className="te-button py-3 px-6 bg-neo-green border-black text-black font-black uppercase text-xs hover:bg-neo-yellow hover:text-black flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-[3px_3px_0px_0px_#000]"
                >
                  <Send size={14} />
                  {isPublishing ? 'SYNCHRONIZING...' : (activeTab === 'blog' ? 'COMMIT DISPATCH' : 'COMMIT CAPTURES')}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
