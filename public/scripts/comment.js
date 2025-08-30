async function deleteComment(post_id, comment_id) {
  const res = await fetch(`https://localhost:3000/delete/comment/${comment_id}?post_id=${post_id}`, {
    method: "DELETE"
  });

  if (res.ok) window.location.href = `/post/${post_id}/comments`;
}

async function likeComment(id, button) {
  const res = await fetch(`https://localhost:3000/like/comment/${id}`, {
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

document.querySelectorAll('.js-like-comment-btn').forEach(button => {
  button.addEventListener('click', () => {
    likeComment(button.closest('.js-comment').dataset.commentId, button);
  });
});

document.querySelectorAll('.js-delete-comment-btn').forEach(button => {
  button.addEventListener('click', () => {
    let confirmation = confirm("Are you sure to delete that comment?");
    if (confirmation) deleteComment(button.closest('.js-post').dataset.postId, button.closest('.js-comment').dataset.commentId);
  });
});