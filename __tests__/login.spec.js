const { getLoginPage } = require('../controllers/loginController');

describe('Get login page', () => {
  it('renders the login page', async () => {

    const mockReq = {};
    const mockRes = {
      render: jest.fn()
    };

    await getLoginPage(mockReq, mockRes);

    expect(mockRes.render).toHaveBeenCalledWith('pages/login', {currentPage: 'login'})
  });
});

// describe('Login the user', () => {
//   it('logs the user in', () => {
//     const mockReq = {user: {
//       _id: 'hello'
//     }};
//     const mockRes = {
//       render: jest.fn()
//     };
//   });
// });