# Testing Plan for BMI Web Application

This document outlines the End-to-End (E2E) testing strategy using **Playwright**.

## Test Scope
The tests cover the critical user journey: Registration -> Login -> BMI Calculation -> Logout.

## Test Environment
- **Tool**: Playwright
- **Target URL**: Production (https://bmi-web-app-chi.vercel.app)
- **Browser**: Chromium (Desktop Chrome)

## Test Cases

### Case 1: User Registration
- **Objective**: Verify that a new user can sign up successfully.
- **Steps**:
  1. Navigate to `/register` page.
  2. Fill in a unique username and password.
  3. Click the "Register" button.
  4. Verify redirection to the Login page.

### Case 2: User Login
- **Objective**: Verify that the registered user can log in.
- **Steps**:
  1. Navigate to `/login` page.
  2. Enter the registered username and password.
  3. Click the "Sign In" button.
  4. Verify redirection to the Dashboard (`/dashboard`).

### Case 3: Calculate BMI (Normal Weight)
- **Objective**: Verify correct BMI calculation and categorization for normal weight.
- **Input**: Weight = 70 kg, Height = 175 cm.
- **Expected Result**: 
  - BMI Value: ~22.86
  - Category: "Normal" displayed on screen.

### Case 4: Calculate BMI (Obese)
- **Objective**: Verify correct BMI calculation and categorization for obesity.
- **Input**: Weight = 100 kg, Height = 160 cm.
- **Expected Result**: 
  - BMI Value: ~39.06
  - Category: "Obese" displayed on screen.

### Case 5: Logout
- **Objective**: Verify that the user can log out securely.
- **Steps**:
  1. Click the "Logout" button on the Dashboard.
  2. Verify redirection back to the Login page.
  3. Ensure access to Dashboard is restricted after logout (optional/implicit).

## How to Run Tests
Execute the following command in the terminal:
```bash
npx playwright test
```
