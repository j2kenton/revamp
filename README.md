# Next.js Full-Stack Application

This is a modern, full-stack web application built with Next.js and a comprehensive suite of tools for development, testing, and production. It includes features like user authentication, a robust form system, and a component library built with shadcn-ui.

## Tech Stack

This project uses a modern, type-safe, and performant tech stack:

- **Framework**: [Next.js](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn-ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**:
  - [Redux Toolkit](https://redux-toolkit.js.org/) for global state.
  - [SWR](https://swr.vercel.app/) for remote data fetching and caching.
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation.
- **Testing**:
  - **Unit/Integration**: [Jest](https://jestjs.io/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
  - **End-to-End**: [Playwright](https://playwright.dev/).
- **Linting & Formatting**: [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/).

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v20.9.0 or later)

### Installation

1. Clone the repository:

    ```sh
    git clone <your-repository-url>
    ```

2. Navigate to the project directory:

    ```sh
    cd app-with-login
    ```

3. Install the dependencies:

    ```sh
    pnpm install
    ```

4. Set up your environment variables by creating a `.env.local` file in the root of the project.

### Running the Development Server

To start the development server, run:

```sh
pnpm dev
```

Open <http://localhost:3000> with your browser to see the result.

## Available Scripts

- `pnpm dev`: Runs the app in development mode.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts a production server.
- `pnpm lint`: Lints the codebase using ESLint.
- `pnpm format`: Formats the codebase using Prettier.
- `pnpm test`: Runs the test suite (Jest and Playwright).
