/**
 * Date formatting utility functions
 */

/**
 * Formats a date string into a human-readable format
 * Handles the special case of malformed dates like "24T17:56:42.997Z-05-2025"
 * 
 * @param dateStr The date string to format
 * @param format The format to use (default: 'DD/MM/YYYY HH:mm')
 * @returns Formatted date string or a fallback message if invalid
 */
export const formatDate = (dateStr: string | null | undefined, format: string = 'DD/MM/YYYY HH:mm'): string => {
  if (!dateStr) return '-';
  
  try {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-').map(Number);
      
      if (format === 'DD/MM/YYYY') {
        return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
      }
      
      return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} 00:00`;
    }
    
    if (dateStr.includes('-05-2025')) {
      const parts = dateStr.split('T');
      if (parts.length > 1) {
        const day = parts[0];
        const timeParts = parts[1].split('-05-2025')[0];
        dateStr = `2025-05-${day.padStart(2, '0')}T${timeParts}`;
      }
    }
    
    const date = new Date(dateStr);
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    if (format === 'DD/MM/YYYY HH:mm') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    
    if (format === 'DD/MM/YYYY') {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    }
    
    return date.toISOString().split('.')[0].replace('T', ' ');
    
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formats a date for display in a table cell
 * 
 * @param dateStr The date string to format
 * @returns Formatted date string for table display
 */
export const formatTableDate = (dateStr: string | null | undefined): string => {
  return formatDate(dateStr, 'DD/MM/YYYY');
};

/**
 * Formats a date for display in a form or input
 * 
 * @param dateStr The date string to format
 * @returns Formatted date string for form display
 */
export const formatFormDate = (dateStr: string | null | undefined): string => {
  return formatDate(dateStr, 'DD/MM/YYYY');
};
