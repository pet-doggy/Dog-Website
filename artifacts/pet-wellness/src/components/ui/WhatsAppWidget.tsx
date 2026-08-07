import React from 'react';

export default function WhatsAppWidget() {
  const whatsappNumber = "919633007591";
  const message = encodeURIComponent("Hello! I would like to know more about Ancestral Essence.");
  
  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 group overflow-hidden"
      aria-label="Chat on WhatsApp"
    >
      <img src="https://cdn-icons-png.flaticon.com/128/3670/3670051.png" alt="WhatsApp" className="w-14 h-14 drop-shadow-md object-contain" />
      
      {/* Tooltip on hover */}
      <span className="absolute right-full mr-4 bg-black/80 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
        Chat with us
      </span>
    </a>
  );
}
