# 🚀 BookIt: Experiences (Frontend)

This is the frontend for the **BookIt** application, a fullstack project built for a technical assignment. It's a React-based web app that allows users to browse and book travel experiences.

This application is built with React (using Vite), TypeScript, and TailwindCSS. It fetches all its data from the [BookIt Backend API](https://github.com/abhimnyu09/book-It_backend) .

## ✨ Features

* **Browse Experiences:** Fetches and displays a grid of all available experiences.
* **Dynamic Search:** A global search bar in the header filters experiences by title in real-time.
* **Detailed View:** Click any experience to see a detailed page with a full description, image, and "About" section.
* **Real-time Availability:** The Details Page fetches real-time booking data. If a slot is already booked, it's visibly disabled and marked as "Booked".
* **Interactive Booking:** Users can select a date, time, and quantity. The price summary updates dynamically.
* **Promo Codes:** A user can apply a promo code (`SAVE10`, `FLAT100`) which is validated by the backend and applied to the final price.
* **Form Validation:** The checkout form validates that all user information (name, email, terms agreement) is filled out before allowing a booking.
* **End-to-End Flow:** Complete user flow from Home -> Details -> Checkout -> Confirmation.

## 💻 Tech Stack

* **Framework:** React 18
* **Bundler:** Vite
* **Language:** TypeScript
* **Styling:** TailwindCSS
* **Routing:** React Router DOM v6
* **Data Fetching:** Axios

---

## 🔧 How to Run Locally

Follow these instructions to get the project running on your local machine.

### Prerequisites

* Node.js (v18.x or higher)
* npm
* The **`booklt-backend` server must be running** locally on `http://localhost:4000`.

### Setup and Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abhimnyu09/book-It_frontend
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd book-It-frontend
    ```

3.  **Install all dependencies:**
    ```bash
    npm install
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to **`http://localhost:5173`** (or the URL shown in your terminal).
