# Deal Margin Simulator - Design Guidelines

## Design Approach
**System:** Custom FinTech Design System  
**Aesthetic:** Clean, minimalist, trustworthy with high whitespace - designed to convey financial professionalism and clarity

## Core Design Elements

### A. Color System
- **Background:** `bg-slate-50` (soft gray, never pure white or dark mode)
- **Cards:** `bg-white` with `rounded-xl`, `shadow-sm`, `border border-slate-200`
- **Primary Action:** `bg-blue-600` (Hover: `bg-blue-700`)
- **Text Hierarchy:**
  - Headers: `text-slate-900`, `font-bold`
  - Body: `text-slate-600`
  - Muted/Secondary: `text-slate-400`
- **Result States:**
  - Approved Deal: GREEN card background
  - Rejected Deal: RED card background

### B. Typography
- **Font Family:** System Sans-Serif (Inter style)
- **Hierarchy:** Bold headers for card titles, regular weight for body text, clear visual distinction between primary and secondary information

### C. Layout System
- **Spacing:** Use Tailwind units of 4, 6, and 8 for consistent vertical rhythm (`p-4`, `p-6`, `p-8`, `mb-6`, etc.)
- **Container:** Single-column centered layout with `max-w-2xl` for main content
- **Mobile:** Stack all cards vertically on mobile devices

### D. Component Library

**Header:**
- Simple top bar with logo/title "Deal Margin Simulator" aligned left
- Minimal, clean design with adequate padding

**Input Cards (Card 1 & 2):**
- White backgrounds with rounded corners (`rounded-xl`)
- Subtle shadows and slate borders
- Inputs: `rounded-lg`, `border-slate-300`, `focus:ring-blue-500`
- Include Lucide React icons for visual context
- Card 1 "The Deal": Deal Amount, Estimated Hours, Revisions, Expenses, Tax Rate
- Card 2 "Your Standards": Minimum Hourly Floor (slider or input)

**Scenario Toggle:**
- Positioned at top of input section
- Two states: "Quick Check" (default) vs "Deep Dive"
- Deep Dive reveals additional fields: Software Subscription Costs, Agency Fees
- Clear visual indicator for active state

**Result Card (Card 3):**
- Sticky or fixed position at bottom for constant visibility
- Large, bold display of Effective Hourly Rate
- Conditional styling:
  - GREEN card when Rate ≥ Minimum Floor with "DEAL APPROVED" text
  - RED card when Rate < Minimum Floor with "REJECT DEAL" or "Negotiate Higher" text
- CTA Button: "Lock in this deal with a contract" in primary blue color

**Footer:**
- Minimal footer with "Built by Playbook Media" text
- Muted text color (`text-slate-400`)

### E. Interaction States
- Input focus: Blue ring (`focus:ring-blue-500`)
- Button hover: Darker blue (`bg-blue-700`)
- Real-time calculations: Update Result Card instantly as inputs change
- Smooth transitions between Quick Check and Deep Dive modes

## Layout Structure
1. **Header** (top, full width)
2. **Scenario Toggle** (centered, below header)
3. **Input Cards** (stacked vertically, centered with max-w-2xl)
4. **Result Card** (sticky/fixed bottom section)
5. **Footer** (bottom, full width)

## Mobile Responsiveness
- Single column layout throughout
- Full-width cards with appropriate padding
- Sticky result card remains visible on scroll
- Touch-friendly input sizes
- Adequate spacing between interactive elements

## Design Principles
- **Trustworthy:** Professional FinTech aesthetic builds confidence in calculations
- **Clarity:** High contrast, clear typography, obvious visual hierarchy
- **Efficiency:** Real-time feedback, minimal clicks to get results
- **Scannable:** Important information (Effective Rate, Deal Status) immediately visible