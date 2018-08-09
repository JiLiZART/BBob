const React = require('react');
const PropTypes = require('prop-types');
const core = require('@bbob/core');
const render = require('./render');

class Component extends React.Component {
  content() {
    return React.Children.map(this.props.children, (child) => {
      if (typeof child === 'string') {
        // eslint-disable-next-line react/no-danger
        return render(this.renderBBCodeToAST(child));
      }
      return child;
    });
  }

  renderBBCodeToAST(source) {
    return core(this.props.plugins).process(source).tree;
  }

  render() {
    const Container = this.props.container;

    return (<Container>{this.content()}</Container>);
  }
}

Component.propTypes = {
  container: PropTypes.node,
  children: PropTypes.node.isRequired,
  plugins: PropTypes.arrayOf(Function),
};

Component.defaultProps = {
  container: 'span',
  plugins: [],
};

module.exports = Component;
