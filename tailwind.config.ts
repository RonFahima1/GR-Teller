import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme"; // Import defaultTheme

const config = {
    darkMode: ['class'],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
  	screens: { // Explicitly define breakpoints, including tablet range
        sm: '640px',
        md: '768px', // Standard tablet breakpoint
        lg: '1024px', // Start of typical desktop
        xl: '1280px',
        '2xl': '1536px',
    },
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
  		colors: {
        // iOS Inspired Palette (Direct use)
        'ios-blue': '#0A84FF',
        'ios-light-blue': '#5AC8FA',
        'ios-green': '#34C759',
        'ios-orange': '#FF9500',
        'ios-red': '#FF3B30',
        'ios-gray': '#8E8E93',
        'ios-light-gray': '#F2F2F7',
        'ios-divider': '#C6C6C8',
        'ios-label': 'rgba(60, 60, 67, 0.6)', // Semi-transparent label color

        // Shadcn Theme Mapped to iOS Palette (Using CSS Variables)
        background: 'hsl(var(--background))', // maps to #F2F2F7 (ios-light-gray)
        foreground: 'hsl(var(--foreground))', // maps to #000000 (ios-primary-text)
        card: {
          DEFAULT: 'hsl(var(--card))', // maps to #FFFFFF
          foreground: 'hsl(var(--card-foreground))' // maps to #000000
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))', // maps to #FFFFFF
          foreground: 'hsl(var(--popover-foreground))' // maps to #000000
        },
  			primary: {
  				DEFAULT: 'hsl(var(--primary))', // maps to #0A84FF (ios-blue)
  				foreground: 'hsl(var(--primary-foreground))' // maps to #FFFFFF
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))', // maps to #8E8E93 (ios-gray)
  				foreground: 'hsl(var(--secondary-foreground))' // maps to #FFFFFF (adjust if needed)
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))', // maps to #F2F2F7 (ios-light-gray)
  				foreground: 'hsl(var(--muted-foreground))' // maps to #8E8E93 (ios-gray)
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))', // maps to #34C759 (ios-green)
  				foreground: 'hsl(var(--accent-foreground))' // maps to #FFFFFF
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))', // maps to #FF3B30 (ios-red)
  				foreground: 'hsl(var(--destructive-foreground))' // maps to #FFFFFF
  			},
        border: 'hsl(var(--border))', // maps to #C6C6C8 (ios-divider)
        input: 'hsl(var(--input))', // maps to #F2F2F7 (ios-light-gray background for inputs)
        ring: 'hsl(var(--ring))', // maps to #0A84FF (ios-blue for focus rings)
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
  		},
  		borderRadius: {
        'ios': '10px', // Standard iOS corner radius
        'ios-card': '14px', // Card corner radius
  			lg: 'var(--radius)', // Shadcn default (mapped to ios: 10px)
  			md: 'calc(var(--radius) - 2px)', // 8px
  			sm: 'calc(var(--radius) - 4px)' // 6px
  		},
      boxShadow: {
        'ios-card': '0 4px 16px rgba(0, 0, 0, 0.08)', // Subtle card shadow
        'ios-button': '0 1px 3px rgba(0, 0, 0, 0.1)', // Subtle button shadow
        'ios-header': '0 1px 0px rgba(0, 0, 0, 0.08)', // Top bar shadow
      },
      fontFamily: {
        // Use Inter as the primary font, falling back to system UI fonts
        'sf-pro': ['Inter', ...fontFamily.sans], // Use Inter and include Tailwind's default sans-serif stack
        sans: ['Inter', ...fontFamily.sans], // Optionally make Inter the default sans font
      },
      fontSize: {
        'h1': '28px',
        'h2': '22px',
        'h3': '20px',
        'body': '17px',
        'caption': '15px',
        'small': '13px',
        'sm': '14px', // Ensure standard Tailwind 'sm' is defined if used
        'base': '17px', // Explicitly set base to 17px
        'lg': '18px', // Example 'lg' size
        'xl': '20px', // Example 'xl' size
        '2xl': '24px', // Example '2xl' size
        // Add other sizes as needed
      },
      fontWeight: {
          'h1': '700', // bold
          'h2': '600', // semibold
          'h3': '600', // semibold
          'body': '400', // regular
          'caption': '400', // regular
          'small': '400', // regular
          // Add other weights if needed
          'regular': '400',
          'medium': '500',
          'semibold': '600',
          'bold': '700',
      },
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
