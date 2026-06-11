'use client';

import { Briefcase } from 'lucide-react';
import { experiences } from '@/lib/data';

export function ExperienceWidget() {
  return (
    <div id="experience-widget" className="md:col-span-4 te-card p-6 bg-glass border-4 border-black text-ink flex flex-col relative shadow-[8px_8px_0px_0px_#000]">
      <div className="flex items-center justify-between border-b-3 border-black pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-black uppercase font-mono flex items-center gap-3">
          <Briefcase size={24} className="text-neo-orange" />
          PROFESSIONAL TIMELINE
        </h2>
        <span className="font-mono text-[9px] font-black uppercase bg-black text-white px-2.5 py-1 border border-black rounded shadow-[2px_2px_0px_0px_var(--neo-orange)]">
          {experiences.length} POSITIONS
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {experiences.map((exp, i) => (
          <div key={i} className={`p-5 border-3 border-black ${exp.color} rounded shadow-[4px_4px_0px_0px_#000] flex flex-col justify-between`}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-black text-sm uppercase leading-tight">{exp.role}</h4>
                  <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5 rounded border border-black mt-1 inline-block">{exp.company}</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="font-mono text-[9px] font-black block">{exp.duration}</span>
                  <span className="font-mono text-[8px] font-bold opacity-70 block">{exp.location}</span>
                </div>
              </div>
              <p className="text-[11px] font-bold opacity-90 leading-snug mb-3">{exp.summary}</p>
              <ul className="space-y-1.5 mb-4">
                {exp.highlights.map((h, j) => (
                  <li key={j} className="text-[10px] font-bold leading-snug flex gap-1.5">
                    <span className="shrink-0 mt-0.5">▸</span>
                    <span className="opacity-90">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-1 pt-3 border-t-2 border-black/20">
              {exp.stack.map((tech) => (
                <span key={tech} className="te-pill py-0.5 px-1.5 text-[7px] font-black bg-black text-white border-black shadow-none">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
