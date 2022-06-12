import { render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';

import { getPrismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts';

jest.mock('../../services/prismic');

const posts = [
  {
    slug: 'my-new-post',
    title: 'My New Post',
    excerpt: 'This is my new post',
    updatedAt: '01 de abril de 2022',
  },
];

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />);

    expect(screen.getByText(posts[0].title)).toBeInTheDocument();
  });

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValue({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: posts[0].slug,
            data: {
              title: [{ type: 'heading', text: posts[0].title }],
              content: [{ type: 'paragraph', text: posts[0].excerpt }],
            },
            last_publication_date: '04-01-2022',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: { posts },
      })
    );
  });
});
