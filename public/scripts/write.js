const photoInput = document.querySelector('#photo');
const photoPreview = document.querySelector('#photo-preview');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.src = e.target.result;
      photoPreview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  } else {
    photoPreview.src = '';
    photoPreview.classList.add('hidden');
  }
});