// src/lib/metaTracking.ts

// Extends Window to avoid TypeScript errors for fbq
declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

/**
 * Helper to get a cookie value by name
 */
function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export interface MetaEventData {
  eventName: string;
  customData?: Record<string, any>;
  userData?: Record<string, any>;
}

/**
 * Track an event using both Browser Pixel and Conversions API (CAPI)
 */
export const trackMetaEvent = async ({
  eventName,
  customData = {},
  userData = {},
}: MetaEventData) => {
  try {
    // 1. Generate unique event ID for deduplication
    const eventId = crypto.randomUUID 
      ? crypto.randomUUID() 
      : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // 2. Fire Browser Pixel Event
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, customData, { eventID: eventId });
    } else {
      console.warn('Meta Pixel (fbq) not loaded or initialized.');
    }

    // 3. Collect automatic user data from cookies/browser
    const fbp = getCookie('_fbp');
    let fbc = getCookie('_fbc');
    
    if (!fbc) {
      const fbclid = getQueryParam('fbclid');
      if (fbclid) {
        fbc = `fb.1.${Date.now()}.${fbclid}`;
      }
    }

    // Prepare payload for CAPI
    const capiPayload = {
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      custom_data: customData,
      user_data: {
        ...userData,
        fbp,
        fbc,
      },
    };

    // 4. Send to our backend API for Server-Side CAPI
    // We do NOT await this so it doesn't block the UI thread.
    fetch('/api/meta/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(capiPayload),
    }).catch(err => console.error('Failed to send Meta CAPI event', err));

  } catch (error) {
    console.error('Error in trackMetaEvent:', error);
  }
};

function getQueryParam(param: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || undefined;
}
