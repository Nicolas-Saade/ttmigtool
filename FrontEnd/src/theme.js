// Theme configuration for the app
export const colors = {
  // Backgrounds
  primaryBg: '#121212',
  secondaryBg: '#1E1E1E',
  
  // Accent Colors
  neonBlue: '#4AB3F4',
  neonPink: '#F94879',
  neonPurple: '#9B51E0',
  
  // Text Colors
  primaryText: '#FFFFFF',
  secondaryText: '#B3B3B3',
  
  // Borders and Dividers
  divider: '#303030',
  
  // Status Colors
  error: '#FF4C4C',
  warning: '#FFAD33',
  success: '#4CAF50',
};

// Gradients
export const gradients = {
  main: 'linear-gradient(90deg, #4AB3F4 0%, #F94879 50%, #9B51E0 100%)',
};

// Typography
export const typography = {
  h1: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: '32px',
  },
  h2: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: '24px',
  },
  h3: {
    fontFamily: 'Quicksand_500Medium',
    fontSize: '20px',
  },
  body: {
    fontFamily: 'Nunito_400Regular',
    fontSize: '16px',
  },
  bodyBold: {
    fontFamily: 'Nunito_600SemiBold',
    fontSize: '16px',
  },
  button: {
    fontFamily: 'Quicksand_700Bold',
    fontSize: '16px',
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Border Radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: '50%',
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  card: {
    backgroundColor: colors.secondaryBg,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...shadows.md,
  },
  button: {
    backgroundColor: colors.neonBlue,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  buttonText: {
    ...typography.button,
    color: colors.primaryText,
  },
}; 