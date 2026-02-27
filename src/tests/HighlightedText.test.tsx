import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HighlightedText } from '../components/HighlightedText';

describe('HighlightedText', () => {
  it('destaca o termo buscado quando habilitado', () => {
    render(
      <p>
        <HighlightedText
          text="Uma garota entra em um mundo de espíritos e magia."
          query="mundo"
          enabled
        />
      </p>
    );

    const mark = screen.getByText('mundo');

    expect(mark.tagName).toBe('MARK');
  });

  it('não aplica destaque quando desabilitado', () => {
    render(
      <p>
        <HighlightedText
          text="Uma garota entra em um mundo de espíritos e magia."
          query="mundo"
          enabled={false}
        />
      </p>
    );

    const plainText = screen.getByText(/mundo de espíritos/i);

    expect(plainText.tagName).toBe('P');
  });
});
