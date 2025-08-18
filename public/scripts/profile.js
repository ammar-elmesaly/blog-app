function renderEditProfile() {
  const profileInfoElement = document.querySelector('.profile-information');
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

function renderProfileInfo() {
  const profileInfoElement = document.querySelector('.profile-information');
  profileInfoElement.classList.remove('is-editing-profile');
}

document.querySelector('.edit-profile')
  .addEventListener('click', renderEditProfile);

document.querySelector('.cancel-editing')
  .addEventListener('click', renderProfileInfo);