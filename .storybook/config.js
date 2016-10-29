import { configure } from '@kadira/storybook';

function loadStories() {
  // require all **/*.story.js files
  const testsContext = require.context('../src', true, /\.story\.jsx?$/);
  testsContext.keys().forEach(testsContext);
}

configure(loadStories, module);
