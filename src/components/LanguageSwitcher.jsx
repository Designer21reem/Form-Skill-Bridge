import React from 'react';

function LanguageSwitcher({ isRTL, toggleLanguage }) {
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
    >
      <span>{isRTL ? 'English' : 'العربية'}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389 21.034 21.034 0 01-.914-1.026 18.588 18.588 0 01-2.487 2.461 1 1 0 01-1.414-1.414 16.588 16.588 0 002.487-2.461A18.823 18.823 0 013.839 6H2a1 1 0 010-2h3V3a1 1 0 011-1zm5 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0112 8z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  );
}

export default LanguageSwitcher;