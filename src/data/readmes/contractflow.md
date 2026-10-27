# ContractFlow - Streamline Your Project Payments 🚀

## Description

ContractFlow is a modern solution designed to simplify how you manage and track project payments. From planning and budgeting to creating and paying contractors, ContractFlow provides the tools you need to handle your projects with confidence and ease.

## Features

-   **Project Planning**: Define project scopes, set budgets, and track progress.
-   **Contractor Management**: Easily create, manage, and pay your contractors.
-   **Payment Tracking**: Keep a close eye on all payments, ensuring accuracy and transparency.
-   **Budgeting Tools**: Stay within budget with comprehensive cost estimation and tracking.

<img width="1043" height="775" alt="ContractFlow-Demo-project-01-12-2026_11_43_AM" src="https://github.com/user-attachments/assets/a83cf24d-d385-424f-ab9a-1ee073d7b7a1" />

## Installation

To get started with ContractFlow, follow these simple steps:

1.  Clone the repository:

    ```bash
    git clone [repository-url]
    ```

2.  Install the dependencies:

    ```bash
    bun install
    ```

## Usage

To run the application in development mode:

```bash
bun run dev
```

### Password Reset CLI Tool

For administrative purposes, you can reset user passwords directly from the command line:

```bash
bun password-reset.js <email> <new-password>
```

Or using npm scripts:

```bash
bun run password-reset <email> <new-password>
```

**Examples:**

```bash
# Reset password for a specific user
bun password-reset.js user@example.com newSecurePass123

# Using the npm script
bun run password-reset admin@company.com Admin2026!
```
