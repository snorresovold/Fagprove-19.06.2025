import { useState } from 'react';
import { UserRoleDict, type UserRole } from '~/interfaces';

type DropdownProps = {
  onRoleSelect: (role: UserRole) => void;
};

export default function Dropdown({ onRoleSelect }: DropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>();
  const [selectedRole, setSelectedRole] = useState<UserRole>();

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
    onRoleSelect(role);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
        {selectedRole? UserRoleDict[selectedRole] : 'Velg rolle'}
          <svg
            className="-mr-1 size-5 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none transition ease-out duration-100 transform scale-100 opacity-100"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          {Object.entries(UserRoleDict).map(([key, value]) => (
            <div className="py-1" role="none" key={key}>
              <button
                onClick={() => {
                  setSelectedRole(key as UserRole);
                  handleSelect(key as UserRole);
                  setIsOpen(false);
                }}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
              >
                {value}
              </button>
            </div>
            ))}
          </div>
      )}
    </div>
  );
}
