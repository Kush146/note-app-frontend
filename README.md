Welcome to the NoteVault frontend — a mobile-friendly note-taking application built using ReactJS with TypeScript. This project enables users to register or log in using either Email with OTP or Google Sign-In, and then securely create and delete personal notes. All user actions are authorized using JWT, ensuring secure communication with the backend.

The application features a clean, responsive interface closely replicating the provided design. After a successful signup or login, users are greeted with a welcome page that displays their information and allows them to manage their notes. If a user initially signed up using Google, they can log in with the same method later; otherwise, Google login is optional.

Tech Stack Used:

Frontend: ReactJS (TypeScript)

Styling: Tailwind CSS (or custom CSS)

Authentication: OTP flow via API and Google Sign-In

State Management: React Context or Redux

API Communication: Axios

Routing: React Router

To run this project locally, first clone the repository and navigate to the project folder. Install the dependencies using npm install, then create a .env file in the root directory with the variable VITE_API_URL pointing to your backend (e.g., https://your-backend.onrender.com). Start the development server using npm run dev. The app will be available at http://localhost:5173.

To build the app for production, run npm run build. This will generate a production-ready dist/ folder that you can deploy on services like Netlify or Vercel.

The frontend is integrated with a backend (Node.js + TypeScript) and supports JWT-based authorization for creating and deleting notes. It also handles all necessary input validations and displays meaningful error messages on failure cases (e.g., incorrect OTP or login issues). The UI is fully responsive and optimized for mobile viewing.

You are welcome to contribute to this project. Fork it, make your changes, and submit a pull request. For deployment, please share the live URL once published.

Project created and maintained by Kush Kore.
