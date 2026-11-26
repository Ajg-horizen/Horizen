/**
 * Shared animation variants used across components.
 * Consolidates duplicate fadeInUp patterns.
 */

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1] as const,
    },
  }),
};

/**
 * Rolig fade-in uden bevægelse og uden forsinkelse pr. element. Bruges på
 * case-siderne i stedet for fadeInUp, så kort og sektioner ikke "hopper" op
 * efter hinanden, når man scroller. `custom` ignoreres med vilje, så den kan
 * erstatte fadeInUp/fadeUp direkte.
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: () => ({
    opacity: 1,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] as const },
  }),
};
