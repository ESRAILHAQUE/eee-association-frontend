import ClientLayout from '../Components/Shared/ClientLayout';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}
