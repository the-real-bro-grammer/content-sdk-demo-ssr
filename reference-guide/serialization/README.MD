# Sitecore CLI Serialization Guide

This guide explains how our IDKSitecore module uses Sitecore CLI serialization, how to authenticate
against different XM Cloud environments, and how to move serialized items between them. It draws on
the Sitecore CLI documentation and the Fishtank walkthrough for XM Cloud serialization. Refer to the
following articles for deeper dives:

-   Sitecore Documentation -
    [The CLI serialization command](https://doc.sitecore.com/xp/en/developers/100/developer-tools/the-cli-serialization-command.html)
-   Fishtank -
    [How to Add New Items to Your XM Cloud Serialization](https://www.getfishtank.com/insights/how-to-add-new-items-to-your-xm-cloud-serialization)

## Prerequisites

-   .NET SDK 6.0 or later installed (`dotnet --version` to verify).
-   Access to the XM Cloud organization with permissions to pull/push serialized items.
-   A client ID/secret pair (or device login access) issued from the XM Cloud Deploy portal.
-   This repository cloned locally with the `.sitecore` configuration folder intact.

## Install or Update the Sitecore CLI

1. Open a terminal in the repository root (`c:\Projects\robert-xm-cloud-demo`).
2. Install the global tool (run update if already present):

    ```powershell
    dotnet tool install --global sitecore.cli
    dotnet tool update --global sitecore.cli
    ```

3. Close and reopen the terminal if the `dotnet-sitecore` executable is not yet on your `PATH`.

> Tip: Use `dotnet sitecore --help` to confirm the CLI is available.

## Understand `.sitecore/user.json`

The file `.sitecore/user.json` captures authenticated environments. Key points you should know
before logging in:

-   **`endpoints`**: Named environments such as `xmCloud`, `dev`, and `qa`. Child endpoints can
    `ref` a base endpoint to reuse settings.
-   **`allowWrite`**: Must be `true` on the environment you plan to push to. The shared `xmCloud`
    endpoint stores the API audience, authority, and client ID and should remain `allowWrite: false`
    for safety.
-   **`host`**: The CM URL that the CLI will communicate with. Examples include the dev and QA hosts
    already registered.
-   **Tokens**: The file contains refresh tokens; treat it as a secret and avoid sharing it outside
    of source control policies.

When you run `dotnet sitecore login` the CLI updates this file automatically, so you rarely need to
edit it manually.

## Log In and Register an Environment

1. Make sure you have the client secret (if using confidential client flow) or the ability to
   complete the device login flow provided by XM Cloud Deploy.
2. Register/login to an environment using the details from `.sitecore/user.json`. For example, to
   authenticate against the shared XM Cloud authority:

    ```powershell
    dotnet sitecore cloud login
    ```

    This stores tokens under the `xmCloud` endpoint.

3. Register child environments that inherit from `xmCloud` (such as the existing `dev` and `qa`
   entries) by reusing the reference and specifying their CM hosts:

    ```powershell
    #local
    dotnet sitecore connect --ref xmcloud --cm https://xmcloudcm.localhost --allow-write true -n local

    #dev
    sitecore cloud environment connect --allow-write --environment-id {your-environment-id}
    ```

4. List available contexts and set the one you want to operate against:

    ```powershell
    dotnet sitecore cloud environment list --project-id {your-project-id}
    ```

5. Test connectivity:

    ```powershell
    sitecore cloud environment health --environment-id {your-environment-id}
    ```

    A successful response confirms the CLI can talk to the CM instance.

## Serialization Modules in This Repo

The IDK-Sitecore module definition (`authoring/items/idksitecore.module.json`) controls which
Sitecore items are serialized. Each `include` entry has a `scope` and optional
`allowedPushOperations`.

### Scope Options Used

| Scope value          | Applies to                                                                          | Meaning in practice                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `SingleItem`         | `Content.IDKSitecore`                                                               | Serialize only the specific item, no children. Useful for root items that are further refined by rules.                                                      |
| `ItemAndChildren`    | Media libraries (`Media.Feature`, `Media.Project`), `Settings` groupings            | Includes the item and its immediate children. Keeps branch structure shallow while excluding deeper descendants.                                             |
| `ItemAndDescendants` | Template trees, script library, renderings, placeholder settings, most site content | Includes the item and every descendant beneath it. Use for hierarchies where deep structures must stay synchronized.                                         |
| `DescendantsOnly`    | `Content.IDKSitecore.Settings.SiteGrouping`                                         | Serializes only descendants, excluding the root item defined in the `path`. Useful when the root is managed elsewhere but its children belong to the module. |

### Allowed Push Operations

| Value                   | Effect                                                                                                                                                                                                                                              |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createUpdateAndDelete` | Full control. The CLI may create missing items, update existing items, and delete items that exist in the target but not in the serialized tree. Use with caution and typically only when you are confident the serialized items are authoritative. |
| `CreateOnly`            | The CLI may create new items but will not update or delete existing ones. Ideal for areas where the initial structure is provisioned via serialization, but ongoing edits happen in the target environment.                                         |

If `allowedPushOperations` is omitted, the CLI defaults to `createUpdateAndDelete`. In the
IDKSitecore module, the root `Content.IDKSitecore` enables full CRUD, but its `Site Grouping`
subtree is limited to `CreateOnly` to avoid overwriting runtime configuration.

## Pull Items from a Source Environment

1. Pull serialized items into the repository:

    ```powershell
    sitecore ser pull -n dev
    ```

    - Add `--dry-run` for a preview.
    - The command populates or updates the `.yml` files under `authoring/items/idkSitecore`.

2. Review the changes locally (`git status`, `git diff`) and commit as needed.

> Tip from Fishtank: Organize your modules so every serialized path is intentional and review the
> diffs before committing to avoid bloating the repo with unnecessary Sitecore items.

## Push Items to Another Environment

1. Preview the push:

    ```powershell
    sitecore ser push -n qa
    ```

2. Monitor the output for warnings about `allowedPushOperations`. For example, items under
   `Site Grouping` will show skipped updates because they are `CreateOnly`.

3. (Optional) Clean up serialized items that no longer exist in source environments using
   `dotnet sitecore ser cleanup --module idkSitecore`, then re-run the push.

## Troubleshooting

-   **Authentication errors**: Refresh the login with `dotnet sitecore cloud login`; tokens may have
    expired (see the `expiresIn` value in `.sitecore/user.json`).
-   **Permission issues**: Confirm `allowWrite` is `true` for the target environment and that your
    XM Cloud role permits serialization writes.
-   **Unexpected deletions**: Use `--dry-run` to review operations, adjust `allowedPushOperations`,
    or narrow the scope via module `rules`.
-   **Large pushes timing out**: Push smaller batches by temporarily limiting the module scope or by
    using additional module files, as suggested in the Fishtank guide.

## References

-   Sitecore Documentation -
    [The CLI serialization command](https://doc.sitecore.com/xp/en/developers/100/developer-tools/the-cli-serialization-command.html)
-   Fishtank -
    [How to Add New Items to Your XM Cloud Serialization](https://www.getfishtank.com/insights/how-to-add-new-items-to-your-xm-cloud-serialization)

## Appendix: Provisioning local-only system items

The disconnected Docker stack needs a Sitecore API key and rendering-host definitions that are not committed to source control. After the containers start and the CLI is connected (see steps above), run:

```powershell
$site = "content-sdk-test"
$apiKey = (Select-String -Path "..\local-containers\.env" -Pattern "^SITECORE_API_KEY_APP_STARTER=").Line.Split("=")[1]
./local-containers/docker/build/cm/templates/import-templates.ps1 -RenderingSiteName $site -SitecoreApiKey $apiKey
```

This script copies the module template under `local-containers/docker/build/cm/templates/modules_template`, replaces `<SITENAME>` and `<SITECORE-API-KEY>`, and executes `dotnet sitecore ser push -s --config ...` so the API key lives under `/sitecore/system/Settings/Services/API Keys/$site`.

Afterwards, fill `/sitecore/system/Settings/Services/Rendering Hosts/Default` with the local renderer URLs:

- Endpoint: `https://nextjs.xmc-starter-js.localhost/api/editing/render`
- Application: `https://nextjs.xmc-starter-js.localhost`
- Config: `https://nextjs.xmc-starter-js.localhost/api/editing/config`
- Application name: `content-sdk-test`

> Consider serializing these items in a dedicated module if you want them under source control; until then they can be recreated on demand with the script above.
