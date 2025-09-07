const { postEditUpdate } = require('../controllers/editController');
const ObjectId = require('mongoose').Types.ObjectId;

const postService = require('../services/postService');
jest.mock('../services/postService');

describe('postEditUpdate', () => {

  const postId = new ObjectId();
  const mockReq = {
    body: {
      title: "test",
      content: "Lorem Ipsum",
      photoStatus: "not_uploaded"
    },

    params: {
      post_id: postId
    },

    file: undefined
  };

  const mockRes = {
    redirect: jest.fn()
  }

  it('should update the post without photo', async () => {
    await postEditUpdate(mockReq, mockRes);

    expect(postService.updatePost).toHaveBeenCalledWith(postId, {
      title: "test",
      content: "Lorem Ipsum",
      photoURL: null
    });

    expect(mockRes.redirect).toHaveBeenCalledWith('/');
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
  });

  it('should update the post with uploaded photo', async () => {

    const mockReqCopy = {
      ...mockReq,
      body: {
        ...mockReq.body,
        photoStatus: "uploaded"
      },
      file: {path: "test.png"}
    }
    await postEditUpdate(mockReqCopy, mockRes);

    expect(postService.updatePost).toHaveBeenCalledWith(postId, {
      title: "test",
      content: "Lorem Ipsum",
      photoURL: '/test.png'
    });

    expect(mockRes.redirect).toHaveBeenCalledWith('/');
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
  });

  it('should do not include photoURL if older photo is uploaded, and file is undefined', async () => {
    const mockReqCopy = {
      ...mockReq,
      body: {
        ...mockReq.body,
        photoStatus: "uploaded"
      },
      file: undefined
    }

    await postEditUpdate(mockReqCopy, mockRes);

    expect(postService.updatePost).toHaveBeenCalledWith(postId, {
      title: "test",
      content: "Lorem Ipsum",
    });

    expect(mockRes.redirect).toHaveBeenCalledWith('/');
    expect(mockRes.redirect).toHaveBeenCalledTimes(1);
  });
});