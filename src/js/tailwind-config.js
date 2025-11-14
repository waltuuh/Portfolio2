/**
 * Configuration Tailwind CSS
 * Couleurs et animations personnalisées pour le portfolio
 */

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Inter', 'system-ui', 'sans-serif'],
                'display': ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
            colors: {
                'navy': {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    200: '#c7d7fe',
                    300: '#a5bbfd',
                    400: '#7f95fa',
                    500: '#5f6ff4',
                    600: '#4347e8',
                    700: '#3538cd',
                    800: '#2d2fa5',
                    900: '#2a2d83',
                    950: '#0f1629',
                },
                'mint': {
                    50: '#f0fdf9',
                    100: '#ccfbea',
                    200: '#9af5d6',
                    300: '#5fe8bb',
                    400: '#2dd39c',
                    500: '#14b981',
                    600: '#0a9766',
                    700: '#0a7853',
                    800: '#0c5f43',
                    900: '#0a4f39',
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'slide-down': 'slideDown 0.5s ease-out',
                'fade-in': 'fadeIn 0.8s ease-out',
                'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
                'gradient': 'gradient 8s ease infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                }
            }
        }
    }
};
