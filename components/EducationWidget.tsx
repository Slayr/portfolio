'use client';

import { GraduationCap } from 'lucide-react';
import { education } from '@/lib/data';

export function EducationWidget() {
  return (
    <div id="education-widget" className="md:col-span-2 te-card p-6 bg-glass border-4 border-line text-ink flex flex-col justify-between relative shadow-[8px_8px_0px_0px_var(--line)]">
      <div className="flex items-center justify-between border-b-3 border-line pb-4 mb-6">
        <h2 className="text-xl md:text-2xl font-black uppercase font-mono flex items-center gap-3">
          <GraduationCap size={24} className="text-neo-pink" />
          ACADEMIC CREDENTIALS
        </h2>
        <span className="font-mono text-[9px] font-black uppercase bg-black text-white px-2.5 py-1 border border-line rounded shadow-[2px_2px_0px_0px_var(--neo-pink)]">
          {education.length} PROGRAMS
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 flex-1">
        {education.map((edu, i) => (
          <div key={i} className={`p-5 border-3 border-line ${edu.color} rounded shadow-[4px_4px_0px_0px_var(--line)] flex flex-col justify-between`}>
            <div>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-black text-sm uppercase leading-tight">{edu.degree}</h4>
                  <span className="font-mono text-[10px] font-bold opacity-80 block mt-0.5">{edu.specialization}</span>
                  <span className="font-mono text-[10px] font-black bg-black text-white px-2 py-0.5 rounded border border-line mt-1.5 inline-block">{edu.school}</span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="font-mono text-[9px] font-black bg-black text-white px-2 py-0.5 rounded border border-line">{edu.status}</span>
                  <span className="font-mono text-[8px] font-bold opacity-70 block mt-1">{edu.duration}</span>
                  <span className="font-mono text-[8px] font-bold opacity-60 block">{edu.location}</span>
                </div>
              </div>
              <ul className="space-y-1.5 mt-3">
                {edu.highlights.map((h, j) => (
                  <li key={j} className="text-[10px] font-bold leading-snug flex gap-1.5">
                    <span className="shrink-0 mt-0.5">▸</span>
                    <span className="opacity-90">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
