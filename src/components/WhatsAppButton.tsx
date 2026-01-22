import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/5493431234567" 
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 flex items-center justify-center"
    >
      <MessageCircle className="w-8 h-8" />
    </a>
  );
};