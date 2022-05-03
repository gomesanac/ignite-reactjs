import axios, { AxiosError, AxiosResponse } from 'axios';
import { parseCookies, setCookie } from 'nookies';
import { signOut } from '../contexts/AuthContext';

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue: {
  onSuccess: (token: string) => void;
  onFailure: (err: AxiosError<unknown, any>) => void;
}[] = [];

export const api = axios.create({
  baseURL: 'http://localhost:3333',
});

api.defaults.headers.common[
  'Authorization'
] = `Bearer ${cookies['nextauth.token']}`;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.response?.data?.code === 'token.expired') {
        cookies = parseCookies();

        const { 'nextauth.refreshToken': refreshToken } = cookies;

        const orifinalConfig = error.config;

        if (!isRefreshing) {
          isRefreshing = true;

          api
            .post('/refresh', { refreshToken })
            .then((response) => {
              const { token } = response.data;

              setCookie(undefined, 'nextauth.token', token, {
                masAge: 60 * 60 * 24 * 30, // 30 dias
                path: '/',
              });

              setCookie(
                undefined,
                'nextauth.refreshToken',
                response.data.refreshToken,
                {
                  masAge: 60 * 60 * 24 * 30, // 30 dias
                  path: '/',
                }
              );

              api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

              failedRequestQueue.forEach((request) => request.onSuccess(token));
              failedRequestQueue = [];
            })
            .catch((err) => {
              failedRequestQueue.forEach((request) => request.onFailure(err));
              failedRequestQueue = [];
            })
            .finally(() => {
              isRefreshing = false;
            });
        }

        return new Promise((resolve, reject) => {
          failedRequestQueue.push({
            onSuccess: (token: string) => {
              orifinalConfig.headers['Authorization'] = `Bearer ${token}`;
              resolve(api(orifinalConfig));
            },
            onFailure: (err: AxiosError) => {
              reject(err);
            },
          });
        });
      } else {
        signOut();
      }
    }

    return Promise.reject(error);
  }
);
