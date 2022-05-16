import { memo } from 'react';

interface ProductItemProps {
  product: {
    id: number;
    price: number;
    title: string;
  };
}

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div>
      {product.title} - <strong>{product.price}</strong>
    </div>
  );
};

export default memo(ProductItem, (prevProps, nextProps) => {
  return Object.is(prevProps.product, nextProps.product);
});
