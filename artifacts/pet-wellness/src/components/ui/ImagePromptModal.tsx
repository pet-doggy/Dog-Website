import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Image as ImageIcon } from 'lucide-react';

interface ImagePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (url: string) => void;
  title?: string;
  initialUrl?: string;
}

export default function ImagePromptModal({ isOpen, onClose, onSave, title = "Enter Image URL", initialUrl = "" }: ImagePromptModalProps) {
  const [url, setUrl] = useState(initialUrl);
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setPreviewError(false);
    }
  }, [isOpen, initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && !previewError) {
      onSave(url.trim());
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-muted-foreground mb-2">Image URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setPreviewError(false);
            }}
            placeholder="https://example.com/image.jpg"
            className="w-full h-12 px-4 bg-[#F8F9FA] rounded-xl border border-border/50 focus:border-[#12333B] transition-all outline-none"
            required
          />
        </div>

        {/* Live Preview */}
        {url.trim() && (
          <div className="mt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Live Preview</p>
            <div className="w-full aspect-video bg-[#F8F9FA] rounded-xl border border-border/50 overflow-hidden flex items-center justify-center relative">
              {!previewError ? (
                <img 
                  src={url} 
                  alt="Preview" 
                  className="w-full h-full object-contain"
                  onError={() => setPreviewError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">Invalid image URL</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium hover:bg-muted rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!url.trim() || previewError}
            className="px-6 py-2.5 bg-[#12333B] hover:bg-[#1a2015] text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Save Image
          </button>
        </div>
      </form>
    </Modal>
  );
}
