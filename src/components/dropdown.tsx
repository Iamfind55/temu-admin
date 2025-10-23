import { useState, useEffect, useRef, ReactNode } from "react";

type DropdownType = {
  head: ReactNode;
  className?: string;
  children: ReactNode;
};

const DropdownComponent = ({ head, className, children }: DropdownType) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownVisible(false);
    }
  };

  const handleChildClick = () => {
    setIsDropdownVisible(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div onClick={toggleDropdown}>{head}</div>

      {isDropdownVisible && (
        <div
          className={`absolute z-10 bg-white divide-y divide-gray-100 rounded shadow ${className}`}
          style={{ right: "0rem" }}
          onClick={handleChildClick} // Close dropdown when children are clicked
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownComponent;
