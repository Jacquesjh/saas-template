import {ConfigProps} from "@/types";

const config = {
  // REQUIRED
  appName: "saas-template",
  // REQUIRED: a short description of your app for SEO tags (can be overwritten)
  appDescription: "saas-template-739eb",
  // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
  domainName: "saas-template-739eb",
  crisp: {
    // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
    id: "",
    // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
    onlyShowOnRoutes: ["/"],
  },
  stripe: {
    // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
    plans: [
      {
        //  REQUIRED - Name of the plan, displayed on the pricing page
        name: "Free",
        // A friendly description of the plan, displayed on the pricing page. Tip: explain why this plan and not others
        description: "Perfect for casual creators and beginners",
        // REQUIRED — we use this to find the plan in the webhook (for instance if you want to update the user's credits based on the plan)
        priceIds: [
          {
            frequency: "once",
            priceId:
              process.env.NODE_ENV === "development"
                ? "priceId_free_once"
                : "priceId_free_once_prod",
          },
        ],
        // The price you want to display, the one user will be charged on Stripe.
        prices: [{frequency: "once", price: 0}],
        // If you have an anchor price (i.e. $29) that you want to display crossed out, put it here. Otherwise, leave it empty
        // priceAnchor: 149,
        features: [
          {
            name: "Create up to 5 split-screen videos per month",
          },
          {name: "720p video quality"},
          {name: "Community support"},
          {name: "Emails"},
        ],
      },
      {
        priceIds: [
          {
            frequency: "monthly",
            priceId:
              process.env.NODE_ENV === "development"
                ? "priceId_pro_monthly"
                : "priceId_pro_monthly_prod",
          },
          {
            frequency: "yearly",
            priceId:
              process.env.NODE_ENV === "development"
                ? "priceId_pro_yearly"
                : "priceId_pro_yearly_prod",
          },
        ],
        // This plan will look different on the pricing page, it will be highlighted. You can only have one plan with isFeatured: true
        isRecurrent: true,
        name: "Pro",
        description: "Ideal for regular content creators and influencers",
        // The price you want to display, the one user will be charged on Stripe.
        prices: [
          {frequency: "monthly", price: 5},
          {frequency: "yearly", price: 40},
        ],
        priceAnchor: 10,
        features: [
          {
            name: "Unlimited split-screen video creation",
          },
          {name: "Multiple split layouts (60/40, 70/30, etc.)"},
          {name: "1080p video quality"},
          {
            name: "Coming: Export to TikTok, Instagram Reels, and YouTube Shorts",
          },
          {name: "Coming: Auto caption"},
          {name: "Priority email support"},
        ],
      },
      {
        priceIds: [
          {
            frequency: "once",
            priceId:
              process.env.NODE_ENV === "development"
                ? "priceId_founder_once"
                : "priceId_founder_once_prod",
          },
        ],
        isFeatured: true,
        name: "Founder",
        description: "One-time payment for serious creators and businesses",
        prices: [{frequency: "once", price: 40}],
        priceAnchor: 120,
        features: [
          {name: "Lifetime access to SplitScreen"},
          {
            name: "Unlimited split-screen video creation",
          },
          {name: "Multiple split layouts (60/40, 70/30, etc.)"},
          {name: "1080p video quality"},
          {
            name: "Coming: Export to TikTok, Instagram Reels, and YouTube Shorts",
          },
          {name: "Coming: Auto caption"},
          {name: "Priority email support"},
        ],
      },
    ],
  },
  mailgun: {
    // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
    subdomain: "mg",
    // REQUIRED — Email 'From' field to be used when sending magic login links
    fromNoReply: `SplitScreen <noreply@mg.splitscreen.studio>`,
    // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
    fromAdmin: `Matt at SplitScreen <matt@mg.splitscreen.studio>`,
    // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
    supportEmail: "matt@mg.splitscreen.studio",
    // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
    forwardRepliesTo: "jacquesmats@gmail.com",
  },
  colors: {
    // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
    theme: "dark",
    // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
    // OR you can just do this to use a custom color: main: "#f37055". HEX only.
    main: "#90041e",
  },
  auth: {
    // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
    loginPath: "/api/login",
    logoutPath: "/api/logout",
    refreshTokenPath: "/api/refresh-token",
    // REQUIRED — the path you want to redirect users after successfull login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
    callbackUrl: "/",
  },
} as ConfigProps;

export default config;
