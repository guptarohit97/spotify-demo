import { clerkClient } from "@clerk/express"

// Protect routes (user must be logged in)
export const protectRoute = async (req, res, next) => {
  try {
    // Clerk attaches auth to req.auth
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        message: "Unauthorized - you must be logged in.",
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    })
  }
}

// Require admin access
export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        message: "Unauthorized - you must be logged in.",
      })
    }

    // Fetch current user from Clerk
    const currentUser = await clerkClient.users.getUser(req.auth.userId)

    const primaryEmail =
      currentUser.primaryEmailAddress?.emailAddress

    const isAdmin = primaryEmail === process.env.ADMIN_EMAIL

    if (!isAdmin) {
      return res.status(403).json({
        message: "Forbidden - admin access only",
      })
    }

    next()
  } catch (error) {
    console.error("Admin auth error:", error.message)
    return res.status(403).json({
      message: "Forbidden - admin access only",
    })
  }
}
