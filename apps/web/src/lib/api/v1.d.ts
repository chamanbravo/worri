/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/users/{username}/": {
    get: operations["users_retrieve"];
    patch: operations["users_partial_update"];
  };
  "/api/users/current/": {
    get: operations["users_current_retrieve"];
  };
  "/api/users/login/": {
    post: operations["users_login_create"];
  };
  "/api/users/register/": {
    post: operations["users_register_create"];
  };
  "/api/users/setup/": {
    get: operations["users_setup_retrieve"];
  };
  "/api/websites/{id}/": {
    get: operations["websites_retrieve"];
    patch: operations["websites_partial_update"];
  };
  "/api/workspaces/{name}/": {
    get: operations["workspaces_retrieve"];
    patch: operations["workspaces_partial_update"];
  };
  "/api/workspaces/{name}/members/": {
    get: operations["workspaces_members_retrieve"];
  };
  "/api/workspaces/{name}/websites/": {
    get: operations["workspaces_websites_retrieve"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    GenericOut: {
      detail: string;
    };
    NeedSetupOut: {
      need_setup: boolean;
    };
    PatchedWebsiteOutRequest: {
      name?: string;
      domain?: string;
      created_by?: string;
    };
    PatchedWorkspaceMemberOutRequest: {
      username?: string;
      role?: components["schemas"]["RoleEnum"];
      /** Format: date-time */
      date_joined?: string;
    };
    PatchedWorkspaceOutRequest: {
      name?: string;
      access_code?: string;
    };
    RegisterErrorOut: {
      detail: string;
      username: string[];
      email: string[];
      password: string[];
    };
    /**
     * @description * `ADMIN` - ADMIN
     * * `EDITOR` - EDITOR
     * * `VIEWER` - VIEWER
     * @enum {string}
     */
    RoleEnum: "ADMIN" | "EDITOR" | "VIEWER";
    UserLoginInRequest: {
      username: string;
      password: string;
    };
    UserOut: {
      id: number;
      first_name?: string;
      last_name?: string;
      username: string;
      /** Format: email */
      email: string;
      role: components["schemas"]["RoleEnum"];
      workspace: readonly string[];
    };
    UserRegisterInRequest: {
      username: string;
      /** Format: email */
      email: string;
      password: string;
    };
    WebsiteOut: {
      id: number;
      name: string;
      domain: string;
      created_by: string;
    };
    WebsitesListOut: {
      websites: components["schemas"]["WebsiteOut"][];
    };
    WorkspaceMemberOut: {
      id: number;
      username: string;
      role: components["schemas"]["RoleEnum"];
      /** Format: date-time */
      date_joined?: string;
    };
    WorkspaceMembersListOut: {
      members: components["schemas"]["WorkspaceMemberOut"][];
    };
    WorkspaceOut: {
      name: string;
      access_code: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  users_retrieve: {
    parameters: {
      path: {
        username: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WorkspaceMemberOut"];
        };
      };
    };
  };
  users_partial_update: {
    parameters: {
      path: {
        username: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["PatchedWorkspaceMemberOutRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WorkspaceMemberOut"];
        };
      };
    };
  };
  users_current_retrieve: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["UserOut"];
        };
      };
    };
  };
  users_login_create: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserLoginInRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["UserOut"];
        };
      };
      400: {
        content: {
          "application/json": components["schemas"]["GenericOut"];
        };
      };
    };
  };
  users_register_create: {
    requestBody: {
      content: {
        "application/json": components["schemas"]["UserRegisterInRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["GenericOut"];
        };
      };
      400: {
        content: {
          "application/json": components["schemas"]["RegisterErrorOut"];
        };
      };
    };
  };
  users_setup_retrieve: {
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["NeedSetupOut"];
        };
      };
    };
  };
  websites_retrieve: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this website. */
        id: number;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WebsiteOut"];
        };
      };
    };
  };
  websites_partial_update: {
    parameters: {
      path: {
        /** @description A unique integer value identifying this website. */
        id: number;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["PatchedWebsiteOutRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WebsiteOut"];
        };
      };
    };
  };
  workspaces_retrieve: {
    parameters: {
      path: {
        name: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WorkspaceOut"];
        };
      };
    };
  };
  workspaces_partial_update: {
    parameters: {
      path: {
        name: string;
      };
    };
    requestBody?: {
      content: {
        "application/json": components["schemas"]["PatchedWorkspaceOutRequest"];
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WorkspaceOut"];
        };
      };
    };
  };
  workspaces_members_retrieve: {
    parameters: {
      path: {
        name: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WorkspaceMembersListOut"];
        };
      };
    };
  };
  workspaces_websites_retrieve: {
    parameters: {
      path: {
        name: string;
      };
    };
    responses: {
      200: {
        content: {
          "application/json": components["schemas"]["WebsitesListOut"];
        };
      };
    };
  };
}
