---
name: 'Terraform Standards'
description: 'Coding conventions, security, and best practices for Terraform files'
applyTo: '**/*.tf,**/*.tfvars'
---

# Terraform Coding Standards

## Style Guide
- Follow the [HashiCorp Terraform Style Conventions](https://developer.hashicorp.com/terraform/language/style)
- Use 2 spaces for indentation — no tabs
- Use snake_case for all resource names, variables, and outputs
- One blank line between top-level blocks
- Order block arguments: meta-arguments first (`count`, `for_each`, `depends_on`), then required, then optional

## File Organization
- `main.tf` — Primary resources and provider configuration
- `variables.tf` — All input variable declarations
- `outputs.tf` — All output declarations
- `terraform.tf` or `versions.tf` — Required providers and Terraform version constraints
- `locals.tf` — Local value definitions
- `data.tf` — Data source lookups
- Split large configurations into logical files by resource group (e.g., `network.tf`, `compute.tf`, `storage.tf`)

## Naming Conventions
- Resource names: `<provider>_<resource_type>` with descriptive local name
- Variables: descriptive snake_case, prefixed by component when ambiguous (e.g., `db_instance_class`)
- Outputs: match the resource attribute they expose (e.g., `vpc_id`, `subnet_ids`)
- Tags: always include `Name`, `Environment`, and `ManagedBy = "terraform"`

```hcl
# Good
resource "azurerm_resource_group" "main" {
  name     = "${var.project_name}-${var.environment}-rg"
  location = var.location

  tags = {
    Name        = "${var.project_name}-${var.environment}-rg"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# Bad
resource "azurerm_resource_group" "rg1" {
  name     = "myresourcegroup"
  location = "eastus"
}
```

## Variables
- Always include `description` and `type` for every variable
- Use `default` only when a sensible fallback exists
- Use `validation` blocks for input constraints
- Mark sensitive variables with `sensitive = true`
- Never hardcode values that vary between environments

```hcl
variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}
```

## State & Backend
- Always configure a remote backend (Azure Storage, S3, Terraform Cloud)
- Never commit `*.tfstate` or `*.tfstate.backup` files
- Use state locking to prevent concurrent modifications
- Separate state files per environment

## Modules
- Use modules for reusable infrastructure patterns
- Pin module versions — never use unversioned module sources
- Keep modules focused on a single logical component
- Expose only necessary variables and outputs
- Document modules with a `README.md`

```hcl
module "web_app" {
  source  = "./modules/webapps"
  # Pin to specific version for registry modules:
  # source  = "registry.terraform.io/org/module/azurerm"
  # version = "~> 2.0"

  app_name    = var.app_name
  environment = var.environment
  location    = var.location
}
```

## Security
- Never hardcode secrets, keys, or passwords in `.tf` files
- Use `sensitive = true` on variables and outputs that contain secrets
- Reference secrets from a vault (Azure Key Vault, AWS Secrets Manager)
- Restrict provider permissions to least privilege
- Enable encryption at rest and in transit for all storage resources
- Do not use overly permissive security group rules (`0.0.0.0/0` on all ports)

## Formatting & Validation
- Run `terraform fmt -recursive` before committing
- Run `terraform validate` to catch syntax and type errors
- Use `terraform plan` to review changes before applying
- Consider `tflint` or `checkov` for additional static analysis

## Outputs
- Always include `description` for outputs
- Mark sensitive outputs with `sensitive = true`
- Output IDs and endpoints needed by downstream consumers

```hcl
output "resource_group_id" {
  description = "The ID of the created resource group"
  value       = azurerm_resource_group.main.id
}
```
