import { useEffect, useState } from 'react';
import { initializeLiff } from '../lib/liff';

export const useLiff = (liffId) => {
  const [liff, setLiff] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const liffInstance = await initializeLiff(liffId);
        setLiff(liffInstance);
      } catch (err) {
        setError(err);
      }
    };
    init();
  }, [liffId]);

  return { liff, error };
};
