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
  - [Automatic Deployment](#automatic-deployment)
  - [Manual Deployment](#manual-deployment)
- [Contributing](#contributing)
- [License](#license)
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

- **Node.js (v14 or later)**: [Download Node.js](https://nodejs.org/en/download/)
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

Open your browser and navigate to `http://localhost:3000` (or the port specified in your terminal) to view the site.

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

### Automatic Deployment

The site is configured to deploy to GitHub Pages automatically when changes are pushed to the `main` branch. This is handled by GitHub Actions configured in `.github/workflows`.

### Manual Deployment

If you prefer to deploy manually:

1. **Build the Project**

   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**

   Install the `gh-pages` package globally if you haven't already:

   ```bash
   npm install -g gh-pages
   ```

   Deploy the `dist` folder to the `gh-pages` branch:

   ```bash
   gh-pages -d dist
   ```

3. **Access the Deployed Site**

   Your site should now be live at `https://jovenpaoloangeles.github.io`.

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

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any questions or inquiries, please contact:

- **Email**: [jovenpaoloangeles@gmail.com](mailto:jovenpaoloangeles@gmail.com)
- **Portfolio Website**: [jovenpaoloangeles.github.io](https://jovenpaoloangeles.github.io)
