import { memo } from 'react';

interface ProductItemProps {
  product: {
    id: number;
    title: string;
    price: number;
    priceFormatted: string;
  };
  onAddToWishList: (id: number) => void;
}

const ProductItem = ({ product, onAddToWishList }: ProductItemProps) => {
  return (
    <div>
      {product.title} - <strong>{product.priceFormatted}</strong>
      <button onClick={() => onAddToWishList(product.id)}>
        Add to wishlits
      </button>
    </div>
  );
};

export default memo(ProductItem, (prevProps, nextProps) => {
  return Object.is(prevProps.product, nextProps.product);
});
