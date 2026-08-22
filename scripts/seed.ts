import { seedDatabase } from "@/lib/db/seed";

async function main() {
  console.log("🌱 Seeding VALA database...");
  const counts = await seedDatabase();
  console.log("✅ Seed complete:", counts);
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
