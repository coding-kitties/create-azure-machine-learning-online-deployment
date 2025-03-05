import * as core from "@actions/core";
import * as exec from "@actions/exec";
import fs from "fs";

async function checkIfEndpointExists(
    endpointName, resourceGroup, workspaceName
) {
    /**
     * Check if the endpoint exists in the specified resource group and workspace.
     * @param {string} endpointName - The name of the endpoint.
     * @param {string} resourceGroup - The name of the resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @return {boolean} - Returns true if the endpoint exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the endpoint exists
        await exec.exec(`az ml online-endpoint show --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`, [], options);

        console.log("✅ Endpoint already exists. Output:", output);
        return true; // If the command succeeds, the endpoint exists
    } catch (error) {
        return false; // If the command fails, the endpoint does not exist
    }
}

async function checkIfResourceGroupExists(resourceGroup) {
    /**
     * Check if the resource group exists.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the resource group exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };
        // Execute the Azure CLI command
        await exec.exec(`az group show --name ${resourceGroup} --resource-group ${resourceGroup}`, [], options);

        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false; // Return false if the workspace does not exist
    }
}

async function checkIfWorkspaceExists(workspaceName, resourceGroup) {
    /**
     * Check if the workspace exists in the specified resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the workspace exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the workspace exists
        await exec.exec(`az ml workspace show --name ${workspaceName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Resource Group Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Resource Group Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function checkIfRegistryExists(registryName, resourceGroup) {
    /**
     * Check if the registry exists in the specified resource group.
     * @param {string} registryName - The name of the registry.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the registry exists, false otherwise.
     */
    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if the workspace exists
        await exec.exec(`az ml registry show --name ${registryName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Registry Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Registry Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function checkIfModelInRegistryExists(
    modelName, modelVersion, registryName, resourceGroup
) {
    /**
     * Check if the model exists in the specified registry.
     * @param {string} modelName - The name of the model.
     * @param {string} modelVersion - The version of the model.
     * @param {string} registryName - The name of the registry.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the model exists, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if model exists in registry
        await exec.exec(`az ml model show --name ${modelName} --version ${modelVersion} --registry-name ${registryName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Model Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Model Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

async function checkIfModelInWorkspaceExists(
    modelName, modelVersion, workspaceName, resourceGroup
) {
    /**
     * Check if the model exists in the specified workspace.
     * @param {string} modelName - The name of the model.
     * @param {string} modelVersion - The version of the model.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} resourceGroup - The name of the resource group.
     * @return {boolean} - Returns true if the model exists, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Check if model exists in registry
        await exec.exec(`az ml model show --name ${modelName} --version ${modelVersion} --workspace-name ${workspaceName} --resource-group ${resourceGroup}`, [], options);
        console.log("✅ Model Found. Output:", output);
        return true;
    } catch (error) {
        console.log(
            "❌ Model Not Found or Error Occurred:", errorOutput || error.message
        );
        return false;
    }
}

function checkIfFileExists(filePath) {
    /**
     * Check if the specified file exists.
     * @param {string} filePath - The path to the file.
     * @return {Promise<boolean>} - Returns a promise that resolves to true if the file exists, false otherwise.
     */

    return new Promise((resolve, reject) => {
        fs.access(filePath,
            fs.constants.F_OK,
            (err) => {
                if (err) {
                    console.error(`❌ File does not exist: ${filePath}`);
                    resolve(false);
                } else {
                    console.log(`✅ File exists: ${filePath}`);
                    resolve(true);
                }
            }
        );
    }
    );
}

async function createDeployment(
    resourceGroup, workspaceName, deploymentYamlFilePath
) {
    /**
     * Create a deployment using the specified YAML file.
     * @param {string} resourceGroup - The name of the resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} deploymentYamlFilePath - The path to the deployment YAML file.
     * @return {Promise<boolean>} - Returns a promise that resolves to true if the deployment is created successfully, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Create the deployment
        await exec.exec(`az ml online-deployment create --file ${deploymentYamlFilePath} --resource-group ${resourceGroup} --workspace-name ${workspaceName}`, [], options);
        console.log("✅ Deployment created successfully. Output:", output);
        return true;
    } catch (error) {
        console.log("❌ Deployment creation failed. Error:", errorOutput || error.message);
        return false;
    }
}

async function updateDeploymentTraffic(
    resourceGroup, workspaceName, endpointName, deploymentName, traffic) {
    /**
     * Update the traffic for the specified deployment.
     * @param {string} resourceGroup - The name of the resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} endpointName - The name of the endpoint.
     * @param {string} deploymentName - The name of the deployment.
     * @param {string} traffic - The traffic configuration in JSON format.
     * @return {Promise<boolean>} - Returns a promise that resolves to true if the traffic is updated successfully, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Update the traffic
        await exec.exec(`az ml online-endpoint update --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName} --traffic "${deploymentName}"="${traffic}"`, [], options);
        console.log("✅ Traffic updated successfully. Output:", output);
        return true;
    } catch (error) {
        console.log("❌ Traffic update failed. Error:", errorOutput || error.message);
        return false;
    }
}

async function updateDeploymentMirrorTraffic(
    resourceGroup, workspaceName, endpointName, deploymentName, traffic
) {
    /**
     * Update the mirror traffic for the specified deployment.
     * @param {string} resourceGroup - The name of the resource group.
     * @param {string} workspaceName - The name of the workspace.
     * @param {string} endpointName - The name of the endpoint.
     * @param {string} deploymentName - The name of the deployment.
     * @param {string} traffic - The mirror traffic configuration in JSON format.
     * @return {Promise<boolean>} - Returns a promise that resolves to true if the mirror traffic is updated successfully, false otherwise.
     */

    let errorOutput = "";
    let output = "";

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    output += data.toString();
                },
                stderr: (data) => {
                    errorOutput += data.toString();
                }
            },
            silent: true
        };

        // Update the mirror traffic
        await exec.exec(`az ml online-endpoint update --name ${endpointName} --resource-group ${resourceGroup} --workspace-name ${workspaceName} --mirror-traffic "${deploymentName}"="${traffic}"`, [], options);
        console.log("✅ Mirror Traffic updated successfully. Output:", output);
        return true;
    } catch (error) {
        console.log("❌ Mirror Traffic update failed. Error:", errorOutput || error.message);
        return false;
    }
}

