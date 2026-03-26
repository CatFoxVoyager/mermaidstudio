import { describe, it, expect } from 'vitest';
import { applyStyleToContent } from '../colorPalettes';

describe('applyStyleToContent', () => {
  describe('Pie diagrams', () => {
    it('should NOT apply font settings to pie diagrams without palette (avoids unwanted background colors)', () => {
      const pieContent = `pie title Test
  "A" : 10
  "B" : 20`;

      const styleOptions = {
        fontFamily: 'Arial, sans-serif',
        fontSize: 16,
      };

      const result = applyStyleToContent(pieContent, styleOptions);

      // Font-only changes without palette should NOT generate YAML to avoid Mermaid applying default colors
      expect(result).toBe(pieContent);
      expect(result).not.toContain('themeVariables');
    });

    it('should apply useMaxWidth to pie diagrams', () => {
      const pieContent = `pie title Test
  "A" : 10
  "B" : 20`;

      const styleOptions = {
        useMaxWidth: false,
      };

      const result = applyStyleToContent(pieContent, styleOptions);

      expect(result).toContain('useMaxWidth');
      expect(result).toContain('false');
    });

    it('should not modify content if no style options are provided', () => {
      const pieContent = `pie title Test
  "A" : 10
  "B" : 20`;

      const styleOptions = {};

      const result = applyStyleToContent(pieContent, styleOptions);

      // Should return the content as-is (no YAML config added)
      expect(result).toBe(pieContent);
    });
  });

  describe('Timeline diagrams', () => {
    it('should NOT apply font settings to timeline diagrams without palette (avoids unwanted background colors)', () => {
      const timelineContent = `timeline
    title 2024
    2024-01-01 : Start
    2024-12-31 : End`;

      const styleOptions = {
        fontFamily: 'Georgia, serif',
        fontSize: 14,
      };

      const result = applyStyleToContent(timelineContent, styleOptions);

      // Font-only changes without palette should NOT generate YAML to avoid Mermaid applying default colors
      expect(result).toBe(timelineContent);
      expect(result).not.toContain('themeVariables');
    });

    it('should apply timeline-specific options', () => {
      const timelineContent = `timeline
    title 2024
    2024-01-01 : Start
    2024-12-31 : End`;

      const styleOptions = {
        disableMulticolor: true,
        htmlLabels: false,
      };

      const result = applyStyleToContent(timelineContent, styleOptions);

      expect(result).toContain('disableMulticolor');
      expect(result).toContain('htmlLabels');
    });
  });

  describe('Quadrant charts', () => {
    it('should NOT apply font settings to quadrant charts without actual config options (avoids unwanted background colors)', () => {
      const quadrantContent = `quadrantChart
    title Test
    x-axis Low --> High
    y-axis Low --> High`;

      const styleOptions = {
        fontFamily: 'Courier New, monospace',
        fontSize: 12,
      };

      const result = applyStyleToContent(quadrantContent, styleOptions);

      // Font-only changes without palette should NOT generate YAML to avoid Mermaid applying default colors
      expect(result).toBe(quadrantContent);
      expect(result).not.toContain('Courier New');
    });

    it('should apply chart dimensions', () => {
      const quadrantContent = `quadrantChart
    title Test
    x-axis Low --> High
    y-axis Low --> High`;

      const styleOptions = {
        chartWidth: 600,
        chartHeight: 400,
      };

      const result = applyStyleToContent(quadrantContent, styleOptions);

      expect(result).toContain('chartWidth');
      expect(result).toContain('600');
      expect(result).toContain('chartHeight');
      expect(result).toContain('400');
    });
  });

  describe('XY charts', () => {
    it('should NOT apply font settings to xy charts without actual config options (avoids unwanted background colors)', () => {
      const xyContent = `xychart-beta
    title "Test Chart"
    x-axis [Data]
    y-axis "Value" 0 --> 100`;

      const styleOptions = {
        fontFamily: 'Fira Code, monospace',
        fontSize: 11,
      };

      const result = applyStyleToContent(xyContent, styleOptions);

      // Font-only changes without palette should NOT generate YAML to avoid Mermaid applying default colors
      expect(result).toBe(xyContent);
      expect(result).not.toContain('Fira Code');
    });
  });
});
