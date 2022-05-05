import type { NextPage } from 'next';

import styles from '../styles/Home.module.css';
import { withSSRAuth } from '../utils/withSSRAuth';

const Metrics: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>Métricas</h1>
    </div>
  );
};

export default Metrics;

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    return {
      props: {},
    };
  },
  { permissions: ['metrics.list'], roles: ['administrator'] }
);
