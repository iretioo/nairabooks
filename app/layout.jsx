import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import "./globals.css";
import { UserProvider } from '@/components/UserProvider';

export const metadata = {
    title: "NairaBooks - Modern Accounting for Nigerians",
    description: "Understand your Nigerian tax obligations in real-time. All processing happens in your browser.",
};

export default function RootLayout({
    children,
}) {
    return (
        <html lang="en">
            <body className={`${GeistMono.variable} ${GeistSans.variable} font-sans antialiased`}>
                <UserProvider>
                    {children}
                </UserProvider>
            </body>
        </html>
    );
}
