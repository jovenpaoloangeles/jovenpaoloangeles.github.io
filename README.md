# Academic Portfolio

This is a professional academic portfolio website built with React and Vite. The portfolio showcases academic accomplishments, research experience, publications, creative coding projects, and photography.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

- **Responsive Design**: Ensures compatibility across various devices and screen sizes.
- **Interactive UI**: Smooth animations and transitions using Framer Motion.
- **Modular Components**: Reusable React components for easy maintenance and scalability.
- **Data-Driven Content**: Content like research experiences and activities are stored in separate data files.
- **Search Functionality**: Search and filter recent activities for improved user experience.
- **TypeScript Support**: Improved developer experience with type safety.

## Getting Started

### Prerequisites

- **Node.js (v18 or later)**: [Download Node.js](https://nodejs.org/en/download/) — CI uses Node 22
- **npm (v6 or later)**: Comes with Node.js installation

### Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/jovenpaoloangeles/jovenpaoloangeles.github.io.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd jovenpaoloangeles.github.io
   ```

3. **Install Dependencies**

   ```bash
   npm install
   ```

## Usage

To run the application locally:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal) to view the site.

## Development

- **Start Development Server**

  ```bash
  npm run dev
  ```

- **Build for Production**

  ```bash
  npm run build
  ```

- **Preview Production Build**

  ```bash
  npm run preview
  ```

## Deployment

The site deploys to GitHub Pages automatically when changes are pushed to the `main` branch. The `Deploy to GitHub Pages` workflow (`.github/workflows/deploy.yml`) typechecks, lints, tests, builds, and deploys the site.

## Testing

- **Run the Vitest test suite**

  ```bash
  npm test
  ```

- **Run tests with coverage**

  ```bash
  npm run test:coverage
  ```

- **Run edge function tests** (requires [Deno](https://deno.com/) installed)

  ```bash
  npm run test:edge
  ```

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Make Your Changes**

4. **Commit Your Changes**

   ```bash
   git commit -m "Add your message here"
   ```

5. **Push to Your Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

6. **Open a Pull Request**

## Contact

For any questions or inquiries, please contact:

- **Email**: [jovenpaoloangeles@gmail.com](mailto:jovenpaoloangeles@gmail.com)
- **Portfolio Website**: [jovenpaoloangeles.github.io](https://jovenpaoloangeles.github.io)
