import React from 'react';
import { render } from 'react-dom';

// START: test components to try rendering:
import TestJs from './TestJS.js';
// END: test components to try rendering

/**
 * Experiment to test MDX -> JSX transpilation through babel.
 *
 * Outputs MDXDocument, changing MDXDocument will cause webpack
 * to hot-reload with new contents.
 */

render(<TestJs />, document.getElementById('root'));
