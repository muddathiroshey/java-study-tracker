---
name: Academic Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#006242'
  on-tertiary: '#ffffff'
  tertiary-container: '#007d55'
  on-tertiary-container: '#bdffdb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  max-width: 1280px
---

## Brand & Style

The design system is built for a modern educational environment where focus and clarity are paramount. The brand personality is **scholarly yet accessible**, balancing the rigor of academic achievement with an encouraging, user-centric interface. It targets students and lifelong learners who require a distraction-free space to absorb complex information.

The visual style follows a **Modern Corporate** aesthetic with a strong emphasis on **Minimalism**. It utilizes generous whitespace to reduce cognitive load, structured information density for curriculum navigation, and high-quality typography to ensure long-form legibility. The emotional response is intended to be one of confidence, progress, and calm focus.

## Colors

The color palette is anchored in **Trustworthy Blue** (#2563EB) for primary actions and brand presence, conveying stability and authority. **Professional Indigo** (#4F46E5) is used for secondary navigation elements and deep-focus areas, providing a sophisticated contrast.

**Vibrant Success Green** (#10B981) is reserved strictly for positive feedback loops, such as completed lessons, correct answers, and progress indicators. The neutral palette uses Slate Grays to maintain a soft, readable contrast against white backgrounds, avoiding the harshness of pure black text.

## Typography

This design system employs a dual-sans-serif approach. **Hanken Grotesk** is used for headlines and display text, offering a sharp, contemporary edge that feels modern and precise. **Inter** is utilized for all body copy and UI labels due to its exceptional legibility at small sizes and its neutral, systematic character.

Typography scales are generous to support readability during long study sessions. Line heights for body text are intentionally set at 1.5x to prevent line-tracking fatigue.

## Layout & Spacing

The layout utilizes a **Fixed Grid** model for desktop, centered within the viewport with a maximum width of 1280px to maintain comfortable line lengths for reading. On mobile, the system transitions to a fluid 4-column layout.

A strictly 4px baseline grid governs all vertical rhythm. Component spacing follows a geometric progression (8, 16, 24, 32, 48, 64) to ensure visual balance. "Focus Areas" (like lesson content) should utilize the `xl` spacing tokens to separate them from sidebar navigation and utility bars.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. Surfaces are primarily white (#FFFFFF), with background layers using a very light tint of neutral gray (#F8FAFC) to create a subtle sense of recession.

Shadows are used sparingly to indicate interactivity. They should be highly diffused with low opacity (e.g., `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`). Cards that contain lesson modules should use a subtle "lift" effect on hover to indicate clickability.

## Shapes

The shape language is **Rounded**, using a 0.5rem (8px) base radius. This softens the structured grid, making the educational experience feel more inviting and less intimidating. 

Larger containers like cards or content modules use the `rounded-lg` (16px) token, while small interactive elements like checkboxes use the base 8px radius. This consistent curvature creates a cohesive visual rhythm across all components.

## Components

- **Buttons:** Primary buttons use the primary blue with white text. Use "Success Green" only for final submission or "Lesson Complete" actions. Buttons feature a subtle 1px inner stroke for added definition.
- **Input Fields:** Use a light gray border (#CBD5E1) that shifts to the Primary Blue on focus. Labels should always be visible above the input field.
- **Progress Bars:** Utilize a dual-tone approach—a light gray track with a Vibrant Success Green fill to emphasize achievement.
- **Cards:** White background, 1px neutral border, and a subtle ambient shadow. Use cards to group related learning modules or quiz questions.
- **Chips:** Small, rounded labels used for tags (e.g., "Intermediate," "5 mins," "New"). Use low-saturation background tints of the primary and secondary colors with high-contrast text.
- **Lists:** Clean, border-less lists for course outlines, using the Professional Indigo for active/selected items.