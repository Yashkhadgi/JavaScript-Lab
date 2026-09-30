# Strict Session Management Logic

This document explains the logic and flow of the strict session management implementation for Task 5.

## Core Concepts

To simulate strict session management (where a user cannot go back to a protected page after logout) in a pure client-side environment, we use the following strategies:

1.  **State Storage**:
    *   `localStorage`: Acts as our "database" to persistently store registered users' credentials.
    *   `sessionStorage`: Acts as our "session token". It stores the active user's state only for the duration of the page session (until the tab/browser is closed or they log out).
2.  **Navigation (`window.location.replace`)**:
    *   Instead of standard links or `window.location.href`, we use `window.location.replace('url')`.
    *   **Why?** `replace()` replaces the current resource in the history list. This means the user cannot use the "Back" button to return to the previous page. If they log out from the dashboard, the dashboard is removed from the history stack, preventing them from going back to it.
3.  **Route Protection (Page Load Checks)**:
    *   **Dashboard (Protected)**: A script runs immediately upon loading `dashboard.html`. It checks if a valid session exists in `sessionStorage`. If not, it forcefully redirects to `index.html` using `replace()`.
    *   **Login/Register (Public)**: A script runs on `index.html` checking for an active session. If a user is already logged in, it prevents them from seeing the login page by redirecting them to the dashboard.
4.  **Cache Prevention**:
    *   We include specific meta tags in the `<head>` of the HTML to instruct the browser not to cache the page. This prevents the browser from showing a cached version of the dashboard if the user tries to cleverly navigate back.

## Flow Diagram

```mermaid
graph TD
    Start((Start)) --> VisitIndex[User visits index.html]
    VisitIndex --> CheckSessionIndex{Is sessionStorage valid?}
    
    CheckSessionIndex -- Yes --> RedirectDash[location.replace('dashboard.html')]
    CheckSessionIndex -- No --> ShowAuth[Show Login/Register Form]
    
    ShowAuth --> RegisterFlow[User Registers]
    RegisterFlow --> SaveLocal[Save credentials to localStorage]
    SaveLocal --> ShowAuth
    
    ShowAuth --> LoginFlow[User Submits Login]
    LoginFlow --> CheckCreds{Check vs localStorage}
    
    CheckCreds -- Invalid --> ShowError[Show Error Message]
    CheckCreds -- Valid --> SetSession[Set sessionStorage 'active_session']
    SetSession --> RedirectDash
    
    RedirectDash --> VisitDash[User visits dashboard.html]
    VisitDash --> CheckSessionDash{Is sessionStorage valid?}
    
    CheckSessionDash -- No --> RedirectIndex[location.replace('index.html')]
    CheckSessionDash -- Yes --> RenderDash[Render Dashboard Content]
    
    RenderDash --> ActionLogout[User clicks Logout]
    ActionLogout --> ClearSession[Clear sessionStorage]
    ClearSession --> RedirectIndex
```
