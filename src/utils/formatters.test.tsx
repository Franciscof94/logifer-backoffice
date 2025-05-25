import React from 'react';
import { formatArgentinePrice, formatArgentineNumber } from './formatters';

/**
 * This is a simple test component to demonstrate the formatters
 * You can delete this file after reviewing the examples
 */
export const FormatterExamples = () => {
  const examples = [
    { value: 1234.56, description: 'Regular number' },
    { value: 1000000, description: 'Million' },
    { value: 0.99, description: 'Less than one' },
    { value: 0, description: 'Zero' },
    { value: 0, options: { showZeroAsEmpty: true }, description: 'Zero shown as empty' },
    { value: 1234.56, options: { includeSymbol: false }, description: 'Without currency symbol' },
    { value: 1234.56789, options: { decimalPlaces: 4 }, description: 'With 4 decimal places' },
    { value: null, description: 'Null value' },
    { value: '1234.56', description: 'String number' },
    { value: 'not a number', description: 'Invalid string' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Argentine Price Formatter Examples</h2>
      <div className="grid grid-cols-3 gap-4">
        <div className="font-semibold">Input</div>
        <div className="font-semibold">Formatted Output</div>
        <div className="font-semibold">Description</div>
        
        {examples.map((example, index) => (
          <React.Fragment key={index}>
            <div>{JSON.stringify(example.value)}{example.options ? ` (with options)` : ''}</div>
            <div className="font-mono">{formatArgentinePrice(example.value, example.options)}</div>
            <div>{example.description}</div>
          </React.Fragment>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Argentine Number Formatter Examples</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="font-semibold">Input</div>
        <div className="font-semibold">Formatted Output</div>
        
        <div>1234</div>
        <div className="font-mono">{formatArgentineNumber(1234)}</div>
        
        <div>1234.56 (2 decimals)</div>
        <div className="font-mono">{formatArgentineNumber(1234.56, 2)}</div>
      </div>
    </div>
  );
};
