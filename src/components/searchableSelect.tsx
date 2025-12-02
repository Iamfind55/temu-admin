"use client";

import { SearchIcon } from "@/icons/page";
import React, { useEffect, useRef, useState } from "react";

interface Option {
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  onScrollEnd?: (end: boolean) => void;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className = "",
  label,
  onScrollEnd
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options?.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the label of the selected value
  const selectedLabel =
    options?.find((option) => option.value === value)?.label || placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm text-gray-600 mb-1">{label}</label>
      )}

      {/* Select button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-sm text-left border rounded-md bg-white text-gray-500 flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 ${className}`}
      >
        <span className={value ? "text-gray-700" : "text-gray-400"}>
          {selectedLabel}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "transform rotate-180" : ""
            }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b sticky top-0 bg-white text-gray-500">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <SearchIcon size={16} className="text-gray-400" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="w-full pl-10 pr-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Options list */}
          <div onScroll={(e) => {
            const target = e.target as HTMLDivElement;
            const isAtEnd =
              target.scrollHeight - target.scrollTop === target.clientHeight;
            onScrollEnd?.(isAtEnd);
          }} className="overflow-y-auto max-h-60">
            {filteredOptions && filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${option.value === value
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700"
                    }`}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-gray-500 text-center">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
