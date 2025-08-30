const profileInfoElement = document.querySelector('.js-profile-information');

function renderEditProfile() {
  profileInfoElement.classList.add('is-editing-profile');

  const username = profileInfoElement.querySelector('.js-username-main').textContent;
  profileInfoElement.querySelector('.js-username-input').value = username;

  const descElement = profileInfoElement.querySelector('.js-description');
  const desc = descElement.textContent === "No description provided."
  ? ""
  : descElement.textContent;
  
  const descTextarea = profileInfoElement.querySelector('textarea');
  descTextarea.value = desc;


}

function renderProfileInfo(class_name) {
  profileInfoElement.classList.remove(class_name);
}

function renderDeleteProfile() {
  profileInfoElement.classList.add('is-deleting-profile');
}

document.querySelector('.js-edit-profile')
  .addEventListener('click', renderEditProfile);

document.querySelector('.js-cancel-editing')
  .addEventListener('click', () => renderProfileInfo('is-editing-profile'));

document.querySelector('.js-delete-profile')
  .addEventListener('click', renderDeleteProfile);

document.querySelector('.js-cancel-deleting')
  .addEventListener('click', () => renderProfileInfo('is-deleting-profile'))

const avatarInputElement = document.querySelector('.js-avatar-input');

document.querySelector('.js-avatar-btn')
  .addEventListener('click',() => avatarInputElement.click());

avatarInputElement.addEventListener('change', () => {
  avatarInputElement.closest('form').submit();
});