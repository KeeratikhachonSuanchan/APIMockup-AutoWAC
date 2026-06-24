export const metadata = {
  title: "WAC Mockup API",
  icons: {
    icon: "/resources/images/api-management.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#fafafa" }}>{children}</body>
    </html>
  );
}
