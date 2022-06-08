import { List, ListRowRenderer } from 'react-virtualized';

import ProductItem from './ProductItem';

interface SearchResultsProps {
  results: Array<{
    id: number;
    price: number;
    priceFormatted: string;
    title: string;
  }>;
  totalPrice: number;
  onAddToWishList: (id: number) => void;
}

const SearchResults = ({
  results,
  totalPrice,
  onAddToWishList,
}: SearchResultsProps) => {
  const rowRenderer: ListRowRenderer = ({ index, key, style }) => (
    <div key={key} style={style}>
      <ProductItem product={results[index]} onAddToWishList={onAddToWishList} />
    </div>
  );

  return (
    <div>
      <h2>{totalPrice}</h2>

      <List
        height={300}
        rowHeight={30}
        width={900}
        overscanRowCount={5}
        rowCount={results.length}
        rowRenderer={rowRenderer}
      />
    </div>
  );
};

export default SearchResults;
