import React from 'react';

export default function Mascot({ text, emotion = 'welcome' }) {
  const getAvatarIcon = () => {
    switch (emotion) {
      case 'celebrate': return '🎉';
      case 'warning': return '🧐';
      case 'happy': return '⭐';
      case 'idea': return '💡';
      default: return '🤖';
    }
  };

  return (
    <section className="mascot-companion-bar" aria-live="polite">
      <div className="mascot-avatar" title="Setu Mitra (सेतु मित्र)">
        {getAvatarIcon()}
      </div>
      <div
        className="mascot-speech"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </section>
  );
}
