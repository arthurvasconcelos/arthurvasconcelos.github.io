import axe from "axe-core";

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return;

  const router = useRouter();

  const run = () => {
    setTimeout(async () => {
      const { violations } = await axe.run();
      if (!violations.length) return;

      console.group(`[axe] ${violations.length} violation(s) on ${location.pathname}`);
      violations.forEach((v) => {
        const isCritical = v.impact === "critical" || v.impact === "serious";
        const log = isCritical ? console.error : console.warn;
        log(`[${v.impact?.toUpperCase()}] ${v.id}: ${v.description}`);
        v.nodes.forEach((n) => console.log(" →", n.html));
      });
      console.groupEnd();
    }, 1000);
  };

  router.afterEach(run);
});
