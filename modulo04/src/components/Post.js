import React from 'react';
import PropTypes from 'prop-types';

function Post({post, onDelete}) {
  return(
    <li >
          {post}
          <button onClick={onDelete}
          type="button"
          >Remover
          </button>
          </li>
  );
}

Post.defaultProps = {
  post:'Oculto',
};

Post.propTypes = {
  post: PropTypes.string,
  onDelete: PropTypes.func.isRequired
}

export default Post;