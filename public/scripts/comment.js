async function deleteComment(postId, commentId) {
  const res = await fetch(`/post/${postId}/comment/${commentId}/delete`, {
    method: "DELETE"
  });

  if (res.ok) window.location.href = `/post/${postId}/comments`;
}

async function likeComment(commentId, postId, button) {
  const res = await fetch(`/post/${postId}/comment/${commentId}/like`, {
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
    likeComment(
      button.closest('.js-comment').dataset.commentId,
      button.closest('.js-post').dataset.postId,
      button
    );
  });
});

document.querySelectorAll('.js-delete-comment-btn').forEach(button => {
  button.addEventListener('click', () => {
    let confirmation = confirm("Are you sure to delete that comment?");
    if (confirmation) deleteComment(button.closest('.js-post').dataset.postId, button.closest('.js-comment').dataset.commentId);
  });
});