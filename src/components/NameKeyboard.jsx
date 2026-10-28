import React, { useEffect } from 'react';
import { Delete, Space } from 'lucide-react';
import Icon from './Icon';
import './NameKeyboard.css';

export const NAME_MAX_LENGTH = 24;

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ['CLEAR', '.', 'SPACE', '-']
];

const ENDS_WORD = /[ .-]$/;

// Applies one key to a name so it is certificate-ready as typed: each word capitalised,
// single spaces, no leading separators, and capped at NAME_MAX_LENGTH.
export function typeIntoName(name, key) {
  if (key === 'BACKSPACE') return name.slice(0, -1);
  if (key === 'CLEAR') return '';
  if (name.length >= NAME_MAX_LENGTH) return name;
  if (key === 'SPACE') return name === '' || name.endsWith(' ') ? name : `${name} `;
  if (key === '.' || key === '-') return name === '' || ENDS_WORD.test(name) ? name : name + key;
  const startsWord = name === '' || ENDS_WORD.test(name);
  return name + (startsWord ? key.toUpperCase() : key.toLowerCase());
}

export const isNameValid = name => name.replace(/[^a-z]/gi, '').length >= 2;

// Physical keys that map onto the on-screen keyboard (for staff and desktop testing)
const keyFromEvent = (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return null;
  if (/^[a-z]$/i.test(e.key)) return e.key.toUpperCase();
  if (e.key === ' ') return 'SPACE';
  if (e.key === 'Backspace') return 'BACKSPACE';
  if (e.key === '.' || e.key === '-') return e.key;
  return null;
};

export default function NameKeyboard({ lang = 'en', disabled = false, onKey, onEnter }) {
  const isEn = lang === 'en';

  useEffect(() => {
    if (disabled) return;
    const handlePhysicalKey = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onEnter();
        return;
      }
      const key = keyFromEvent(e);
      if (!key) return;
      e.preventDefault();
      onKey(key);
    };
    window.addEventListener('keydown', handlePhysicalKey);
    return () => window.removeEventListener('keydown', handlePhysicalKey);
  }, [disabled, onKey, onEnter]);

  const label = (key) => {
    if (key === 'BACKSPACE') return <Icon as={Delete} />;
    if (key === 'SPACE') return <><Icon as={Space} /> {isEn ? 'Space' : 'स्पेस'}</>;
    if (key === 'CLEAR') return isEn ? 'Clear' : 'मिटाएं';
    return key;
  };

  const ariaLabel = (key) => {
    if (key === 'BACKSPACE') return isEn ? 'Delete last letter' : 'अंतिम अक्षर मिटाएं';
    if (key === 'SPACE') return isEn ? 'Space' : 'स्पेस';
    if (key === 'CLEAR') return isEn ? 'Clear name' : 'नाम मिटाएं';
    return key;
  };

  return (
    <div className="vk" role="group" aria-label={isEn ? 'On-screen keyboard' : 'ऑन-स्क्रीन कीबोर्ड'}>
      {ROWS.map((row, i) => (
        <div key={i} className="vk-row">
          {row.map(key => (
            <button
              key={key}
              type="button"
              className={`vk-key vk-key--${key.length > 1 ? key.toLowerCase() : 'char'}`}
              onClick={() => onKey(key)}
              disabled={disabled}
              aria-label={ariaLabel(key)}
            >
              {label(key)}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
