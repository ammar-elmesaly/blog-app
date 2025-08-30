async function deletePost(id) {
  const res = await fetch(`https://localhost:3000/delete/post/${id}`, {
    method: "DELETE"
  });

  if (res.ok) window.location.href = '/';
}

async function likePost(id, button) {
  const res = await fetch(`https://localhost:3000/like/post/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const data = await res.json();
  const { isLiked, likesCount } = data;
  updateLikeElement(isLiked, likesCount, button);
}

function updateLikeElement(isLiked, likesCount, button) {
  if (isLiked)
    button.querySelector('.js-like-img').src = "/public/images/star-fill.png";

  else
    button.querySelector('.js-like-img').src = "/public/images/star.png";

  button.querySelector('.js-like-cnt').textContent = likesCount;
}


document.querySelectorAll('.js-delete-post-btn')
  .forEach(button => {
    button.addEventListener('click', () => {
      let confirmation = confirm("Are you sure to delete that post?");
      if (confirmation) deletePost(button.closest('.js-post').dataset.postId);
    });
  });

document.querySelectorAll('.js-like-btn').forEach(button => {
    button.addEventListener('click', () => {
      likePost(button.closest('.js-post').dataset.postId, button);
    });
  });

document.querySelectorAll('.js-comment-toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    const postId = button.closest('.js-post').dataset.postId;
    window.location.href = `/post/${postId}/comments/`;
  });
});