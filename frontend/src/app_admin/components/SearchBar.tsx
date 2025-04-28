import React from "react";

interface SearchBarProps {
  placeholder: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        className="border rounded px-4 py-2 w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};