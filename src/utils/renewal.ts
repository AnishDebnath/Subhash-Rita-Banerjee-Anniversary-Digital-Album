// Album renewal window: started 10.10.2026, valid for 1 year
export const RENEWAL_START = new Date(2026, 9, 10); // 10 October 2026
export const RENEWAL_END = new Date(2027, 9, 10); // 10 October 2027

export const isRenewalDue = (): boolean => Date.now() >= RENEWAL_END.getTime();

export const msUntilRenewal = (): number => RENEWAL_END.getTime() - Date.now();
