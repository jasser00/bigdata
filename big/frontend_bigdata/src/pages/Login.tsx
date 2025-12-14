// filepath: /home/jasser/Desktop/big/frontend_bigdata/src/pages/Login.tsx
import React from 'react';

export default function Login() {
  return (
    <div>
      <h2>Login</h2>
      <p>Authentication page (optional).</p>
      <form>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}