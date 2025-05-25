/**
 * Utility functions for formatting values in the application
 */

/**
 * Formats a number as an Argentine currency (ARS)
 * Features:
 * - Uses dot as thousands separator
 * - Uses comma as decimal separator
 * - Adds $ symbol at the beginning
 * - Formats with 2 decimal places
 * 
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted price string
 */
export const formatArgentinePrice = (
  value: number | string | undefined | null,
  options: {
    includeSymbol?: boolean;
    decimalPlaces?: number;
    showZeroAsEmpty?: boolean;
  } = {}
): string => {
  const {
    includeSymbol = true,
    decimalPlaces = 2,
    showZeroAsEmpty = false,
  } = options;

  if (value === null || value === undefined || value === '') {
    return '';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return '';
  }

  if (showZeroAsEmpty && numValue === 0) {
    return '';
  }

  const formattedNumber = numValue.toLocaleString('es-AR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return includeSymbol ? `$${formattedNumber}` : formattedNumber;
};

/**
 * Formats a number with thousands separators in Argentine style
 * 
 * @param value - The number to format
 * @param decimalPlaces - Number of decimal places
 * @returns Formatted number string
 */
export const formatArgentineNumber = (
  value: number | string | undefined | null,
  decimalPlaces: number = 0
): string => {
  return formatArgentinePrice(value, {
    includeSymbol: false,
    decimalPlaces,
    showZeroAsEmpty: false,
  });
};
