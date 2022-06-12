import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { getSession, useSession } from 'next-auth/client';

import { getPrismicClient } from '../../services/prismic';
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { useRouter } from 'next/router';

jest.mock('next-auth/client');
jest.mock('next/router');
jest.mock('../../services/prismic');

const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>This is my new post</p>',
  updatedAt: '01 de abril de 2022',
};

describe('PostPreview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<PostPreview post={post} />);

    expect(screen.getByText(post.title)).toBeInTheDocument();
    expect(screen.getByText('This is my new post')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when authenticated', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' },
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({ push: pushMock } as any);

    render(<PostPreview post={post} />);

    expect(pushMock).toHaveBeenCalledWith(`/posts/${post.slug}`);
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValue({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: post.title }],
          content: [{ type: 'paragraph', text: 'This is my new post' }],
        },
        last_publication_date: '04-01-2022',
      }),
    } as any);

    const response = await getStaticProps({
      params: { slug: post.slug },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: { post },
      })
    );
  });
});
