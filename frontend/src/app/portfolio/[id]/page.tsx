import PublicPortfolioView from './PublicPortfolioView';

export function generateStaticParams() {
  return [{ id: 'preview' }];
}

export default function Page() {
  return <PublicPortfolioView />;
}
