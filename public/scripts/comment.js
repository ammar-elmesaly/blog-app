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
    button.querySelector('.like-img').src = "/public/images/star-fill.png";

  else
    button.querySelector('.like-img').src = "/public/images/star.png";

  button.querySelector('.like-cnt').textContent = likesCount;
}

document.querySelectorAll('.like-comment-btn').forEach(button => {
  button.addEventListener('click', () => {
    likeComment(button.closest('.comment').dataset.commentId, button);
  });
});

document.querySelectorAll('.delete-comment-btn').forEach(button => {
  button.addEventListener('click', () => {
    let confirmation = confirm("Are you sure to delete that comment?");
    if (confirmation) deleteComment(button.closest('.post').dataset.postId, button.closest('.comment').dataset.commentId);
  });
});