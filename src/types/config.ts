export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  crisp: {
    id?: string;
    onlyShowOnRoutes?: string[];
  };
  stripe: {
    plans: StripePlanProps[];
  };
  aws?: {
    bucket?: string;
    bucketUrl?: string;
    cdn?: string;
  };
  mailgun: {
    subdomain: string;
    fromNoReply: string;
    fromAdmin: string;
    supportEmail?: string;
    forwardRepliesTo?: string;
  };
  colors: {
    theme: string;
    main: string;
  };
  auth: {
    loginUrl: string;
    logoutUrl: string;
    callbackUrl: string;
  };
}

export interface StripePlanProps {
  name: string;
  description?: string;
  // The priceId of the product on the frequencies they are
  // Ex.: priceIds: [{frequency: "montlhly", priceId: "priceId_..."}, {frequency: "yearly", priceId: "priceId_..."}]
  // Ex. 2: priceIds: [{frequency: "once", priceId: "priceId_..."}]
  priceIds: {frequency: string; priceId: string}[];
  // The actual price number of the product on the frequencies they are
  // Ex.: priceIds: [{frequency: "montlhly", price: 10}, {frequency: "yearly", price: 100}]
  // Ex. 2: priceIds: [{frequency: "once", price: 20}]
  prices: {frequency: string; price: number}[];
  features: {
    name: string;
  }[];
  ctaText?: string; // Text that appears in the checkout button
  ctaSubtext?: string; // Text that appears below the checkout button
  isFeatured?: boolean;
  isRecurrent?: boolean;
  isSoldOut?: boolean;
  priceAnchor?: number;
}
