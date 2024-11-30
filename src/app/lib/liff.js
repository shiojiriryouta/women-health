import liff from '@line/liff';

export const initializeLiff = async (liffId) => {
  if (!liffId) throw new Error('LIFF ID is required');
  try {
    await liff.init({ liffId });
    console.log('LIFF initialized');
    return liff;
  } catch (error) {
    console.error('LIFF initialization failed:', error);
    throw error;
  }
};
