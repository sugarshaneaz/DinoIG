import { getUncachableRevenueCatClient } from "./revenueCatClient";

import {
  listProjects,
  createProject,
  listApps,
  createApp,
  listAppPublicApiKeys,
  listProducts,
  createProduct,
  listEntitlements,
  createEntitlement,
  attachProductsToEntitlement,
  listOfferings,
  createOffering,
  updateOffering,
  listPackages,
  createPackages,
  attachProductsToPackage,
  type App,
  type Product,
  type Project,
  type Entitlement,
  type Offering,
  type Package,
  type CreateProductData,
} from "@replit/revenuecat-sdk";

const PROJECT_NAME = "Dino IG";

// Monthly subscription
const MONTHLY_IDENTIFIER = "dino_ig_monthly";
const MONTHLY_PLAY_IDENTIFIER = "dino_ig_monthly:monthly";
const MONTHLY_DISPLAY_NAME = "Dino IG Monthly";
const MONTHLY_TITLE = "All Dinosaurs – Monthly";
const MONTHLY_DURATION = "P1M";
const MONTHLY_PRICES = [{ amount_micros: 4990000, currency: "USD" }];

// Lifetime purchase
const LIFETIME_IDENTIFIER = "dino_ig_lifetime";
const LIFETIME_PLAY_IDENTIFIER = "dino_ig_lifetime:lifetime";
const LIFETIME_DISPLAY_NAME = "Dino IG Lifetime Access";
const LIFETIME_TITLE = "All Dinosaurs – Lifetime";
const LIFETIME_DURATION = "P1Y";
const LIFETIME_PRICES = [{ amount_micros: 14990000, currency: "USD" }];

const APP_STORE_APP_NAME = "Dino IG iOS";
const APP_STORE_BUNDLE_ID = "com.sameheights.dinoig";
const PLAY_STORE_APP_NAME = "Dino IG Android";
const PLAY_STORE_PACKAGE_NAME = "com.sameheights.dinoig";

const ENTITLEMENT_IDENTIFIER = "premium";
const ENTITLEMENT_DISPLAY_NAME = "Premium Access";

const OFFERING_IDENTIFIER = "default";
const OFFERING_DISPLAY_NAME = "Default Offering";

type TestStorePricesResponse = {
  object: string;
  prices: { amount_micros: number; currency: string }[];
};

