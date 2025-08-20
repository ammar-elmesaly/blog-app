const profileInfoElement = document.querySelector('.profile-information');

function renderEditProfile() {
  profileInfoElement.classList.add('is-editing-profile');

  const username = profileInfoElement.querySelector('.username-main').textContent;
  profileInfoElement.querySelector('.username-input').value = username;

  const descElement = profileInfoElement.querySelector('.description');
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

document.querySelector('.edit-profile')
  .addEventListener('click', renderEditProfile);

document.querySelector('.cancel-editing')
  .addEventListener('click', () => renderProfileInfo('is-editing-profile'));

document.querySelector('.delete-profile')
  .addEventListener('click', renderDeleteProfile);

document.querySelector('.cancel-deleting')
  .addEventListener('click', () => renderProfileInfo('is-deleting-profile'))

const avatarInputElement = document.querySelector('#avatar-input');

document.querySelector('#avatar-btn')
  .addEventListener('click',() => avatarInputElement.click());

avatarInputElement.addEventListener('change', () => {
  avatarInputElement.closest('form').submit();
});