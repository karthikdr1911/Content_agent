// TODO: Implement JSON utility functions
export const safeParse = (json: string): any => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}; 