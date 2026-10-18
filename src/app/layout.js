import localFont from "next/font/local";
import { DM_Sans, Montserrat } from "next/font/google";
import "./globals.css";
import Providers from "../lib/Providers";
import ReduxProviders from "@/redux/lib/ReduxProvider";
import { Toaster } from "react-hot-toast";
import { AntdRegistry } from "@ant-design/nextjs-registry";

const generalSans = localFont({
  src: "../assets/fonts/GeneralSans-Variable.woff2",
  variable: "--font-general-sans",
  weight: "100 900",
  display: "swap",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});
const Mont_serrat = Montserrat({
  variable: "--font-montserrat",
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata = {
  title: {
    default: "Pec-Electrical-Dashboard | Pec-Electrical-Dashboard",
    template: "%s | Pec-Electrical-Dashboard",
  },
  description:
    " Pec-Electrical-Dashboard is the admin dashboard for managing bookings, services, and gallery of the Pec Electrical platform.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>

      <body
        className={`${generalSans.className} ${Mont_serrat.variable} box-border antialiased`}
      >
        <AntdRegistry>
          <ReduxProviders>
            <Toaster reverseOrder={false} />
            <Providers>{children}</Providers>
          </ReduxProviders>
        </AntdRegistry>
      </body>
    </html>
  );
}
