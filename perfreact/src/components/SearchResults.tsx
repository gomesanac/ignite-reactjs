import { useMemo } from 'react';
import ProductItem from './ProductItem';

interface SearchResultsProps {
  results: Array<{ id: number; price: number; title: string }>;
}

const SearchResults = ({ results }: SearchResultsProps) => {
  const totalPrice = useMemo(
    () => results.reduce((total, { price }) => total + price, 0),
    [results]
  );

  return (
    <div>
      <h2>{totalPrice}</h2>

      {results.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default SearchResults;
