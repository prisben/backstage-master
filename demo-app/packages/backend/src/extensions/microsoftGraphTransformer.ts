// packages/backend/src/extensions/microsoftGraphTransformer.ts
import {
    normalizeEntityName,
  } from '@backstage/plugin-catalog-backend-module-msgraph';
  import { UserEntity } from '@backstage/catalog-model';
  import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';
  
  export async function myUserTransformer(
    user: MicrosoftGraph.User,
  ): Promise<UserEntity | undefined> {
    // 1. Get the name (try mailNickname first, then mail, then UPN)
    // mailNickname is usually shorter (e.g. 'priscilla.benedetti_outlo...')
    let name = user.mailNickname || user.mail?.split('@')[0] || user.userPrincipalName?.split('@')[0];
  
    // 2. Sanitize it (remove special chars)
    name = normalizeEntityName(name!);
  
    // 3. Enforce 63 char limit strictly
    if (name.length > 63) {
      // If still too long, take first 50 chars + hash of the full string to keep it unique
      // Simple fallback: just truncate (for dev) or use a hash function if you have one
      name = name.substring(0, 63); 
    }
  
    // 4. Return the Entity
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'User',
      metadata: {
        name: name,
        annotations: {
          // KEEP THIS! It's how the auth resolver finds you
          'graph.microsoft.com/user-id': user.id!,
          'graph.microsoft.com/user-principal-name': user.userPrincipalName!,
        },
      },
      spec: {
        profile: {
          displayName: user.displayName || name,
          email: user.mail || user.userPrincipalName || undefined,
        },
        memberOf: [],
      },
    };
  }