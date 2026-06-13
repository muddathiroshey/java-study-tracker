import './globals.css';
import { AppProvider } from '../context/AppContext';
import AppLayoutWrapper from '../components/AppLayoutWrapper';

export const metadata = {
  metadataBase: new URL('https://java-study-tracker.vercel.app'),
  title: 'EduFocus | Java Course Portal',
  description: 'Master Java Zero to Hero OOP Curriculum',
  openGraph: {
    title: 'EduFocus | Java Course Portal',
    description: 'Master Java Zero to Hero OOP Curriculum',
    url: 'https://java-study-tracker.vercel.app',
    siteName: 'EduFocus',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduFocus | Java Course Portal',
    description: 'Master Java Zero to Hero OOP Curriculum',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <AppProvider>
          <AppLayoutWrapper>
            {children}
          </AppLayoutWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
