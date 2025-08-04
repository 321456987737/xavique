"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function TestSignIn() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testInvalidCredentials = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: "invalid@test.com",
        password: "wrongpassword",
      });
      
      setResult({
        type: "signin_result",
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url
      });
    } catch (error) {
      setResult({
        type: "catch_error",
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const testEmptyCredentials = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: "",
        password: "",
      });
      
      setResult({
        type: "signin_result",
        ok: result?.ok,
        error: result?.error,
        status: result?.status,
        url: result?.url
      });
    } catch (error) {
      setResult({
        type: "catch_error",
        message: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">Authentication Error Testing</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testInvalidCredentials}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Invalid Credentials"}
        </button>
        
        <button
          onClick={testEmptyCredentials}
          disabled={loading}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 ml-4"
        >
          {loading ? "Testing..." : "Test Empty Credentials"}
        </button>
      </div>

      {result && (
        <div className="bg-white p-4 rounded border">
          <h2 className="text-lg font-semibold mb-2 text-black">Test Result:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto text-black">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}