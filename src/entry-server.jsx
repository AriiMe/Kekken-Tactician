import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter } from 'react-router-dom/server';
import { Helmet } from 'react-helmet';
import App from './App';
import { CombinedProvider } from './context/CombinedProvider';
import { PageDataContext } from './context/PageDataContext';

export async function render(path, data) {
  const html = await new Promise((resolve, reject) => {
    const output = new PassThrough();
    let content = '';
    output.on('data', chunk => { content += chunk; });
    output.on('end', () => resolve(content));
    output.on('error', reject);
    const stream = renderToPipeableStream(
      <StaticRouter location={path}><PageDataContext.Provider value={{ path, data }}><CombinedProvider><App /></CombinedProvider></PageDataContext.Provider></StaticRouter>,
      { onAllReady() { stream.pipe(output); }, onError: reject },
    );
  });
  const head = Helmet.renderStatic();
  return { html, head: `${head.title}${head.meta}${head.link}${head.script}` };
}
