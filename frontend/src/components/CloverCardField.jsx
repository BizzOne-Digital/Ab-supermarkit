import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const ELEMENT_STYLE = {
  input: { 'font-size': '15px', color: '#1a1a1a', 'font-family': 'inherit' },
};

// Tokenizes card details in Clover's hosted iframes so raw card numbers never touch our
// server. Exposes getToken() via ref for the checkout form to call on submit.
const CloverCardField = forwardRef(function CloverCardField(_, ref) {
  const cardNumberRef = useRef(null);
  const cardDateRef = useRef(null);
  const cardCvvRef = useRef(null);
  const cardPostalRef = useRef(null);
  const cloverRef = useRef(null);
  const elementsRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!window.Clover) {
      setError('Payment form failed to load. Please refresh the page.');
      return;
    }
    const clover = new window.Clover(import.meta.env.VITE_CLOVER_PUBLIC_KEY);
    const elements = clover.elements();
    cloverRef.current = clover;
    elementsRef.current = elements;

    const cardNumber = elements.create('CARD_NUMBER', ELEMENT_STYLE);
    const cardDate = elements.create('CARD_DATE', ELEMENT_STYLE);
    const cardCvv = elements.create('CARD_CVV', ELEMENT_STYLE);
    const cardPostal = elements.create('CARD_POSTAL_CODE', ELEMENT_STYLE);

    cardNumber.mount(cardNumberRef.current);
    cardDate.mount(cardDateRef.current);
    cardCvv.mount(cardCvvRef.current);
    cardPostal.mount(cardPostalRef.current);

    setReady(true);

    return () => {
      [cardNumber, cardDate, cardCvv, cardPostal].forEach((el) => {
        try {
          el.unmount();
        } catch {
          // already unmounted
        }
      });
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getToken: async () => {
      if (!cloverRef.current) throw new Error('Payment form is not ready');
      const result = await cloverRef.current.createToken();
      if (result.errors) {
        const message = Object.values(result.errors)[0];
        throw new Error(message || 'Invalid card details');
      }
      return result.token;
    },
  }));

  return (
    <div className="space-y-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div>
        <label className="text-sm font-medium text-charcoal/70">Card Number</label>
        <div ref={cardNumberRef} className="mt-1 border border-charcoal/20 rounded-md py-2.5 px-3" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="text-sm font-medium text-charcoal/70">Expiry</label>
          <div ref={cardDateRef} className="mt-1 border border-charcoal/20 rounded-md py-2.5 px-3" />
        </div>
        <div className="col-span-1">
          <label className="text-sm font-medium text-charcoal/70">CVV</label>
          <div ref={cardCvvRef} className="mt-1 border border-charcoal/20 rounded-md py-2.5 px-3" />
        </div>
        <div className="col-span-1">
          <label className="text-sm font-medium text-charcoal/70">Postal Code</label>
          <div ref={cardPostalRef} className="mt-1 border border-charcoal/20 rounded-md py-2.5 px-3" />
        </div>
      </div>
      {!ready && !error && <p className="text-xs text-charcoal/50">Loading secure payment form...</p>}
    </div>
  );
});

export default CloverCardField;
