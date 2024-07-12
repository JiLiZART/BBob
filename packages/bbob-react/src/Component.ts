import React, { ReactNode } from 'react';
import type { BBobPlugins, BBobCoreOptions } from '@bbob/types';

import { render } from './render';

const content = (children: ReactNode, plugins?: BBobPlugins, options?: BBobCoreOptions) =>
    React.Children.map(children,
        (child) => {
          if (typeof child === 'string') {
            return render(child, plugins, options)
          }

          return child
        }
    );

export type BBobReactComponentProps = {
  children: ReactNode
  container?: string
  componentProps?: Record<string, unknown>
  plugins?: BBobPlugins
  options?: BBobCoreOptions
}

const Component = ({
  container = 'span',
  componentProps = {},
  children,
  plugins = [],
  options = {},
}: BBobReactComponentProps): React.JSX.Element => React.createElement(
  container,
  componentProps,
  content(children, plugins, options),
);

Component.defaultProps = {
  container: 'span',
  plugins: [],
  options: {},
  componentProps: {},
};

export default Component;
