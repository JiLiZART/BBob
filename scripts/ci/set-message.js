const dedent = require('dedent');

module.exports = async function setMessage({
  header,
  body,
  prNumber,
  repo,
  github,
}) {
  const commentList = await github.paginate(
    'GET /repos/:owner/:repo/issues/:issue_number/comments',
    {
      ...repo,
      issue_number: prNumber,
    },
  );

  const commentBody = dedent`
    ${header}

    ${body}
  `;

  const comment = commentList.find((comment) => comment.body.startsWith(header));

  if (!comment) {
    await github.rest.issues.createComment({
      ...repo,
      issue_number: prNumber,
      body: commentBody,
    });
  } else {
    await github.rest.issues.updateComment({
      ...repo,
      comment_id: comment.id,
      body: commentBody,
    });
  }
};
