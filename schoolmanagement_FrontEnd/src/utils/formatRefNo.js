export const extractDocumentNo = (docType, rawNo) => {
  if (!rawNo) return "";
  if (!rawNo.includes('/')) return rawNo; // already short like CC004
  const parts = rawNo.split('/');
  const lastPart = parts[parts.length - 1];
  const num = parseInt(lastPart, 10);
  if (!isNaN(num)) {
      return `${docType}${num.toString().padStart(3, '0')}`;
  }
  return rawNo;
};
