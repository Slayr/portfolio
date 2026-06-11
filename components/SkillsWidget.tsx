'use client';

import { Network } from 'lucide-react';
import { Skill } from '@/lib/data';

interface SkillsWidgetProps {
  skills: Skill[];
  skillQuery: string;
  setSkillQuery: (query: string) => void;
}

export function SkillsWidget({ skills, skillQuery, setSkillQuery }: SkillsWidgetProps) {
  // Compute dynamic styling parameters based on total skill volume
  const totalSkills = skills.length;
  
  const gapClass = totalSkills <= 12 
    ? 'gap-x-6 gap-y-5' 
    : totalSkills <= 28 
      ? 'gap-x-4 gap-y-3.5' 
      : 'gap-x-3 gap-y-2.5';
      
  const pillPaddingClass = totalSkills <= 12 
    ? 'py-2.5 px-4.5 text-xs border-3' 
    : totalSkills <= 28 
      ? 'py-1.5 px-3 text-[10px] border-2' 
      : 'py-1 px-2 text-[9px] border';

  const contentAlignClass = totalSkills <= 12
    ? 'content-evenly justify-center'
    : totalSkills <= 28
      ? 'content-around justify-center'
      : 'content-evenly justify-center';

  return (
    <div id="skills-widget" className="md:col-span-2 te-card bg-glass text-ink flex flex-col relative overflow-hidden">
      <div className="p-4 border-b-3 border-line bg-neo-pink text-white flex items-center justify-between shrink-0">
        <h3 className="font-mono font-black text-xs uppercase tracking-wider flex items-center gap-2">
          <Network size={16} /> Skills Arena
        </h3>
        <div className="relative flex items-center">
          <input 
            type="text"
            value={skillQuery}
            onChange={(e) => setSkillQuery(e.target.value)}
            placeholder="HIGHLIGHT SKILL..."
            className="bg-white text-black border-2 border-line text-[9px] font-mono font-black px-2 py-1 placeholder-black/60 focus:outline-none rounded"
          />
        </div>
      </div>

      <div className={`p-6 bg-white dark:bg-black/30 flex flex-wrap items-center flex-1 overflow-y-auto ${gapClass} ${contentAlignClass}`}>
        {skills.map((skill) => {
          const matched = skillQuery && skill.label.toLowerCase().includes(skillQuery.toLowerCase());
          return (
            <div
              key={skill.label}
              className={`te-pill font-black uppercase transition-all duration-100 border-line ${pillPaddingClass} ${
                matched 
                  ? 'bg-neo-yellow text-black scale-110 shadow-[2px_2px_0px_0px_var(--line)]'
                  : 'bg-glass text-ink hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_var(--line)] active:translate-y-0 active:shadow-none'
              }`}
            >
              {skill.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
