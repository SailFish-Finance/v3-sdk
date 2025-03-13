# Contributing to SailFish DEX v3 SDK

Thank you for your interest in contributing to the SailFish DEX v3 SDK! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an open and welcoming environment.

## Getting Started

1. Fork the repository on GitHub
   ```bash
   https://github.com/SailFish-Finance/v3-sdk
   ```
2. Clone your fork locally
   ```bash
   git clone https://github.com/YOUR-USERNAME/v3-sdk.git
   cd v3-sdk
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Create a branch for your feature or bugfix
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. Make your changes
2. Run tests to ensure your changes don't break existing functionality
   ```bash
   npm test
   ```
3. Build the project to verify it compiles correctly
   ```bash
   npm run build
   ```
4. Commit your changes with a descriptive commit message
   ```bash
   git commit -m "Add feature: your feature description"
   ```
5. Push your branch to your fork
   ```bash
   git push origin feature/your-feature-name
   ```
6. Open a pull request from your fork to the main repository

## Pull Request Guidelines

When submitting a pull request, please ensure:

1. Your code follows the project's coding style and conventions
2. You have added tests for your changes
3. All tests pass
4. Your changes are documented
5. Your PR has a descriptive title and detailed description

### PR Title Format

Use a clear, descriptive title that summarizes the change. Prefix the title with one of the following:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding or modifying tests
- `chore:` for changes to the build process or auxiliary tools

Example: `feat: Add support for exact output multi-hop swaps`

## Example Scripts

**IMPORTANT**: For any new feature or significant change, you must add an example script in the `examples` directory that demonstrates the feature. This is a strict requirement for the following reasons:

1. Examples serve as documentation for users
2. They verify that your code works as expected in a real-world scenario
3. They help maintainers understand and review your changes

Your PR may be rejected if it doesn't include appropriate example scripts or if the provided examples don't run correctly.

Guidelines for example scripts:

- Place them in the `examples` directory
- Use clear, descriptive filenames (e.g., `multihop-swap.js`)
- Include detailed comments explaining what the code does
- Make sure they run successfully with the latest code
- Handle errors appropriately
- Include console output that shows the expected results

## Coding Standards

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Write clear comments for complex logic
- Document public APIs with JSDoc comments

## Testing

- Write unit tests for all new functionality
- Ensure all tests pass before submitting a PR
- Include integration tests for complex features

## Documentation

- Update the README.md if your changes affect the public API or usage
- Add JSDoc comments to all public methods and classes
- Include examples for new features

## Versioning

We follow [Semantic Versioning](https://semver.org/). When contributing, consider the impact of your changes:

- **MAJOR** version for incompatible API changes
- **MINOR** version for adding functionality in a backwards compatible manner
- **PATCH** version for backwards compatible bug fixes

## Reporting Bugs

When reporting bugs, please include:

1. A clear, descriptive title
2. Steps to reproduce the issue
3. Expected behavior
4. Actual behavior
5. Environment information (OS, Node.js version, etc.)
6. Any relevant code snippets or error messages

## Feature Requests

Feature requests are welcome! When submitting a feature request, please:

1. Use a clear, descriptive title
2. Provide a detailed description of the proposed feature
3. Explain why this feature would be useful
4. Include examples of how the feature would be used

## Questions

If you have questions about the project, please open an issue with the prefix `[Question]` in the title.

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