try {
    const endpointName = core.getInput("endpoint_name");
    const resourceGroup = core.getInput("resource_group");
    const workspaceName = core.getInput("workspace_name");
    const registryName = core.getInput("registry_name");
    const registryResourceGroup = core.getInput("registry_resource_group");
    const modelName = core.getInput("model_name");
    const modelVersion = core.getInput("model_version");
    const traffic = core.getInput("traffic");
    const deploymentYamlFilePath = core.getInput("deployment_yaml_file_path");

    // Check if the required inputs are provided
    if (!endpointName) {
        throw new Error("Endpoint name is required.");
    }

    if (!resourceGroup) {
        throw new Error("Resource group is required");
    }

    if (!workspaceName) {
        throw new Error("Workspace name is required");
    }

    if (!modelName) {
        throw new Error("Model name is required");
    }

    if (!modelVersion) {
        throw new Error("Model version is required");
    }

    if (!traffic) {
        throw new Error("Traffic is required");
    }

    // Check if the resource group exists
    console.log(`🔹 Checking if resource group '${resourceGroup}' exists...`)
    ;
    const resourceGroupExists = await checkIfResourceGroupExists(resourceGroup);

    if (!resourceGroupExists) {
        throw new Error(`Resource group '${resourceGroup}' does not exist.`);
    } else {
        console.log(`✅ Resource group '${resourceGroup}' exists.`);
    }

    // Check if the workspace exists
    console.log(`🔹 Checking if workspace '${workspaceName}' exists in resource group '${resourceGroup}'...`)
    ;
    const workspaceExists = await checkIfWorkspaceExists(workspaceName, resourceGroup);

    if (!workspaceExists) {
        throw new Error(`Workspace '${workspaceName}' does not exist in resource group '${resourceGroup}'.`);
    } else {
        console.log(`✅ Workspace '${workspaceName}' exists in resource group '${resourceGroup}'.`);
    }

    // Check if endpoint exists
    console.log(`🔹 Checking if endpoint '${endpointName}' exists...`);
    const endpointExits = await checkIfEndpointExists(
        endpointName, resourceGroup, workspaceName
    );

    if (!endpointExits) {
        throw new Error(`Endpoint '${endpointName}' does not exist in resource group '${resourceGroup}' and workspace '${workspaceName}'.`);
    } else {
        console.log(`✅ Endpoint '${endpointName}' exists in resource group '${resourceGroup}' and workspace '${workspaceName}''${resourceGroup}'.`);
    }

    // Check if registry name is provided
    if (registryName !== undefined) {

        // Check if the registry exists
        console.log(`🔹 Checking if registry '${registryName}' exists in resource group '${registryResourceGroup}'...`);
        const registryExists = await checkIfRegistryExists(registryName, registryResourceGroup);

        if (!registryExists) {
            throw new Error(`Registry '${registryName}' does not exist in resource group '${registryResourceGroup}'.`);
        } else {
            console.log(`✅ Registry '${registryName}' exists in resource group '${registryResourceGroup}'.`);
        }
    }

    // Check if model exists in registry
    if(registryName !== undefined) {
        console.log(`🔹 Checking if model '${modelName}' exists in registry '${registryName}'...`);

        const modelInRegistryExists = await checkIfModelInRegistryExists(
            modelName, modelVersion, registryName, registryResourceGroup
        );
        if (!modelInRegistryExists) {
            throw new Error(`Model '${modelName}' does not exist in registry '${registryName}'.`);
        } else {
            console.log(`✅ Model '${modelName}' exists in registry '${registryName}'.`);
        }
    } else {
        console.log(`🔹 Checking if model '${modelName}' exists in workspace '${workspaceName}'...`);

        const modelInWorkspaceExists = await checkIfModelInWorkspaceExists(
            modelName, modelVersion, workspaceName, resourceGroup
        );
        if (!modelInWorkspaceExists) {
            throw new Error(`Model '${modelName}' does not exist in workspace '${workspaceName}'.`);
        } else {
            console.log(`✅ Model '${modelName}' exists in workspace '${workspaceName}'.`);
        }
    }

    // Check if deployment YAML file exists
    if (!deploymentYamlFilePath) {
        throw new Error("Deployment YAML file path is required.");
    }
    console.log(`🔹 Checking if deployment YAML file '${deploymentYamlFilePath}' exists...`);

    // Check if the deployment YAML file exists
    const deploymentYamlFileExists = await checkIfFileExists(deploymentYamlFilePath);

    if (!deploymentYamlFileExists) {
        throw new Error(`Deployment YAML file '${deploymentYamlFilePath}' does not exist.`);
    } else {
        console.log(`✅ Deployment YAML file '${deploymentYamlFilePath}' exists.`);
    }

    // Create deployment
    console.log(`🔹 Creating deployment...`)
    const deploymentCreated = await createDeployment(resourceGroup, workspaceName, deploymentYamlFilePath);

    if (!deploymentCreated) {
        throw new Error(`Deployment creation failed.`);
    } else {
        console.log(`✅ Deployment created successfully.`);
    }

    // Parse the traffic input
    const trafficObj = JSON.parse(traffic);

    // Get values for "mirror"
    const trafficEntry = trafficObj["mirror"];

    // Check if "mirror" is present in the traffic object
    if (trafficEntry) {
        // Iterate through the keys of the "mirror" object
        for (const key in trafficEntry) {
            console.log(`🔹 Updating deployment '${key}' with mirror traffic '${trafficObj[key]}%'...`);

            // Update the mirror traffic
            let updateMirrorTraffic = await updateDeploymentMirrorTraffic(
                resourceGroup, workspaceName, endpointName, key, trafficEntry[key]
            );

            if (!updateMirrorTraffic) {
                console.log(`❌ Mirror traffic for '${key}' update failed.`);
            } else {
                console.log(`✅ Mirror traffic for '${key}' updated successfully.`);
            }
        }
    } else {
        console.log("🔹 No mirror traffic specified.");
    }

    // Get the keys of the traffic object except "mirror"
    const prodKeys = Object.keys(trafficObj).filter(key => key !== "mirror");

    // Iterate through the keys of the traffic object and update each deployment
    for (const key of prodKeys) {
        console.log(`🔹 Updating deployment '${key}' with traffic '${trafficObj[key]}%'...`);

        // Update the traffic for the deployment
        let updateTraffic = await updateDeploymentTraffic(
            resourceGroup, workspaceName, endpointName, key, trafficObj[key]
        );

        if (!updateTraffic) {
            console.log(`❌ Traffic for deployment '${key}' update failed.`);
        } else {
            console.log(
                `✅ Traffic for deployment '${key}' updated successfully.`
            );
        }
    }
    console.log("✅ Deployment traffic updated successfully.");
} catch (error) {
    console.log(error.message);
    core.setFailed(`❌ Action failed: ${error.message}`);
}
