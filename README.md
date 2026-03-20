# Alta Software OJT - Frontend Development Training

This repository contains the source code and internal tasks completed during my On-the-Job Training (OJT) as a Frontend Developer at Alta Software. It serves as a comprehensive record of my practical experience in building ReactJS applications, focusing on robust architecture, state management, and seamless API integration.

## Technical Scope and Responsibilities

Throughout this training program, I developed ReactJS web applications strictly following mentor-guided coding standards and industry best practices. My primary responsibilities involved converting UI designs from Figma into highly modular, reusable React components and managing their rendering efficiently using props, local state, and complex conditional logic. 

A significant portion of the training was dedicated to mastering React Core and advanced Hooks, including `useEffect`, `useContext`, `useRef`, and `React.memo` for performance optimization. I also implemented seamless client-side pagination with numbered page lists to enhance data visualization.

In terms of data management, I architected and managed global application state using Redux and Redux Toolkit. This involved successfully storing, updating, and retrieving data from the Redux store for cross-component usage, ensuring a predictable data flow across the application. Furthermore, I utilized `localStorage` to securely persist essential client-side data across browser sessions.

For network operations, I implemented robust asynchronous data handling logic using `Promise` and `async/await` syntax. This included integrating mock REST APIs using both the native Fetch API and Axios. A key focus was designing logic to handle common API response edge cases, specifically focusing on `401 Unauthorized` and `403 Forbidden` errors. The training concluded with comprehensive internal testing tasks that involved executing complex API calls and rigorously verifying Redux data flows.

## Project Structure

The repository is organized into distinct training modules, each addressing specific technical requirements:

- `Alta/Training/demo0112/` - API integration and Redux data flow practices.
- `Alta/Training/demo0311/` - UI component development and responsive design implementations.
- `Alta/Training/demo2411/` - Logic handling and component lifecycle management.
- `Alta/Training/demo2710fro/` - Advanced state management and routing tasks.
- `Alta/Training/demo2912/` - Final internal testing and combined feature integration.

## Getting Started

To explore the code or run any of these training modules locally, you first need to clone this repository to your local machine using the command `git clone https://github.com/Lemin9802/Alta-OJT.git`. Once cloned, navigate into the specific project folder you wish to run, for example, `cd Alta-OJT/Alta/Training/demo0112`. Inside the module's directory, execute `npm install` to install all necessary dependencies. Finally, start the local development server by running `npm start`.
