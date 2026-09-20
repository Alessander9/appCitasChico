import React, { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, Check, X } from "lucide-react";

export interface SearchableOption {
  value: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  badge?: string;
  badgeColor?: string;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  maxResults?: number; // Defaults to strictly 2 results
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opción...",
  label,
  icon,
  disabled = false,
  required = false,
  className = "",
  error,
  maxResults = 2, // Strict maximum 2 results as requested
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Find currently selected option
  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  // Filter options instantly as user types, capping at maxResults (2)
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) {
      return options.slice(0, maxResults);
    }
    const query = searchTerm.toLowerCase().trim();
    return options
      .filter(
        (opt) =>
          opt.label.toLowerCase().includes(query) ||
          (opt.sublabel && opt.sublabel.toLowerCase().includes(query)) ||
          (opt.badge && opt.badge.toLowerCase().includes(query))
      )
      .slice(0, maxResults);
  }, [options, searchTerm, maxResults]);

  // Total matching count before slice (for indicator)
  const totalMatchesCount = useMemo(() => {
    if (!searchTerm.trim()) return options.length;
    const query = searchTerm.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query)) ||
        (opt.badge && opt.badge.toLowerCase().includes(query))
    ).length;
  }, [options, searchTerm]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
  };

  return (
    <div className={`space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          {icon && <span className="text-indigo-600">{icon}</span>}
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Trigger Box / Input */}
        <div
          onClick={() => {
            if (!disabled) {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 50);
            }
          }}
          className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-xl cursor-pointer transition-all duration-150 ${
            disabled
              ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
              : isOpen
              ? "border-indigo-500 ring-2 ring-indigo-100 shadow-sm text-slate-900"
              : error
              ? "border-red-400 text-red-700"
              : "border-slate-200 hover:border-slate-300 text-slate-800 shadow-2xs"
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isOpen ? (
              <div className="flex items-center gap-2 w-full">
                <Search className="w-4 h-4 text-indigo-600 shrink-0 animate-pulse" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Escribe para buscar..."
                  className="w-full bg-transparent border-none outline-none text-slate-900 text-sm placeholder:text-slate-400 p-0"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsOpen(false);
                      setSearchTerm("");
                    } else if (e.key === "Enter" && filteredOptions.length > 0) {
                      e.preventDefault();
                      handleSelect(filteredOptions[0].value);
                    }
                  }}
                />
              </div>
            ) : selectedOption ? (
              <div className="flex items-center gap-2 min-w-0">
                {selectedOption.icon && (
                  <span className="shrink-0 text-indigo-600">
                    {selectedOption.icon}
                  </span>
                )}
                <span className="truncate font-medium text-slate-900">
                  {selectedOption.label}
                </span>
                {selectedOption.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      selectedOption.badgeColor ||
                      "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {selectedOption.badge}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 text-sm truncate">
                {placeholder}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            {value && !disabled && !isOpen && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition"
                title="Limpiar selección"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? "rotate-180 text-indigo-600" : ""
              }`}
            />
          </div>
        </div>

        {/* Dropdown Results (Showing up to MAX 2 options simultaneously) */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            {/* Header info indicator */}
            <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span>Resultados (máx. 2)</span>
              </span>
              <span>
                {totalMatchesCount > 0
                  ? `${Math.min(filteredOptions.length, 2)} de ${totalMatchesCount}`
                  : "0 coincidencias"}
              </span>
            </div>

            {/* Results List (Strictly up to 2 items displayed) */}
            <div className="p-1 space-y-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 text-sm ${
                        isSelected
                          ? "bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {opt.icon && (
                          <span
                            className={`shrink-0 ${
                              isSelected ? "text-indigo-600" : "text-slate-400"
                            }`}
                          >
                            {opt.icon}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-xs sm:text-sm font-semibold">
                            {opt.label}
                          </p>
                          {opt.sublabel && (
                            <p className="text-[11px] text-slate-500 truncate">
                              {opt.sublabel}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        {opt.badge && (
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              opt.badgeColor ||
                              "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-4 px-3 text-center text-xs text-slate-500">
                  No se encontraron resultados para "{searchTerm}"
                </div>
              )}
            </div>

            {totalMatchesCount > 2 && (
              <div className="px-3 py-1 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-500">
                Escribe más caracteres para afinar los 2 resultados mostrados
              </div>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
};
