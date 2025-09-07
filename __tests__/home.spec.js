const postService = require('../services/postService');
const { getHomePage, deletePost, likePost } = require('../controllers/homeController');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

jest.mock('../services/postService');

describe('getHomePage', () => {
  it('renders home page with mapped posts', async () => {
    const mockPosts = [
      {
        _id: '1',
        author: {_id: '123'},
        title: 'Hello and Welcome',
        content: 'Hi',
        date: new Date(Date.now() - 1000 * 60), // 1 min ago
        photoURL: 'path/to/photo',
        likesAuthors: ['123', '456'],
        comments: [{}]
      }
    ];

    postService.getPosts.mockResolvedValue(mockPosts);

    const req = {
      session: { user: { _id: '123', avatarSrc: '/me.png' } }
    };

    const res = {
      render: jest.fn()
    };

    await getHomePage(req, res);

    // check if res.render was called correctly
    expect(res.render).toHaveBeenCalledWith('pages/home', expect.objectContaining({
      currentPage: 'home',
      avatarSrc: '/me.png',
      posts: expect.arrayContaining([
        expect.objectContaining({
          dateFormatted: expect.any(String),
          isAuthor: true,
          likesCount: 2,
          commentsCount: 1,
          isLiked: true
        })
      ])
    }));
  });
});

describe('deletePost', () => {

  const postId1 = new ObjectId();
  const authorId1 = new ObjectId();

  const postId2 = new ObjectId();
  const authorId2 = new ObjectId();
  
  const mockReq = {
    session: {
      user: { _id: authorId1, avatarSrc: '/me.png' },
    },
    params: {post_id: postId1.toString()}
  };

  const mockRes = {
    sendStatus: jest.fn()
  };
    
  beforeAll(() => {
    const mockPosts = [
      {
        _id: postId1,
        author: authorId1,
        title: 'Hello and Welcome',
        content: 'Hi',
        date: new Date(Date.now() - 1000 * 60), // 1 min ago
        photoURL: 'path/to/photo',
        likesAuthors: ['123', '456'],
        comments: [{}]
      },

      {
        _id: postId2,
        author: authorId2,
        title: 'Lorem Ipsum Dolor',
        content: 'Hi 2 2 2',
        date: new Date(Date.now() - 1000 * 60), // 1 min ago
        photoURL: 'path/to/photo',
        likesAuthors: ['123', '456', '789'],
        comments: [{}]
      },
    ];

    postService.getPosts.mockResolvedValue(mockPosts);

    postService.getPost.mockImplementation(async (postId) => {
      return mockPosts.find(post => post._id.toString() === postId.toString());
    });

    postService.deletePost.mockImplementation(async (postId) => {
      const index = mockPosts.findIndex(post => post._id.toString() === postId.toString());

      if (index > -1) {
        mockPosts.splice(index, 1);
      }
    });

  });

  it('returns 401 if you are not author', async () => {

    const copyMockReq = {
      ...mockReq,
      session: {
        user: {_id: 'unauthorized', avatarSrc: 'me.png'}
      }
    }

    await deletePost(copyMockReq, mockRes);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(401);
  });

  it('returns 404 if post is not found', async () => {
    const copyMockReq = {
      ...mockReq,
      params: {post_id: (new ObjectId()).toString()}
    };

    const mockRes = {
      sendStatus: jest.fn()
    };
    
    await deletePost(copyMockReq, mockRes);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(404);
  });

  it('returns 200 if you are author and deletes post', async () => {

    await deletePost(mockReq, mockRes);

    expect(mockRes.sendStatus).toHaveBeenCalledWith(200);

    const posts = await postService.getPosts();

    expect(posts.length).toEqual(1);
    expect(posts[0]._id).toEqual(postId2);
  });

});

describe('likePost', () => {
  const postId = new ObjectId();
  const authorId = new ObjectId();
  const liker1 = new ObjectId();

  const mockReq = {
    params: {
      post_id: postId
    },

    session: {
      user: {_id: liker1}
    }
  };

  const mockRes = {
    sendStatus: jest.fn(),
    status: jest.fn(() => mockRes),
    json: jest.fn(),

  };

  let mockPost = {
    _id: postId,
    author: {_id: authorId},
    title: 'Hello and Welcome',
    content: 'Hi',
    date: new Date(Date.now() - 1000 * 60),
    photoURL: 'path/to/photo',
    likesAuthors: [],
    comments: [{}]
  }

  beforeAll(() => {

    postService.getPost.mockResolvedValue(mockPost);
  
    postService.likePost.mockImplementation(async (postId, userId, remove) => {
      if (remove) {
  
        const index = mockPost.likesAuthors.find(user => user._id.toString() === userId.toString());
        const newPost = {
          ...mockPost,
          likesAuthors: mockPost.likesAuthors.splice(index, 1)
        }
  
        mockPost = newPost;
  
        return newPost;
      } 
  
      const newLikesAuthors = mockPost.likesAuthors;
      newLikesAuthors.push(userId);
  
      const newPost = {
        ...mockPost,
        likesAuthors: newLikesAuthors
      }
  
      mockPost = newPost;
  
      return newPost;
    })
  });

  it('should like the post', async () => {
    await likePost(mockReq, mockRes);

    const post = await postService.getPost(postId);

    expect(post.likesAuthors.includes(liker1)).toEqual(true);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should unlike the post', async () => {
    await likePost(mockReq, mockRes);

    const post = await postService.getPost(postId);

    expect(post.likesAuthors.includes(liker1)).toEqual(false);
    expect(mockRes.status).toHaveBeenCalledWith(200);
  });
});