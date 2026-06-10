import React, { useState } from "react";
import { ImagePlus, Check, Type, Library } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";
import ImageLibraryPicker from "@/components/ImageLibraryPicker";

/**
 * Floating CMS edit controls.
 * Two always-accessible floating buttons (images / texts) replacing the old
 * header toggles, plus an image-library shortcut shown while image edit is on.
 */
export const EditModeFAB = () => {
  const { imageEditMode, textEditMode, toggleImage, toggleText } = useEditMode();
  const [libraryOpen, setLibraryOpen] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-6 left-6 z-[60] flex flex-col items-start gap-2.5 print:hidden"
        data-testid="edit-mode-fab"
      >
        {/* Library shortcut — only while image edit mode is on */}
        {imageEditMode && (
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            aria-label="Abrir biblioteca de imágenes"
            data-testid="header-library-toggle"
            title="Biblioteca de imágenes"
            className="group inline-flex items-center gap-2 h-11 pl-3.5 pr-4 rounded-full bg-[#2C2621] text-[#FDFBF7] shadow-lg shadow-black/20 border border-[#2C2621] hover:bg-[#1A1513] transition-colors duration-300"
          >
            <Library className="w-4 h-4" strokeWidth={1.7} />
            <span className="text-[10px] tracking-[0.22em] uppercase">Biblioteca</span>
          </button>
        )}

        {/* Image edit mode toggle */}
        <button
          type="button"
          onClick={toggleImage}
          aria-pressed={imageEditMode}
          aria-label={imageEditMode ? "Salir del modo edición de imágenes" : "Activar modo edición de imágenes"}
          data-testid="header-edit-mode-toggle"
          title={imageEditMode ? "Edición de imágenes ON · clic para salir" : "Activar edición de imágenes"}
          className={`inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full shadow-lg shadow-black/25 border transition-colors duration-300 ${
            imageEditMode
              ? "bg-[#C16542] border-[#C16542] text-[#FDFBF7] hover:bg-[#A35133]"
              : "bg-[#FDFBF7] border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621]"
          }`}
        >
          {imageEditMode ? <Check className="w-4 h-4" strokeWidth={1.9} /> : <ImagePlus className="w-4 h-4" strokeWidth={1.7} />}
          <span className="text-[10px] tracking-[0.22em] uppercase">Imágenes</span>
        </button>

        {/* Text edit mode toggle */}
        <button
          type="button"
          onClick={toggleText}
          aria-pressed={textEditMode}
          aria-label={textEditMode ? "Salir del modo edición de textos" : "Activar modo edición de textos"}
          data-testid="header-text-edit-toggle"
          title={textEditMode ? "Edición de textos ON · clic para salir" : "Activar edición de textos"}
          className={`inline-flex items-center gap-2 h-12 pl-4 pr-5 rounded-full shadow-lg shadow-black/25 border transition-colors duration-300 ${
            textEditMode
              ? "bg-[#2C2621] border-[#2C2621] text-[#FDFBF7] hover:bg-[#1A1513]"
              : "bg-[#FDFBF7] border-[#2C2621]/20 text-[#2C2621] hover:bg-[#2C2621] hover:text-[#FDFBF7] hover:border-[#2C2621]"
          }`}
        >
          {textEditMode ? <Check className="w-4 h-4" strokeWidth={1.9} /> : <Type className="w-4 h-4" strokeWidth={1.7} />}
          <span className="text-[10px] tracking-[0.22em] uppercase">Textos</span>
        </button>
      </div>

      <ImageLibraryPicker
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={() => setLibraryOpen(false)}
      />
    </>
  );
};

export default EditModeFAB;
