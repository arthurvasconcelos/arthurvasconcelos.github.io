<script setup lang="ts">
import { useA11yHud } from "@a11y-hud/vue"
import type { Theme } from "a11y-hud"

const colorMode = useColorMode()
const theme = computed<Theme>(() => (colorMode.value === "dark" ? "tokyo-night" : "github-light"))

const { setTheme } = useA11yHud({ theme: theme.value })

watch(theme, setTheme)
</script>

