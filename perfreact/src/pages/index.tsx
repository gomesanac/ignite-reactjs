import type { NextPage } from 'next';
import { FormEvent, useCallback, useState } from 'react';
import SearchResults from '../components/SearchResults';

type Results = {
  data: any[];
  totalPrice: number;
};

const Home: NextPage = () => {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Results>({ totalPrice: 0, data: [] });

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    const products = data.map((product: any) => ({
      ...product,
      priceFormatted: formatter.format(product.price),
    }));

    const totalPrice = data.reduce(
      (total: number, { price }: any) => total + price,
      0
    );

    setResults({ data: products, totalPrice });
  };

  const onAddToWishList = useCallback(async (id: number) => {
    console.log(id);
  }, []);

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      <SearchResults
        results={results.data}
        totalPrice={results.totalPrice}
        onAddToWishList={onAddToWishList}
      />
    </div>
  );
};

export default Home;
