# NPVRS - National Patient Visit Records System

A comprehensive and secure healthcare management system designed to enable hospitals to manage patient records, track clinical visits, and maintain detailed medical histories with role-based access for hospital staff and super administrators.

## Features

-   **Hospital Management**: Secure registration and authentication for hospitals, profile management, and a dedicated dashboard.
-   **Patient Records**: Create, view, and manage patient profiles with unique, system-generated patient codes.
-   **Clinical Visit Tracking**: Log detailed patient visits including vital signs (blood pressure, weight, temperature), symptoms, diagnosis, and prescriptions.
-   **Super Admin Dashboard**: A central control panel for system administrators to manage hospitals, view system-wide data, and ensure data integrity.
-   **Secure Authentication**: Robust JWT-based authentication for both hospitals and super admins, ensuring secure access to data.
-   **Password Recovery**: Secure "Forgot Password" functionality for both user roles, with email-based token verification.
-   **Modern UI/UX**: A clean, responsive, and intuitive user interface built with React and Tailwind CSS, featuring toast notifications for a seamless user experience.

## Tech Stack

-   **Frontend**: React, React Router, React Hook Form, Tailwind CSS, Axios
-   **Backend**: PHP, MySQL
-   **Authentication**: JSON Web Tokens (JWT)

---

## Installation and Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

-   Node.js (v16 or newer) & npm
-   PHP (v7.4 or newer)
-   MySQL or MariaDB
-   A web server like Apache or Nginx (or use PHP's built-in server)
-   [Composer](https://getcomposer.org/) (for PHP dependencies, if any)
-   An email service/SMTP server for password reset functionality.

### 1. Backend Setup

1.  **Clone the Repository**
    ```bash
    git clone [Your Project's Git Repository URL]
    cd [project-folder]
    ```

2.  **Database Configuration**
    -   Create a new MySQL database.
    -   Import the database schema from `[path/to/your/database.sql]` into your newly created database.
    -   Configure your database connection by editing the credentials in `[path/to/your/backend/conx.php]`.

3.  **Environment Configuration**
    -   Navigate to your backend directory.
    -   Configure the JWT secret key in `[path/to/your/backend/auth.php]`.
    -   Configure your SMTP email settings in `[path/to/your/backend/hospital/forgot_password.php]` and `[path/to/your/backend/superadmin/forgot_password.php]` to enable password resets.

4.  **Serve the Backend**
    -   Place the backend folder in your web server's root directory (e.g., `htdocs` for XAMPP).
    -   Ensure the server is running and the API is accessible (e.g., `http://localhost/npvrs/api/`).

### 2. Frontend Setup

1.  **Navigate to the Frontend Directory**
    ```bash
    cd [frontend-folder-name] # e.g., cd npvrs1
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables**
    -   Create a `.env` file in the root of the frontend directory.
    -   Add the URL of your backend API.

    ```env
    VITE_API_URL=http://localhost/[your-backend-path]/api
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

---

## Usage

### Hospital Portal

-   **Register**: Navigate to `/signup` to register a new hospital.
-   **Login**: Access your dashboard via the `/signin` page.
-   **Manage Patients**: From the dashboard, you can add new patients and view the list of existing patients.
-   **Log a Visit**: Find a patient and create a new visit record, filling in vitals and clinical notes.

### Super Admin Portal

-   **Login**: Access the admin dashboard via `/superadmin/signin`.
-   **Manage Hospitals**: View, approve, or manage hospital accounts.
-   **System Overview**: [Describe the main function of the superadmin dashboard, e.g., view system statistics].

---

## Configuration

Key configuration files that may need to be modified:

-   **Frontend (`.env`)**:
    -   `VITE_API_URL`: The base URL for the backend API.
-   **Backend (`[path/to/backend]/conx.php`)**:
    -   Database host, username, password, and database name.
-   **Backend (`[path/to/backend]/auth.php`)**:
    -   `JWT_SECRET`: A long, random, and secret string for signing tokens.
-   **Backend (`[path/to/backend]/**/*_password.php`)**:
    -   SMTP server details for sending emails.

---

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeatureName`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeatureName`).
6.  Open a Pull Request.

Please ensure your code follows the existing style and that all tests pass.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Author & Contact

Created by **Adamu Baba Sodiq**.

-   GitHub: `@sodiqbhoy1`
-   Email: `sodiqybnl@gmail.com`
-   Project Link: `https://github.com/sodiqbhoy1/npvrshome`
