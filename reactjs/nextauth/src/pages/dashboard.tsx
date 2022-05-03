import { useContext, useEffect } from 'react';
import type { NextPage } from 'next';

import { AuthContext } from '../contexts/AuthContext';
import { api } from '../services/api';
import styles from '../styles/Home.module.css';

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext);

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
    </div>
  );
};

export default Dashboard;
