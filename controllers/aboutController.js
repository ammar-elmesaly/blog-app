function getAboutPage (req, res) {
  res.render('pages/about.pug', {
    currentPage: 'about'
  });
}

module.exports = {
  getAboutPage
}