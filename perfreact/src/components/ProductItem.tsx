interface ProductItemProps {
  product: {
    id: number;
    price: number;
    title: string
  }
}

const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div>
      {product.title} - <strong>{product.price}</strong>
    </div>
  );
}

export default ProductItem
