import type {FilterPattern, Plugin} from 'vite';
import {createFilter} from 'vite';
import {exec} from 'child_process';
import {promisify} from 'util';

const execPromise = promisify(exec);

export function sanityTypegen(options: {
  queriesPath: FilterPattern;
  schemaPath: FilterPattern;
}): Plugin {
  const queriesFilter = createFilter(options.queriesPath);
  const schemaFilter = createFilter(options.schemaPath);

  return {
    name: 'vite-plugin-sanity-typegen',

    handleHotUpdate({file}) {
      if (schemaFilter(file)) {
        return execPromise('npm run sanity:schema:extract')
          .then(({stdout, stderr}) => {
            if (stdout) console.log(stdout); // eslint-disable-line no-console
            if (stderr) console.error(stderr);
          })
          .catch((error) => {
            console.error(`Error executing script: ${error.message}`);
          });
      }

      if (queriesFilter(file)) {
        return execPromise('npm run sanity:typegen:generate')
          .then(({stdout, stderr}) => {
            if (stdout) console.log(stdout); // eslint-disable-line no-console
            if (stderr) console.error(stderr);
          })
          .catch((error) => {
            console.error(`Error executing script: ${error.message}`);
          });
      }
    },
  };
}
