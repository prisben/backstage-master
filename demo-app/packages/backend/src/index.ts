/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */
import { myUserTransformer } from './extensions/microsoftGraphTransformer'; // <--- Import your file
import { microsoftGraphOrgEntityProviderTransformExtensionPoint } from '@backstage/plugin-catalog-backend-module-msgraph';
import { createBackendModule } from '@backstage/backend-plugin-api';
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// REGISTER THE CUSTOM TRANSFORMER
const customMicrosoftGraphModule = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'microsoft-graph-custom-transformer',
  register(reg) {
    reg.registerInit({
      deps: {
        microsoftGraph: microsoftGraphOrgEntityProviderTransformExtensionPoint,
      },
      async init({ microsoftGraph }) {
        // Tell Backstage to use YOUR logic instead of the default
        microsoftGraph.setUserTransformer(myUserTransformer);
      },
    });
  },
});

backend.add(customMicrosoftGraphModule);

backend.add(import('@backstage/plugin-app-backend'));
backend.add(import('@backstage/plugin-proxy-backend'));

// scaffolder plugin
backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-github'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-notifications'),
);
backend.add(import('@parfuemerie-douglas/scaffolder-backend-module-azure-pipelines'));
backend.add(import('@parfuemerie-douglas/scaffolder-backend-module-azure-repositories'))
// techdocs plugin
backend.add(import('@backstage/plugin-techdocs-backend'));

// auth plugin
backend.add(import('@backstage/plugin-auth-backend'));
// See https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
backend.add(import('@backstage/plugin-auth-backend-module-guest-provider'));
// See https://backstage.io/docs/auth/guest/provider
backend.add(import('@backstage/plugin-auth-backend-module-microsoft-provider'));
backend.add(import('@backstage/plugin-catalog-backend-module-msgraph'));

// catalog plugin
backend.add(import('@backstage/plugin-catalog-backend'));
backend.add(
  import('@backstage/plugin-catalog-backend-module-scaffolder-entity-model'),
);

//azure
backend.add(import('@backstage/plugin-catalog-backend-module-azure'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-azure'));

// See https://backstage.io/docs/features/software-catalog/configuration#subscribing-to-catalog-errors
backend.add(import('@backstage/plugin-catalog-backend-module-logs'));

// permission plugin
backend.add(import('@backstage/plugin-permission-backend'));
// See https://backstage.io/docs/permissions/getting-started for how to create your own permission policy
backend.add(
  import('@backstage/plugin-permission-backend-module-allow-all-policy'),
);

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

// search engine
// See https://backstage.io/docs/features/search/search-engines
backend.add(import('@backstage/plugin-search-backend-module-pg'));

// search collators
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));

// kubernetes plugin
backend.add(import('@backstage/plugin-kubernetes-backend'));

// notifications and signals plugins
backend.add(import('@backstage/plugin-notifications-backend'));
backend.add(import('@backstage/plugin-signals-backend'));

backend.start();
