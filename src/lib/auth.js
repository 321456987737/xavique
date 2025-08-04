// import GitHubProvider from "next-auth/providers/github";
// import GoogleProvider from "next-auth/providers/google";
// import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "./db";
import User from "@/model/User";
export const authOptions = {
  providers: [
    //   GitHubProvider({
    //     clientId: process.env.GITHUB_ID,
    //     clientSecret: process.env.GITHUB_SECRET
    //   }),
    //   GoogleProvider({
    //     clientId: process.env.GOOGLE_CLIENT_ID,
    //     clientSecret: process.env.GOOGLE_CLIENT_SECRET
    //   })
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
        // username: { label: "Username", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password ) {
          throw new Error("Email and password are required");
        }
        try {
          await dbConnect();
        
          const user = await User.findOne({ email: credentials.email });
        
          if (!user) {
            throw new Error("Invalid email or password");
          }

          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            throw new Error("Invalid email or password");
          }
          
          return {
            id: user._id,
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          
          // Re-throw known errors to preserve their messages
          if (error.message === "Invalid email or password" ||
              error.message === "Email and password are required") {
            throw error;
          }
          
          // For unknown errors, throw a generic message
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  callbacks:{
   async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
   },
   async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session;
   },
   async redirect({ url, baseUrl }) {
    return `${baseUrl}/collection`; // redirect to dashboard after login
  },
   //   this will work when i sign in with providers like google or github  
   //   async signIn({ user, account, profile, email, credentials }) {
   //    return true
   //  },
  },
  pages: {
    signIn: "/signin",
    error: "/signin", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
