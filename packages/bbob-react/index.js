const React = require('react');
const PropTypes = require('prop-types');
const parse = require('@bbob/html');

class BBCode extends React.Component {
  content() {
    if (this.props.source) {
      // eslint-disable-next-line react/no-danger
      return <span dangerouslySetInnerHTML={{ __html: this.renderBBCode(this.props.source) }} />;
    }

    return React.Children.map(this.props.children, (child) => {
      if (typeof child === 'string') {
        // eslint-disable-next-line react/no-danger
        return <span dangerouslySetInnerHTML={{ __html: this.renderBBCode(child) }} />;
      }
      return child;
    });
  }

  renderBBCode(source) {
    return parse(source, this.props.options);
  }

  render() {
    const Container = this.props.container;

    return (<Container>{this.content()}</Container>);
  }
}

BBCode.propTypes = {
  container: PropTypes.node,
  children: PropTypes.element.isRequired,
  source: PropTypes.string,
  options: PropTypes.shape({
    prop: PropTypes.bool,
  }),
};

BBCode.defaultProps = {
  container: 'div',
  options: {},
  source: null,
};

module.exports = BBCode;
