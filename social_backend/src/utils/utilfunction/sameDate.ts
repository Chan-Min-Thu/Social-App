export const isSameDate = (data: Date) => {
  const lastUpdated = new Date(data).toLocaleDateString();
  const today = new Date().toLocaleDateString();
  const isSame = lastUpdated > today;
  return isSame;
};