async function seedRevenueCat() {
  const client = await getUncachableRevenueCatClient();

  // ── Project ──────────────────────────────────────────────────────────────
  let project: Project;
  const { data: existingProjects, error: listProjectsError } = await listProjects({
    client,
    query: { limit: 20 },
  });
  if (listProjectsError) throw new Error("Failed to list projects");

  const existingProject = existingProjects.items?.find((p) => p.name === PROJECT_NAME);
  if (existingProject) {
    console.log("Project already exists:", existingProject.id);
    project = existingProject;
  } else {
    const { data: newProject, error } = await createProject({ client, body: { name: PROJECT_NAME } });
    if (error) throw new Error("Failed to create project");
    console.log("Created project:", newProject.id);
    project = newProject;
  }

  // ── Apps ─────────────────────────────────────────────────────────────────
  const { data: apps, error: listAppsError } = await listApps({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listAppsError || !apps || apps.items.length === 0) throw new Error("No apps found");

  let app: App | undefined = apps.items.find((a) => a.type === "test_store");
  let appStoreApp: App | undefined = apps.items.find((a) => a.type === "app_store");
  let playStoreApp: App | undefined = apps.items.find((a) => a.type === "play_store");

  if (!app) throw new Error("No test store app found");
  console.log("Test store app:", app.id);

  if (!appStoreApp) {
    const { data: newApp, error } = await createApp({
      client,
      path: { project_id: project.id },
      body: { name: APP_STORE_APP_NAME, type: "app_store", app_store: { bundle_id: APP_STORE_BUNDLE_ID } },
    });
    if (error) throw new Error("Failed to create App Store app");
    appStoreApp = newApp;
    console.log("Created App Store app:", appStoreApp.id);
  } else {
    console.log("App Store app:", appStoreApp.id);
  }

  if (!playStoreApp) {
    const { data: newApp, error } = await createApp({
      client,
      path: { project_id: project.id },
      body: { name: PLAY_STORE_APP_NAME, type: "play_store", play_store: { package_name: PLAY_STORE_PACKAGE_NAME } },
    });
    if (error) throw new Error("Failed to create Play Store app");
    playStoreApp = newApp;
    console.log("Created Play Store app:", playStoreApp.id);
  } else {
    console.log("Play Store app:", playStoreApp.id);
  }

  // ── Products ──────────────────────────────────────────────────────────────
  const { data: existingProducts, error: listProductsError } = await listProducts({
    client,
    path: { project_id: project.id },
    query: { limit: 100 },
  });
  if (listProductsError) throw new Error("Failed to list products");

  const ensureProduct = async (
    targetApp: App,
    label: string,
    identifier: string,
    displayName: string,
    title: string,
    duration: string,
    isTestStore: boolean
  ): Promise<Product> => {
    const existing = existingProducts.items?.find(
      (p) => p.store_identifier === identifier && p.app_id === targetApp.id
    );
    if (existing) {
      console.log(`${label} product already exists:`, existing.id);
      return existing;
    }
    const body: CreateProductData["body"] = {
      store_identifier: identifier,
      app_id: targetApp.id,
      type: "subscription",
      display_name: displayName,
    };
    if (isTestStore) {
      body.subscription = { duration };
      body.title = title;
    }
    const { data: created, error } = await createProduct({
      client,
      path: { project_id: project.id },
      body,
    });
    if (error) throw new Error(`Failed to create ${label} product`);
    console.log(`Created ${label} product:`, created.id);
    return created;
  };

  const addPrices = async (productId: string, prices: { amount_micros: number; currency: string }[], label: string) => {
    const { error } = await client.post<TestStorePricesResponse>({
      url: "/projects/{project_id}/products/{product_id}/test_store_prices",
      path: { project_id: project.id, product_id: productId },
      body: { prices },
    });
    if (error) {
      if (typeof error === "object" && "type" in error && error["type"] === "resource_already_exists") {
        console.log(`${label} prices already set`);
      } else {
        throw new Error(`Failed to add ${label} prices`);
      }
    } else {
      console.log(`${label} prices added`);
    }
  };

  // Monthly products
  const monthlyTest     = await ensureProduct(app,          "Monthly Test Store", MONTHLY_IDENTIFIER,       MONTHLY_DISPLAY_NAME, MONTHLY_TITLE, MONTHLY_DURATION, true);
  const monthlyAppStore = await ensureProduct(appStoreApp,  "Monthly App Store",  MONTHLY_IDENTIFIER,       MONTHLY_DISPLAY_NAME, MONTHLY_TITLE, MONTHLY_DURATION, false);
  const monthlyPlay     = await ensureProduct(playStoreApp, "Monthly Play Store", MONTHLY_PLAY_IDENTIFIER,  MONTHLY_DISPLAY_NAME, MONTHLY_TITLE, MONTHLY_DURATION, false);
  await addPrices(monthlyTest.id, MONTHLY_PRICES, "Monthly");

  // Lifetime products
  const lifetimeTest     = await ensureProduct(app,          "Lifetime Test Store", LIFETIME_IDENTIFIER,      LIFETIME_DISPLAY_NAME, LIFETIME_TITLE, LIFETIME_DURATION, true);
  const lifetimeAppStore = await ensureProduct(appStoreApp,  "Lifetime App Store",  LIFETIME_IDENTIFIER,      LIFETIME_DISPLAY_NAME, LIFETIME_TITLE, LIFETIME_DURATION, false);
  const lifetimePlay     = await ensureProduct(playStoreApp, "Lifetime Play Store", LIFETIME_PLAY_IDENTIFIER, LIFETIME_DISPLAY_NAME, LIFETIME_TITLE, LIFETIME_DURATION, false);
  await addPrices(lifetimeTest.id, LIFETIME_PRICES, "Lifetime");

  // ── Entitlement ───────────────────────────────────────────────────────────
  const { data: existingEntitlements, error: listEntErr } = await listEntitlements({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listEntErr) throw new Error("Failed to list entitlements");

  let entitlement: Entitlement;
  const existingEnt = existingEntitlements.items?.find((e) => e.lookup_key === ENTITLEMENT_IDENTIFIER);
  if (existingEnt) {
    console.log("Entitlement already exists:", existingEnt.id);
    entitlement = existingEnt;
  } else {
    const { data: newEnt, error } = await createEntitlement({
      client,
      path: { project_id: project.id },
      body: { lookup_key: ENTITLEMENT_IDENTIFIER, display_name: ENTITLEMENT_DISPLAY_NAME },
    });
    if (error) throw new Error("Failed to create entitlement");
    console.log("Created entitlement:", newEnt.id);
    entitlement = newEnt;
  }

  const { error: attachEntErr } = await attachProductsToEntitlement({
    client,
    path: { project_id: project.id, entitlement_id: entitlement.id },
    body: {
      product_ids: [
        monthlyTest.id, monthlyAppStore.id, monthlyPlay.id,
        lifetimeTest.id, lifetimeAppStore.id, lifetimePlay.id,
      ],
    },
  });
  if (attachEntErr) {
    if (attachEntErr.type === "unprocessable_entity_error") {
      console.log("Products already attached to entitlement");
    } else {
      throw new Error("Failed to attach products to entitlement");
    }
  } else {
    console.log("All products attached to entitlement");
  }

  // ── Offering ──────────────────────────────────────────────────────────────
  const { data: existingOfferings, error: listOffErr } = await listOfferings({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listOffErr) throw new Error("Failed to list offerings");

  let offering: Offering;
  const existingOff = existingOfferings.items?.find((o) => o.lookup_key === OFFERING_IDENTIFIER);
  if (existingOff) {
    console.log("Offering already exists:", existingOff.id);
    offering = existingOff;
  } else {
    const { data: newOff, error } = await createOffering({
      client,
      path: { project_id: project.id },
      body: { lookup_key: OFFERING_IDENTIFIER, display_name: OFFERING_DISPLAY_NAME },
    });
    if (error) throw new Error("Failed to create offering");
    console.log("Created offering:", newOff.id);
    offering = newOff;
  }

  if (!offering.is_current) {
    const { error } = await updateOffering({
      client,
      path: { project_id: project.id, offering_id: offering.id },
      body: { is_current: true },
    });
    if (error) throw new Error("Failed to set offering as current");
    console.log("Set offering as current");
  }

  // ── Packages ──────────────────────────────────────────────────────────────
  const { data: existingPackages, error: listPkgErr } = await listPackages({
    client,
    path: { project_id: project.id, offering_id: offering.id },
    query: { limit: 20 },
  });
  if (listPkgErr) throw new Error("Failed to list packages");

  const ensurePackage = async (lookupKey: string, displayName: string): Promise<Package> => {
    const existing = existingPackages.items?.find((p) => p.lookup_key === lookupKey);
    if (existing) {
      console.log(`Package ${lookupKey} already exists:`, existing.id);
      return existing;
    }
    const { data: newPkg, error } = await createPackages({
      client,
      path: { project_id: project.id, offering_id: offering.id },
      body: { lookup_key: lookupKey, display_name: displayName },
    });
    if (error) throw new Error(`Failed to create package ${lookupKey}`);
    console.log(`Created package ${lookupKey}:`, newPkg.id);
    return newPkg;
  };

  const monthlyPkg  = await ensurePackage("$rc_monthly",  "Monthly Subscription");
  const lifetimePkg = await ensurePackage("$rc_lifetime", "Lifetime Access");

  const attachPkg = async (pkg: Package, products: { product_id: string; eligibility_criteria: string }[], label: string) => {
    const { error } = await attachProductsToPackage({
      client,
      path: { project_id: project.id, package_id: pkg.id },
      body: { products },
    });
    if (error) {
      if (error.type === "unprocessable_entity_error" && error.message?.includes("Cannot attach product")) {
        console.log(`${label} package already has products`);
      } else {
        throw new Error(`Failed to attach products to ${label} package`);
      }
    } else {
      console.log(`Attached products to ${label} package`);
    }
  };

  await attachPkg(monthlyPkg, [
    { product_id: monthlyTest.id,     eligibility_criteria: "all" },
    { product_id: monthlyAppStore.id, eligibility_criteria: "all" },
    { product_id: monthlyPlay.id,     eligibility_criteria: "all" },
  ], "Monthly");

  await attachPkg(lifetimePkg, [
    { product_id: lifetimeTest.id,     eligibility_criteria: "all" },
    { product_id: lifetimeAppStore.id, eligibility_criteria: "all" },
    { product_id: lifetimePlay.id,     eligibility_criteria: "all" },
  ], "Lifetime");

  // ── API Keys ──────────────────────────────────────────────────────────────
  const { data: testKeys }  = await listAppPublicApiKeys({ client, path: { project_id: project.id, app_id: app.id } });
  const { data: iosKeys }   = await listAppPublicApiKeys({ client, path: { project_id: project.id, app_id: appStoreApp.id } });
  const { data: droidKeys } = await listAppPublicApiKeys({ client, path: { project_id: project.id, app_id: playStoreApp.id } });

  console.log("\n====================");
  console.log("RevenueCat setup complete!");
  console.log("Project ID:", project.id);
  console.log("Public API Keys - Test Store:", testKeys?.items.map((i) => i.key).join(", ") ?? "N/A");
  console.log("Public API Keys - App Store:", iosKeys?.items.map((i) => i.key).join(", ") ?? "N/A");
  console.log("Public API Keys - Play Store:", droidKeys?.items.map((i) => i.key).join(", ") ?? "N/A");
  console.log("====================\n");
}

seedRevenueCat().catch(console.error);
