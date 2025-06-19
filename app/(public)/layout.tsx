export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-[100dvh] responsiveFooter">{children}</div>;
}
