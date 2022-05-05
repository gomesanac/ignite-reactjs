import { useContext, useEffect } from 'react';
import type { NextPage } from 'next';

import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/apiClient';
import styles from '../styles/Home.module.css';
import { withSSRAuth } from '../utils/withSSRAuth';
import { setupAPIClient } from '../services/api';
import { useCan } from '../hooks/useCan';

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext);

  const useCanSeeMetrics = useCan({ permissions: ['metrics.list'] });

  useEffect(() => {
    api
      .get('/me')
      .then((response) => {
        console.log(response);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.container}>
      <h1>Dashboard: {user?.email}</h1>
      {useCanSeeMetrics && <div>Métricas</div>}
    </div>
  );
};

export default Dashboard;

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  const response = await apiClient.get('/me');

  console.log(response);

  return {
    props: {},
  };
});
