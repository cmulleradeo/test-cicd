<h1 style="text-align: center;">CARBON--INSTANCE-PROCESS-TEMPLATE</h1>

This is the template repository to start a new process instance for Carbon.

This repository contains:
  - An example of a Carbon instance that reads a file from a GCS bucket and publishes Kafka events
  - The necessary configuration for Babel, eslint and jest
  - The CI/CD to check the quality of the code: linters, test unit and sonar and to publish a docker image of the instance to Adeo's Jfrog registry.

<br />

Table of contents:
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
  - [Source update](#source-update)
  - [Continuous integration and publishing configuration](#continuous-integration-and-publishing-configuration)
    - [Vault](#vault)
    - [Vault Module Editor](#vault-module-editor)
    - [Github Actions secrets](#github-actions-secrets)
- [Create a release](#create-a-release)
- [Deployement](#deployement)

# Prerequisites

Below is the list of resources required:
  - A sonar project with the key matching the name of the newly created repository
  - A service account that has access to the github repository and sonar project
  - A service account with write access to Jfrog docker registry
  - Access to a Vault namespace and Vault Module Editor
  - A pdp-carbon github repository for the Product used for the deployment to Manawa and GCP

# Quick start
## Source update

Update the following place holders from the template :
  - package.json: line 1, change the package name
  - src/index.js: index of the instance that imports all the plugins. To be updated with your own plugins or generic ones.

You can also remove the entire folder `src/my-process-file-to-sql` as it is only here as an example.

## Continuous integration and publishing configuration

Before the CI/CD can be activated, you need to configure the Vault namespace and the secrets to fetch in this file `.github/.vault-config`.
Replace <<<NAMESPACE>>> with your Vault namespace and all the values *<<\<VAULT_PAHT>>>* and *<<\<SECRET_NAME>>>* to match your Vault paths and secrets.

Below is the table showing the different values.
| .config-vault                    | Description                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| VAULT_NAMESPACE                  | Namespace of your Vault                                                               |
| VAULT_PACKAGE_SCOPE              | Scope of the product for your packages (ex: basa, pegase...)                          |
| VAULT_NPM_AUTH                   | Token for a Jfrog service account with read rights                                    |
| VAULT_NPM_REPOSITORY_URL         | Url of the Jfrog NPM registry: https://adeo.jfrog.io/adeo/api/npm/npm/                |
| VAULT_GITHUB_TOKEN               | Token for a Github account with maintainer rights on the repository                   |
| VAULT_SONAR_TOKEN                | Token used for Sonar scanner                                                          |
| VAULT_DOCKER_HP_REPOSITORY_URL   | Url of the off production Jfrog Docker registry: adeo-docker-adeo-carbon-dev.jfrog.io |
| VAULT_DOCKER_PROD_REPOSITORY_URL | Url of the production Jfrog Docker registry: adeo-docker-adeo-carbon-release.jfrog.io |
| VAULT_JFROG_SA_USERNAME          | Username for a Jfrog account with write rights                                        |
| VAULT_JFROG_SA_PASSWORD          | Password for a Jfrog account with write rights                                        |

### Vault

All secrets referenced in the file `.github/.vault-config` must be in Vault.

Below is an example of a Vault configuration using the namespace *adeo/carbon-np* with the `.github/.vault-config` matching that configuration.
>`CARBON/COMMONS`:
>```json
>{
>  "SCOPE": "carbon",
>  "NPM_AUTH": "********",
>  "JFROG_NPM_REPOSITORY_URL": "https://adeo.jfrog.io/adeo/api/>npm/npm/",
>  "GITHUB_TOKEN": "********",
>  "SONAR_TOKEN": "********",
>  "JFROG_HP_REPOSITORY_URL": "adeo-docker-adeo-carbon-dev.jfrog.>io",
>  "JFROG_PROD_REPOSITORY_URL": "adeo-docker-adeo-carbon-release.>jfrog.io",
>  "JFROG_SERVICE_ACCOUNT_USERNAME": "********",
>  "JFROG_SERVICE_ACCOUNT_PASSWORD": "********"
>}
>```
>
>`.github/.vault-config`:
>```
>VAULT_NAMESPACE=adeo/carbon-np
>VAULT_PACKAGE_SCOPE=/secret/data/CARBON/COMMONS SCOPE
>VAULT_NPM_AUTH=/secret/data/CARBON/COMMONS NPM_AUTH
>VAULT_NPM_REPOSITORY_URL=/secret/data/CARBON/COMMONS JFROG_NPM_REPOSITORY_URL
>VAULT_GITHUB_TOKEN=/secret/data/CARBON/COMMONS GITHUB_TOKEN
>VAULT_SONAR_TOKEN=/secret/data/CARBON/COMMONS SONAR_TOKEN
>VAULT_DOCKER_HP_REPOSITORY_URL=/secret/data/CARBON/COMMONS >JFROG_HP_REPOSITORY_URL
>VAULT_DOCKER_PROD_REPOSITORY_URL=/secret/data/CARBON/COMMONS >JFROG_PROD_REPOSITORY_URL
>VAULT_JFROG_SA_USERNAME=/secret/data/CARBON/COMMONS >JFROG_SERVICE_ACCOUNT_USERNAME
>VAULT_JFROG_SA_PASSWORD=/secret/data/CARBON/COMMONS >JFROG_SERVICE_ACCOUNT_PASSWORD
>```

### Vault Module Editor

To be able to access Vault from Gihub Actions, you need to configure a service account from [Vault Module Editor](https://vault-module-editor-adeo-vault-api-prod.apps.z2.acp.adeo.com/)

In the Github tab, create a new entry and add the path(s) to the secrets listed in [Continuous integration and publishing configuration](#Continuous-integration-and-publishing-configuration).

Next take note of the *ROLE_ID* and *SECRET_ID* as you will need to set them in Github Actions secrets.

### Github Actions secrets

Once Vault Module Editor is configured and you have the *ROLE_ID* and *SECRET_ID*, you need to add them as secrets for Github Actions.

Go to the *Settings* tab, then select the menu *Secrets*. Use the button *New repository secret* to add two secrets:
  - VAULT_ROLE_ID: the *ROLE_ID* from Vault Module editor
  - VAULT_SECRET_ID: the *SECRET_ID* from Vault Module editor

# Create a release

**TO BE DEFINED**

To create a new release of the instance, go to the *Actions* tab and select the workflow *Create a new release*. Click the button *Run workflow* and in the popup that opens, select the base branch to create the release from and enter the desired version number.

The CI will automatically create a branch ```release/vX.X.X``` matching the version entered and update the package version in ```package.json``` and create a release.
Upon the creation of a tag, the *Publish docker image to Jfrog* is trigered and will build the docker image and publish it to Jfrog.

**Note**: it is possible to enter two types of version:
  - vX.X.X
  - vX.X.X-snapshot.X
Releases with the *snapshot* key will be published to the dev registry, the releases without it will be published to the production registry.

# Deployement

To deploy the published docker image, you will need to create or use an already existing pdp-carbon repository detailed [here](https://docs.priv.pdp.adeo.cloud/CARBON/start.html)
