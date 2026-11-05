import React, { useEffect } from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { ProjectCommission, ProjectCategory } from '../data/architectureData';
import { ResilientImage } from './ResilientImage';

interface ProjectMonographModalProps {
  project: ProjectCommission | null;
  onClose: () => void;
  onInquireCategory: (category: ProjectCategory) => void;
}

export const ProjectMonographModal: React.FC<ProjectMonographModalProps> = ({
  project,
  onClose,
  onInquireCategory,
}) => {
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1419]/60 backdrop-blur-[2px] p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="monograph-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-[#E2E5E9] shadow-xl my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E5E9]">
          <div className="flex items-center gap-2 text-xs text-[#52555A]">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{project.location}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{project.year}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project monograph"
            className="p-2 text-[#52555A] hover:text-[#0F1419] hover:bg-[#F6F7F8] transition-colors focus-visible:outline-2 focus-visible:outline-[#1D4ED8]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[82vh] overflow-y-auto">
          <ResilientImage
            src={project.image}
            alt={project.imageAlt}
            aspectClass="aspect-[16/9]"
            className="w-full border-b border-[#E2E5E9]"
          />

          <div className="p-6 sm:p-10 space-y-8">
            <div>
              <h2
                id="monograph-title"
                className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#0F1419] text-balance"
              >
                {project.title}
              </h2>
              <p className="mt-3 text-base text-[#52555A] leading-relaxed max-w-2xl">
                {project.summary}
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#E2E5E9]">
              <div>
                <div className="text-xs text-[#52555A]">Gross Floor Area</div>
                <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-[#0F1419]">
                  {project.areaSqm.toLocaleString()} m²
                </div>
              </div>
              <div>
                <div className="text-xs text-[#52555A]">Daylight Factor</div>
                <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-[#0F1419]">
                  {project.daylightFactor}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#52555A]">Embodied Carbon</div>
                <div className="mt-1 text-lg font-semibold font-mono tabular-nums text-[#0F1419]">
                  {project.embodiedCarbonDelta}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#52555A]">Site Coordinates</div>
                <div className="mt-1 text-sm font-medium font-mono tabular-nums text-[#0F1419]">
                  {project.coordinates}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-[#0F1419]">
                  01. Architectural Brief
                </h3>
                <p className="mt-2.5 text-sm text-[#52555A] leading-relaxed">
                  {project.architecturalBrief}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#0F1419]">
                  02. Structural & Environmental System
                </h3>
                <p className="mt-2.5 text-sm text-[#52555A] leading-relaxed">
                  {project.structuralNotes}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E5E9] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="text-xs text-[#52555A] mb-1.5">
                  Primary Material Palette
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#0F1419] font-medium">
                  {project.materials.map((mat, index) => (
                    <React.Fragment key={mat}>
                      <span>{mat}</span>
                      {index < project.materials.length - 1 && (
                        <span className="text-[#9CA3AF]" aria-hidden="true">
                          ·
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onInquireCategory(project.category);
                  onClose();
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#1D4ED8] hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
              >
                <span>Inquire About {project.category} Work</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
