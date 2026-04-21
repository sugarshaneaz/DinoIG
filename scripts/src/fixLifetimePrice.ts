import { getUncachableRevenueCatClient } from "./revenueCatClient";
import {
  listProducts,
  createProduct,
  listPackages,
  detachProductsFromPackage,
  attachProductsToPackage,
  attachProductsToEntitlement,
  listEntitlements,
} from "@replit/revenuecat-sdk";

const PROJECT_ID = "projd442d3fa";
const TEST_STORE_APP_ID = "app03cc00b15a";
const APP_STORE_APP_ID = "app845ae583b8";
const PLAY_STORE_APP_ID = "app54ab9b2019";
const OFFERING_ID = "ofrng924bf852bf";
const LIFETIME_PACKAGE_ID = "pkge65810bd8d9";
const OLD_LIFETIME_TEST_PRODUCT_ID = "prodb2e9ffa516";
const NEW_LIFETIME_TEST_PRODUCT_ID = "prode562e3e7ba"; // created in previous run at $14.99

type TestStorePricesResponse = {
  object: string;
  prices: { amount_micros: number; currency: string }[];
};

async function fixLifetimePrice() {
  const client = await getUncachableRevenueCatClient();

  // Check current package contents
  const { data: packages } = await listPackages({
    client,
    path: { project_id: PROJECT_ID, offering_id: OFFERING_ID },
    query: { limit: 20 },
  });
  const lifetimePkg = packages?.items?.find((p) => p.id === LIFETIME_PACKAGE_ID);
  console.log("Lifetime package:", JSON.stringify(lifetimePkg, null, 2));

  // Detach old $4.99 test product (if still attached)
  const { error: detachErr } = await detachProductsFromPackage({
    client,
    path: { project_id: PROJECT_ID, package_id: LIFETIME_PACKAGE_ID },
    body: { product_ids: [OLD_LIFETIME_TEST_PRODUCT_ID] },
  });
  if (detachErr) {
    console.log("Detach note (may already be detached):", JSON.stringify(detachErr));
  } else {
    console.log("Detached old $4.99 product");
  }

  // Attach ONLY the new $14.99 test store product
  const { error: attachErr } = await attachProductsToPackage({
    client,
    path: { project_id: PROJECT_ID, package_id: LIFETIME_PACKAGE_ID },
    body: {
      products: [{ product_id: NEW_LIFETIME_TEST_PRODUCT_ID, eligibility_criteria: "all" }],
    },
  });
  if (attachErr) {
    console.log("Attach error:", JSON.stringify(attachErr));
  } else {
    console.log("✅ Attached new $14.99 product to lifetime package");
  }

  // Verify
  const { data: verifyPkgs } = await listPackages({
    client,
    path: { project_id: PROJECT_ID, offering_id: OFFERING_ID },
    query: { limit: 20 },
  });
  console.log("\nVerification — packages in offering:");
  for (const pkg of (verifyPkgs?.items ?? [])) {
    console.log(" -", pkg.lookup_key, pkg.id);
  }
}

fixLifetimePrice().catch(console.error);
