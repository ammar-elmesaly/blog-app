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
    button.querySelector('.like-img').src = "/public/images/star-fill.png";

  else
    button.querySelector('.like-img').src = "/public/images/star.png";

  button.querySelector('.like-cnt').textContent = likesCount;
}


document.querySelectorAll('.delete-post-btn')
  .forEach(button => {
    button.addEventListener('click', () => {
      let confirmation = confirm("Are you sure to delete that post?");
      if (confirmation) deletePost(button.closest('.post').dataset.postId);
    });
  });

document.querySelectorAll('.like-btn').forEach(button => {
    button.addEventListener('click', () => {
      likePost(button.closest('.post').dataset.postId, button);
    });
  });

document.querySelectorAll('.comment-toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    const postId = button.closest('.post').dataset.postId;
    window.location.href = `/post/${postId}/comments/`;
  });
});