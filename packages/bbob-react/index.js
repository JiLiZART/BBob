const React = require('react');
const parse = require('bbob-html');

class BBCode extends React.Component {
  render() {
    const Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    );
  }

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderBBCode(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderBBCode(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  }

  renderBBCode(source) {
    return parse(source)
  }
}

BBCode.defaultProps = {
  container: 'div',
  options: {},
};

module.exports = BBCode;