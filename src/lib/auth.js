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
        // Validate input credentials
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials:", {
            hasEmail: !!credentials?.email,
            hasPassword: !!credentials?.password
          });
          return null; // Return null instead of throwing error for better NextAuth handling
        }

        try {
          // Connect to database
          await dbConnect();
          console.log("Database connected successfully");
        
          // Find user by email
          const user = await User.findOne({ email: credentials.email.toLowerCase().trim() });
          console.log("User lookup result:", { found: !!user, email: credentials.email });
        
          if (!user) {
            console.error("User not found for email:", credentials.email);
            return null; // Return null for invalid credentials
          }

          // Verify password
          const isValid = await user.comparePassword(credentials.password);
          console.log("Password validation result:", { isValid });
          
          if (!isValid) {
            console.error("Invalid password for user:", credentials.email);
            return null; // Return null for invalid credentials
          }
          
          // Return user object for successful authentication
          console.log("Authentication successful for user:", user.email);
          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          
          // Return null for any database or system errors
          // This will trigger CredentialsSignin error in NextAuth
          return null;
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
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // This event is called when sign in is successful
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
