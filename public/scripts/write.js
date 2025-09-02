const photoInput = document.querySelector('.js-photo');
const photoPreview = document.querySelector('.js-photo-preview');
const clearPhotoBtn = document.querySelector('.js-clear-photo');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.classList.remove('js-hidden');
      clearPhotoBtn.classList.remove('js-hidden');
    };
    reader.readAsDataURL(file);
  } else {
    photoPreview.src = '';
    photoPreview.classList.add('js-hidden');
    clearPhotoBtn.classList.add('js-hidden');
  }
});

clearPhotoBtn.addEventListener('click', () => {
  document.querySelector('#photo').value = '';
  document.querySelector('#photoStatus').value = 'not_uploaded';
  photoPreview.classList.add('js-hidden');
  clearPhotoBtn.classList.add('js-hidden');
});
