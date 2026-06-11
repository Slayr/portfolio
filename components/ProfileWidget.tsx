'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Download, Github } from 'lucide-react';
import profileImage from '../public/profile.png';

export function ProfileWidget() {
  const router = useRouter();
  const [photoClicks, setPhotoClicks] = useState(0);

  const handlePhotoClick = () => {
    setPhotoClicks((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        // Redirect to admin
        router.push('/admin');
        return 0;
      }
      return next;
    });
  };

  return (
    <div id="profile-widget" className="md:col-span-4 te-card p-8 md:p-10 bg-neo-yellow text-black flex flex-col justify-between relative overflow-hidden group shadow-[8px_8px_0px_0px_var(--line)] border-4 border-line min-h-[420px] lg:min-h-[380px]">
      {/* Online indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <span className="w-3 h-3 rounded-full bg-neo-green border-2 border-line animate-pulse"></span>
        <span className="font-mono text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 border border-line rounded shadow-[1px_1px_0px_0px_#fff]">
          ONLINE
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full my-auto">
        {/* Left Column: Big Name (Col span 3) */}
        <div className="lg:col-span-3 space-y-2 text-center lg:text-left">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none uppercase select-none tracking-tighter">
            <span className="bg-black text-white px-3 py-1.5 inline-block -skew-y-2 transform mb-2 select-none shadow-[6px_6px_0px_0px_var(--neo-pink)]">
              RISHI
            </span>
            <br />
            POPAT
          </h1>
        </div>

        {/* Middle Section: Photo & Bio side-by-side (Col span 6) */}
        <div className="lg:col-span-6 flex flex-col sm:flex-row gap-6 items-center">
          <div 
            onClick={handlePhotoClick}
            className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 shrink-0 cursor-pointer active:scale-95 transition-all select-none"
            title={photoClicks > 0 ? `SYS_ACCESS_${photoClicks}/5` : "Click 5 times to enter auth mode"}
          >
            <Image
              src={profileImage}
              alt="Profile Photo"
              fill
              className="object-contain pointer-events-none"
              priority
            />
          </div>

          <div className="space-y-4 text-center sm:text-left flex-1">
            <p className="font-sans text-sm md:text-base font-black leading-snug tracking-tight">
              Hello, I&apos;m Rishi Mihir Popat. I specialize in Data Science and AI. Welcome to my personal digital playground.
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <span className="te-pill bg-black text-white border-black text-[10px] py-0.5 px-2 font-black shadow-none">DATA SCIENCE</span>
              <span className="te-pill bg-white text-black border-black text-[10px] py-0.5 px-2 font-black shadow-none">AI & ML</span>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostics & Action Links (Col span 3) */}
        <div className="lg:col-span-3 flex flex-col justify-between space-y-6 self-stretch">
          {/* Metrics Panel */}
          <div className="border-2 border-line bg-white/45 p-4 rounded-lg font-mono text-[10px] space-y-2 select-none shadow-[4px_4px_0px_0px_var(--line)] flex-1 flex flex-col justify-center">
            <div className="font-black border-b border-line pb-1.5 flex justify-between uppercase">
              <span>SYS_METRICS</span>
              <span className="text-neo-pink animate-pulse">● RUNNING</span>
            </div>
            <div className="space-y-1.5 font-bold text-black/80">
              <div className="flex justify-between">
                <span>HOST:</span>
                <span className="font-black">SLAYR_GRID</span>
              </div>
              <div className="flex justify-between">
                <span>LOCATION:</span>
                <span className="font-black">GURGAON, IN</span>
              </div>
              <div className="flex justify-between">
                <span>DB_STATUS:</span>
                <span className="text-neo-green font-black">LOCAL_CONNECTED</span>
              </div>
              <div className="flex justify-between">
                <span>PROJECTS:</span>
                <span className="font-black">3 ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Action Links stacked on the right */}
          <div className="flex flex-col gap-3 font-mono">
            <a 
              href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/resume.pdf`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="te-button w-full py-3 px-4 text-xs bg-black text-white border-2 border-line hover:bg-neo-pink hover:text-white transition-all text-center flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_var(--line)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-black cursor-pointer"
            >
              <Download size={14} /> DOWNLOAD RESUME
            </a>
            <div className="flex gap-2">
              <a 
                href="#contact-widget" 
                className="te-button flex-1 py-2.5 px-4 text-[9px] sm:text-[10px] bg-white text-black border-2 border-line hover:bg-neo-cyan hover:text-black transition-all text-center shadow-[3px_3px_0px_0px_var(--line)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-black cursor-pointer uppercase"
              >
                SEND ME A MESSAGE
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 border-2 border-line bg-white rounded shadow-[3px_3px_0px_0px_var(--line)] hover:bg-neo-green transition-colors flex items-center justify-center cursor-pointer"
              >
                <Github size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Industrial QC stamp */}
      <div className="industrial-stamp absolute bottom-3 left-4 select-none opacity-45 hover:opacity-100 transition-opacity text-[8px] font-mono">
        QC PASSED // OPERATOR_01
      </div>
    </div>
  );
}
