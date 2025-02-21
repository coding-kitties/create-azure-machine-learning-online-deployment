# create-azure-machine-learning-deployment

Github Action to create an Azure Machine Learning Online Endpoint

Features:

* Create an Azure Machine Learning Online Endpoint deployment with the use of a deployment YAML file
* Update an existing Azure Machine Learning Online Endpoint with use of a deployment YAML file
* Blue/Green deployment through traffic splitting (Mirroring is also supported)
* Will automatically scale up/down traffic of new and existing deployments
* Checks if resource group, workspace and endpoint exist

For other Azure Machine Learning actions check out:

* [create-aml-online-endpoint](https://github.com/coding-kitties/create-azure-machine-learning-online-endpoint)

## Dependencies on other Github Actions

* Authenticate using [Azure Login](https://github.com/Azure/login)

## 🚀 Usage

### **1. Add to Your Workflow**

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2.3.2

      - uses: Azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}

      - name: Create AML Online Endpoint
        uses: coding-kitties/create-aml-online-endpoint@v0.2.0
        with:
          deployment_file: "path/to/deployment.yml"
          resource_group: "my-resource-group"
          workspace_name: "my-aml-workspace"
          endpoint_name: "my-endpoint"
          traffic: '{ "blue": 80, "green": 20, mirror": {"green": 80} }'
```
