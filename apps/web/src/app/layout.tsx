import './global.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthGuard } from '@/components/common/auth-guard';
import { FavoritesProvider } from '@/lib/favorites-context';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
});

export const metadata = {
  title: 'WrectifAI',
  description: 'WrectifAI automotive services platform',
  icons: {
    icon: '/Logo_noBg.png',
    shortcut: '/Logo_noBg.png',
    apple: '/Logo_noBg.png',
  },
};

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id-here';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const path = window.location.pathname;
                const roleKey = path.startsWith('/admin') ? 'admin' : (path === '/garage' || path.startsWith('/garage/')) ? 'garage' : 'customer';
                const theme = localStorage.getItem('theme-' + roleKey) || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="bg-background text-foreground antialiased" suppressHydrationWarning>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <FavoritesProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
            </FavoritesProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
