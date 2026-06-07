import ProductDetailsClient from "./ProductDetailsClient";

export function generateStaticParams() {
  return [{ id: '1' }];
}

export default function Page() {
  return <ProductDetailsClient />;
}
